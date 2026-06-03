/// <reference path="../pb_data/types.d.ts" />

// Admin-only AI event-recommendation endpoint.
//
// POST /api/admin/event-recommendations
// Authorization: <admin or superuser token>
// Body: { "commune": "...", "wilaya": "...", "establishment_type": "..." }
//
// Eco rules (spec §21):
//   - Input stored as compact summary only — no full user profiles
//   - Same input → cached response (no redundant API call)
//   - Rate-limited: max 10 lifetime requests per admin account
//   - Suggestions are DRAFT only — never auto-published
//   - Uses claude-haiku (smallest capable model) for lowest token cost
//
// Requires env var: ANTHROPIC_API_KEY
// Model: claude-haiku-4-5-20251001

routerAdd("POST", "/api/admin/event-recommendations", (e) => {

    // ── 1. Auth guard ─────────────────────────────────────────────────────────
    if (!e.auth) {
        return e.json(403, { code: 403, message: "Authentication required." });
    }

    const isSuperuser = e.hasSuperuserAuth();
    const adminRoles  = ["super_admin", "wilaya_admin", "establishment_manager", "content_editor"];
    const isAdminRole = !isSuperuser && adminRoles.includes(e.auth.get("role"));

    if (!isSuperuser && !isAdminRole) {
        return e.json(403, { code: 403, message: "Insufficient permissions. Admin role required." });
    }

    const adminId = e.auth.id;

    // ── 2. Parse + validate request body ─────────────────────────────────────
    const body             = e.requestInfo().body;
    const commune          = (body.commune          || "").trim();
    const wilaya           = (body.wilaya           || "").trim();
    const establishmentType = (body.establishment_type || "").trim();

    const validTypes = [
        "youth_house", "youth_hostel", "sports_complex",
        "youth_camp", "polyvalent_hall", "scientific_leisure_center",
    ];

    if (!commune || !wilaya) {
        return e.json(400, { code: 400, message: "commune and wilaya are required." });
    }
    if (establishmentType && !validTypes.includes(establishmentType)) {
        return e.json(400, { code: 400, message: "Invalid establishment_type." });
    }

    // ── 3. Cache check ────────────────────────────────────────────────────────
    // Compact key — no personal data stored
    const inputSummary = "commune:" + commune + "|wilaya:" + wilaya +
        (establishmentType ? "|type:" + establishmentType : "");

    let cached = null;
    try {
        cached = $app.findFirstRecordByFilter(
            "recommendation_requests",
            "input_summary = {:s} && status = 'completed'",
            { s: inputSummary }
        );
    } catch (_) {}

    if (cached) {
        let suggestions = [];
        try { suggestions = JSON.parse(cached.get("suggestions_json")); } catch (_) {}
        return e.json(200, {
            cached:      true,
            request_id:  cached.id,
            suggestions: suggestions,
        });
    }

    // ── 4. Rate limit ─────────────────────────────────────────────────────────
    // Max 10 total requests per admin (no per-row timestamps in PocketBase 0.39
    // base collections, so lifetime count is used instead of per-hour window).
    //
    // Superusers: admin_user relation is null for superuser requests (they live in
    // _superusers, not users), so per-user counting doesn't work. Instead apply a
    // global cap on all records to prevent runaway API consumption.
    if (isSuperuser) {
        const globalTotal = $app.countRecords("recommendation_requests");
        if (globalTotal >= 100) {
            return e.json(429, {
                code:    429,
                message: "Global rate limit reached (100 total requests). Contact a superuser to reset.",
            });
        }
    } else {
        const totalRequests = $app.countRecords(
            "recommendation_requests",
            $dbx.hashExp({ admin_user: adminId })
        );
        if (totalRequests >= 10) {
            return e.json(429, {
                code:    429,
                message: "Rate limit reached (10 requests per account). Contact a superuser to reset.",
            });
        }
    }

    // ── 5. API key check ──────────────────────────────────────────────────────
    const apiKey = $os.getenv("ANTHROPIC_API_KEY");
    if (!apiKey) {
        return e.json(501, {
            code:    501,
            message: "AI integration not configured. Set the ANTHROPIC_API_KEY environment variable.",
        });
    }

    // ── 6. Build compact prompt ───────────────────────────────────────────────
    const estLabel = establishmentType || "tout type d'établissement";
    const prompt =
        "Tu es un assistant pour l'ODEJ (Office des établissements des jeunes) de la wilaya de Béjaïa, Algérie.\n\n" +
        "Génère exactement 4 suggestions d'activités pour les jeunes. Contexte :\n" +
        "- Commune : " + commune + "\n" +
        "- Wilaya : " + wilaya + "\n" +
        "- Type d'établissement : " + estLabel + "\n\n" +
        "Réponds UNIQUEMENT avec un tableau JSON valide, sans texte avant ni après :\n" +
        '[{"title":"...","short_description":"...","category":"Sports|Culture|Training|Volunteering|Health Awareness|Science|Arts|Environment|Youth Orientation|Camps and Trips|Coding|Design|Robotics|Photography|Debate","activity_mode":"physical|online|hybrid","age_min":N,"age_max":N,"is_free":true,"estimated_duration":"2h"}]\n\n' +
        "IMPORTANT : Ces suggestions sont des BROUILLONS soumis à validation. Ne jamais publier automatiquement.";

    // ── 7. Call Anthropic API (with mock fallback for demo) ───────────────────
    let suggestions = [];
    let isMock      = false;

    let aiResponse;
    let aiOk = false;
    try {
        aiResponse = $http.send({
            url:    "https://api.anthropic.com/v1/messages",
            method: "POST",
            headers: {
                "x-api-key":         apiKey,
                "anthropic-version": "2023-06-01",
                "content-type":      "application/json",
            },
            body: JSON.stringify({
                model:      "claude-haiku-4-5-20251001",
                max_tokens: 1024,
                messages:   [{ role: "user", content: prompt }],
            }),
            timeout: 30,
        });
        aiOk = aiResponse.statusCode === 200;
    } catch (_) {}

    // ── 8. Parse AI response ──────────────────────────────────────────────────
    if (aiOk) {
        const responseBody = aiResponse.json;
        const textContent  = responseBody &&
                             responseBody.content &&
                             responseBody.content[0] &&
                             responseBody.content[0].text;

        if (textContent) {
            try {
                suggestions = JSON.parse(textContent);
            } catch (_) {
                const match = textContent.match(/\[[\s\S]*\]/);
                if (match) {
                    try { suggestions = JSON.parse(match[0]); } catch (_) {}
                }
            }
        }
    }

    // ── 8b. Mock fallback ─────────────────────────────────────────────────────
    // Used when AI is unavailable (no credits, network issue, etc.).
    // Returns realistic ODEJ-style draft suggestions so the demo always works.
    if (!Array.isArray(suggestions) || suggestions.length === 0) {
        isMock = true;
        const mockByType = {
            youth_house: [
                { title: "Atelier Sécurité Numérique", short_description: "Sensibilisation aux risques d'Internet et bonnes pratiques numériques.", category: "Coding", activity_mode: "physical", age_min: 14, age_max: 30, is_free: true, estimated_duration: "3h" },
                { title: "Club de Lecture & Débat",    short_description: "Lecture partagée et débat autour d'œuvres de la littérature algérienne.", category: "Debate",  activity_mode: "physical", age_min: 16, age_max: 35, is_free: true, estimated_duration: "2h" },
                { title: "Ateliers de Peinture",       short_description: "Initiation aux techniques de peinture sur toile et verre.", category: "Arts",   activity_mode: "physical", age_min: 12, age_max: 99, is_free: true, estimated_duration: "2h" },
                { title: "Tournoi Sportif Interquartiers", short_description: "Tournoi de football et basketball entre équipes de jeunes de la commune.", category: "Sports", activity_mode: "physical", age_min: 16, age_max: 30, is_free: true, estimated_duration: "8h" },
            ],
            youth_camp: [
                { title: "Séjour Environnement & Nature",  short_description: "Camp immersif autour de l'écologie, la faune et la flore de la région.", category: "Environment", activity_mode: "physical", age_min: 12, age_max: 18, is_free: true, estimated_duration: "5 jours" },
                { title: "Initiation à l'Astronomie",      short_description: "Observations nocturnes et ateliers sur le système solaire.", category: "Science", activity_mode: "physical", age_min: 12, age_max: 20, is_free: true, estimated_duration: "3 jours" },
                { title: "Camp Sportif d'Été",             short_description: "Football, natation, randonnée et jeux collectifs en plein air.", category: "Sports", activity_mode: "physical", age_min: 10, age_max: 18, is_free: true, estimated_duration: "7 jours" },
                { title: "Veillée Culturelle Amazigh",     short_description: "Musique, conte et artisanat autour de la culture amazighe.", category: "Culture", activity_mode: "physical", age_min: 12, age_max: 99, is_free: true, estimated_duration: "2 jours" },
            ],
            scientific_leisure_center: [
                { title: "Initiation à la Robotique",    short_description: "Construction et programmation de robots simples avec Arduino.", category: "Robotics", activity_mode: "physical", age_min: 12, age_max: 22, is_free: true, estimated_duration: "4h" },
                { title: "Club d'Astronomie",            short_description: "Initiation à l'observation des étoiles et planètes.", category: "Science", activity_mode: "physical", age_min: 10, age_max: 25, is_free: true, estimated_duration: "3h" },
                { title: "Atelier Intelligence Artificielle", short_description: "Découverte des bases de l'IA et de l'apprentissage machine.", category: "Coding", activity_mode: "physical", age_min: 15, age_max: 30, is_free: true, estimated_duration: "3h" },
                { title: "Journée Énergie Renouvelable", short_description: "Expériences sur le solaire, l'éolien et l'efficacité énergétique.", category: "Environment", activity_mode: "physical", age_min: 12, age_max: 25, is_free: true, estimated_duration: "5h" },
            ],
            polyvalent_hall: [
                { title: "Formation Infographisme",      short_description: "Initiation à Canva et aux bases du graphisme pour les jeunes.", category: "Design",  activity_mode: "physical", age_min: 16, age_max: 30, is_free: true, estimated_duration: "4h" },
                { title: "Atelier Théâtral",             short_description: "Expression corporelle, improvisation et mise en scène.", category: "Arts",    activity_mode: "physical", age_min: 14, age_max: 35, is_free: true, estimated_duration: "3h" },
                { title: "Journée Orientation Professionnelle", short_description: "CV, entretien d'embauche et présentation des métiers en tension.", category: "Youth Orientation", activity_mode: "physical", age_min: 18, age_max: 35, is_free: true, estimated_duration: "6h" },
                { title: "Sensibilisation Santé",        short_description: "Prévention, premiers secours et hygiène de vie.", category: "Health Awareness", activity_mode: "physical", age_min: 14, age_max: 99, is_free: true, estimated_duration: "3h" },
            ],
        };
        suggestions = mockByType[establishmentType] || mockByType["youth_house"];
    }

    // ── 9. Persist result ─────────────────────────────────────────────────────
    const recColl = $app.findCollectionByNameOrId("recommendation_requests");
    const rec     = new Record(recColl);
    if (!isSuperuser) { rec.set("admin_user", adminId); }
    rec.set("commune",           commune);
    rec.set("wilaya",            wilaya);
    rec.set("establishment_type", establishmentType || "");
    rec.set("input_summary",     inputSummary);
    rec.set("model_provider",    isMock ? "mock" : "anthropic");
    rec.set("model_api_used",    isMock ? "fallback" : "claude-haiku-4-5-20251001");
    rec.set("suggestions_json",  JSON.stringify(suggestions));
    rec.set("status",            "completed");
    $app.save(rec);

    // ── 10. Return draft suggestions ──────────────────────────────────────────
    return e.json(200, {
        cached:      false,
        mock:        isMock,
        request_id:  rec.id,
        suggestions: suggestions,
    });
});
