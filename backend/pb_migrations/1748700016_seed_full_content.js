/// <reference path="../pb_data/types.d.ts" />

// Full content seed so every dashboard screen has data to display.
// Runs after 1748700015 (test users), so youth@chababia.dz and wilaya@chababia.dz exist.
//
// Seeded collections:
//   announcements (7)  · newsletters (5) · documents (5)
//   project_submissions (6) · talent_showcase (5) · registrations (10)
//   recommendation_requests (2) · content_reports (5)

migrate((app) => {

    // ── Relations needed below ─────────────────────────────────────────────────
    const youthUser  = app.findFirstRecordByFilter("users", "email = 'youth@chababia.dz'");
    const wilayaUser = app.findFirstRecordByFilter("users", "email = 'wilaya@chababia.dz'");

    const allActivities      = app.findRecordsByFilter("activities",      "id != ''", "-created", 10, 0);
    const allEstablishments  = app.findRecordsByFilter("establishments",  "id != ''", "-created", 10, 0);

    // ── 1. Announcements ───────────────────────────────────────────────────────
    const annColl = app.findCollectionByNameOrId("announcements");

    const annData = [
        { title: "Fermeture exceptionnelle — MJ Takerietz",           priority: "high",   language: "fr", status: "published", content: "La Maison des Jeunes Takerietz sera fermée du 10 au 14 juin 2026 pour travaux de rénovation. Toutes les activités prévues durant cette période sont reportées. Nous nous excusons pour la gêne occasionnée." },
        { title: "Programme d'été 2026 — Inscriptions ouvertes",       priority: "normal", language: "fr", status: "published", content: "Les inscriptions pour le programme d'été 2026 sont officiellement ouvertes. Plus de 20 activités vous attendent cet été : sports, arts, sciences, camps et bien plus encore. Rendez-vous dans votre maison des jeunes la plus proche." },
        { title: "URGENT — Dernier délai d'inscription Camp Beni Ksila", priority: "urgent", language: "fr", status: "published", content: "Il ne reste que 5 places disponibles au Camp Beni Ksila pour la session juillet 2026. Les inscriptions se clôturent le 20 juin 2026. Ne manquez pas cette opportunité !" },
        { title: "Nouveaux ateliers de programmation — CLS Oued Ghir", priority: "normal", language: "fr", status: "published", content: "Le Centre de Loisirs Scientifiques d'Oued Ghir lance trois nouveaux ateliers : développement web, intelligence artificielle pour débutants et robotique avancée. Ouverts aux jeunes de 15 à 25 ans." },
        { title: "Partenariat ODEJ — Université A. Mira de Béjaïa",    priority: "normal", language: "fr", status: "published", content: "L'ODEJ de Béjaïa signe un partenariat avec l'Université A. Mira pour faciliter l'accès des étudiants aux activités sportives et culturelles. Tarifs préférentiels sur présentation de la carte étudiant." },
        { title: "إعلان هام — برنامج التوجيه المهني 2026",             priority: "high",   language: "ar", status: "published", content: "يسر مديرية الشباب والرياضة ببجاية الإعلان عن انطلاق برنامج التوجيه المهني لفائدة الشباب من 18 إلى 30 سنة. التسجيل مفتوح في جميع دور الشباب ابتداءً من 5 يونيو 2026." },
        { title: "Maintenance du système Chababia — 15 juin 2026",     priority: "normal", language: "fr", status: "draft",     content: "La plateforme Chababia sera indisponible le 15 juin 2026 de 02h00 à 06h00 pour maintenance planifiée. Merci de votre compréhension." },
    ];

    for (let i = 0; i < annData.length; i++) {
        const a = annData[i];
        const rec = new Record(annColl);
        rec.set("title",    a.title);
        rec.set("content",  a.content);
        rec.set("priority", a.priority);
        rec.set("language", a.language);
        rec.set("status",   a.status);
        if (allEstablishments.length > 0) {
            rec.set("related_establishment", allEstablishments[i % allEstablishments.length].id);
        }
        app.save(rec);
    }

    // ── 2. Newsletters ─────────────────────────────────────────────────────────
    const newsColl = app.findCollectionByNameOrId("newsletters");

    const newsData = [
        { title: "Bulletin mensuel ODEJ Béjaïa — Mai 2026",             language: "fr", wilaya: "Béjaïa",  status: "published", published_at: "2026-06-01 08:00:00.000Z", content: "Ce mois-ci, plus de 800 jeunes ont participé aux différentes activités de l'ODEJ Béjaïa. Retrouvez le bilan complet, les photos des événements et les annonces pour juin 2026. Merci à tous les encadreurs et bénévoles pour leur engagement." },
        { title: "Spécial été 2026 — Guide des activités jeunesse",      language: "fr", wilaya: "Béjaïa",  status: "published", published_at: "2026-05-20 09:00:00.000Z", content: "Découvrez toutes les activités prévues cet été dans la wilaya de Béjaïa : camps de montagne à Beni Ksila, ateliers artistiques, tournois sportifs, formations professionnelles et sensibilisation environnementale. Réservez vos places dès maintenant !" },
        { title: "Nos lauréats 2025-2026 — Talents d'exception",         language: "fr", wilaya: "Béjaïa",  status: "published", published_at: "2026-05-01 10:00:00.000Z", content: "Cette année encore la jeunesse de Béjaïa a brillé. Découvrez les portraits de nos jeunes talents : Anis (17 ans, champion régional de robotique), Sara (19 ans, artiste peintre sélectionnée au concours national), et bien d'autres lauréats exceptionnels." },
        { title: "نشرة خاصة — الأنشطة الثقافية لشهر يونيو 2026",       language: "ar", wilaya: "Béjaïa",  status: "published", published_at: "2026-06-02 08:00:00.000Z", content: "تتضمن هذه النشرة برنامج الأنشطة الثقافية المقررة خلال شهر يونيو 2026 بولاية بجاية، من مهرجانات وورشات تكوينية وعروض فنية. ندعو جميع الشباب للمشاركة الفعّالة في هذه الأنشطة." },
        { title: "Ateliers mobiles dans les communes rurales de Béjaïa", language: "fr", wilaya: "Béjaïa",  status: "draft",                                              content: "L'ODEJ lance ses ateliers mobiles dans les communes rurales de la wilaya. Des équipes se déplacent directement dans 15 communes pour animer des ateliers de codage, d'artisanat et de sport. Programme détaillé à venir.", commune: "Oued Ghir" },
    ];

    for (let i = 0; i < newsData.length; i++) {
        const n = newsData[i];
        const rec = new Record(newsColl);
        rec.set("title",           n.title);
        rec.set("content",         n.content);
        rec.set("language",        n.language);
        rec.set("target_wilaya",   n.wilaya || "");
        rec.set("status",          n.status);
        if (n.published_at)        rec.set("published_at",    n.published_at);
        if (n.commune)             rec.set("target_commune",  n.commune);
        if (allActivities.length > 0) {
            rec.set("related_activity", allActivities[i % allActivities.length].id);
        }
        app.save(rec);
    }

    // ── 3. Documents ───────────────────────────────────────────────────────────
    // File field is optional — seed metadata only (no actual PDF upload in a migration)
    const docColl = app.findCollectionByNameOrId("documents");

    const docData = [
        { title: "Guide des services ODEJ Béjaïa 2026",                    language: "fr", category: "orientation", status: "published", description: "Guide complet des services offerts par l'ODEJ Béjaïa : activités, inscriptions, conditions d'accès, calendrier annuel et contacts utiles." },
        { title: "Formulaire d'inscription — Activités estivales 2026",    language: "fr", category: "orientation", status: "published", description: "Formulaire officiel à télécharger, remplir et déposer au guichet de votre maison des jeunes pour s'inscrire aux activités estivales 2026." },
        { title: "Charte des droits et devoirs des jeunes usagers",         language: "fr", category: "legal",       status: "published", description: "Document officiel définissant les droits et devoirs de chaque jeune usager des structures de l'ODEJ. Lecture obligatoire avant toute inscription." },
        { title: "وثيقة — إجراءات الانضمام إلى الأندية الشبابية",          language: "ar", category: "orientation", status: "published", description: "وثيقة رسمية تشرح خطوات وإجراءات الانضمام إلى النوادي والجمعيات الشبابية التابعة للديوان الوطني للشباب بولاية بجاية." },
        { title: "Rapport annuel ODEJ Béjaïa 2025",                        language: "fr", category: "general",     status: "draft",     description: "Rapport d'activité annuel de l'ODEJ Béjaïa pour 2025 : statistiques de fréquentation, bilan des activités, analyse budgétaire et perspectives 2026." },
    ];

    for (let i = 0; i < docData.length; i++) {
        const d = docData[i];
        const rec = new Record(docColl);
        rec.set("title",       d.title);
        rec.set("description", d.description);
        rec.set("language",    d.language);
        rec.set("category",    d.category);
        rec.set("status",      d.status);
        if (allEstablishments.length > 0) {
            rec.set("establishment", allEstablishments[i % allEstablishments.length].id);
        }
        app.save(rec);
    }

    // ── 4. Project submissions ─────────────────────────────────────────────────
    const projColl = app.findCollectionByNameOrId("project_submissions");

    const projData = [
        { project_title: "Application mobile de transport communautaire",  category: "Coding",       commune: "Béjaïa",    status: "accepted",          needed_support: "Accompagnement technique et financement matériel (serveur, domaine)", contact_phone: "0550123456", short_description: "Développement d'une application mobile pour optimiser les transports en commun dans les zones rurales de la wilaya de Béjaïa, avec suivi en temps réel et partage de trajets.", assigned_mentor: "Pr. Hamid Lounis" },
        { project_title: "Jardin communautaire solidaire de Béjaïa",       category: "Environment",  commune: "Béjaïa",    status: "submitted",         needed_support: "Terrain mis à disposition par la mairie, semences, outils de jardinage", contact_phone: "0661234567", short_description: "Création d'un jardin communautaire dans le quartier Ihaddaden pour sensibiliser les jeunes à l'écologie et produire des légumes pour les familles dans le besoin." },
        { project_title: "Atelier de réparation de vélos solidaire",       category: "Training",     commune: "Béjaïa",    status: "reviewed",          needed_support: "Local, outillage de base, pièces de rechange récupérées", contact_phone: "0770987654", short_description: "Atelier gratuit de réparation de vélos pour les jeunes défavorisés, avec formation aux bases de la mécanique cycle et sensibilisation à la mobilité douce." },
        { project_title: "Podcast bilingue sur l'histoire de Kabylie",     category: "Culture",      commune: "Béjaïa",    status: "needs_more_info",   needed_support: "Équipement audio, accompagnement pour la distribution numérique", contact_phone: "0551122334", short_description: "Production d'un podcast bilingue (amazigh/français) racontant l'histoire et les traditions de la Kabylie, diffusé sur les plateformes numériques." },
        { project_title: "Plateforme d'apprentissage du Tamazight en ligne", category: "Coding",     commune: "Oued Ghir", status: "rejected",          needed_support: "Hébergement web, collaboration avec des linguistes et professeurs de Tamazight", contact_phone: "0662233445", short_description: "Site web interactif proposant des cours gratuits de Tamazight pour les jeunes, avec exercices, quiz et dictionnaire illustré." },
        { project_title: "Festival des arts de rue à Béjaïa",              category: "Arts",         commune: "Béjaïa",    status: "submitted",         needed_support: "Autorisations municipales, matériel artistique, budget communication", contact_phone: "0553344556", short_description: "Organisation d'un festival annuel de street art, graffiti et performance artistique dans les espaces publics de Béjaïa pour valoriser les jeunes artistes locaux." },
    ];

    for (let i = 0; i < projData.length; i++) {
        const p = projData[i];
        const rec = new Record(projColl);
        rec.set("user",              youthUser.id);
        rec.set("project_title",     p.project_title);
        rec.set("category",          p.category);
        rec.set("commune",           p.commune);
        rec.set("short_description", p.short_description);
        rec.set("needed_support",    p.needed_support);
        rec.set("contact_phone",     p.contact_phone);
        rec.set("status",            p.status);
        if (p.assigned_mentor)       rec.set("assigned_mentor", p.assigned_mentor);
        if (allEstablishments.length > 0) {
            rec.set("establishment", allEstablishments[i % allEstablishments.length].id);
        }
        app.save(rec);
    }

    // ── 5. Talent showcase ─────────────────────────────────────────────────────
    const talentColl = app.findCollectionByNameOrId("talent_showcase");

    const talentData = [
        { title: "Premier jeu mobile développé à 17 ans",             category: "Coding",      status: "published", published_at: "2026-04-15 10:00:00.000Z", description: "J'ai développé mon premier jeu mobile Android à l'âge de 17 ans avec Unity et C#. Le jeu 'Amazigh Quest' mêle apprentissage de Tamazight et gameplay RPG. Téléchargé plus de 2 000 fois en 3 mois." },
        { title: "Champion régional de natation — 400m nage libre",   category: "Sports",      status: "published", published_at: "2026-03-20 10:00:00.000Z", description: "Médaille d'or au championnat régional de natation (Est algérien) dans la catégorie 400m nage libre, représentant la wilaya de Béjaïa. Préparation pour la sélection nationale 2027." },
        { title: "Exposition de peinture — Lumières de Kabylie",      category: "Arts",        status: "published", published_at: "2026-04-30 10:00:00.000Z", description: "Collection de 15 tableaux à l'huile représentant les paysages et traditions de Kabylie. Exposée à la Maison de la Culture de Béjaïa en avril 2026 avec plus de 300 visiteurs." },
        { title: "Album musical — Éveil amazigh",                     category: "Culture",     status: "published", published_at: "2026-05-10 10:00:00.000Z", description: "Album de 8 compositions mêlant instruments traditionnels kabyles (flûte, bendir) et électronique moderne. Disponible en streaming sur les principales plateformes numériques." },
        { title: "Projet de tri sélectif dans notre lycée",           category: "Environment", status: "draft",                                               description: "Mise en place d'un système de tri sélectif au lycée Amirouche de Béjaïa : sensibilisation de 800 élèves, 60% de réduction des déchets non triés en 3 mois, partenariat avec l'APC." },
    ];

    for (let i = 0; i < talentData.length; i++) {
        const t = talentData[i];
        const rec = new Record(talentColl);
        rec.set("user",        youthUser.id);
        rec.set("title",       t.title);
        rec.set("description", t.description);
        rec.set("category",    t.category);
        rec.set("status",      t.status);
        if (t.published_at)    rec.set("published_at", t.published_at);
        app.save(rec);
    }

    // ── 6. Registrations ───────────────────────────────────────────────────────
    const regColl = app.findCollectionByNameOrId("registrations");

    // Spread across all seeded activities with varied statuses
    const regData = [
        { actIdx: 0, status: "registered",   qr: "QR20260001ABCDEFGHIJKLMNOPQRST", checked_in_at: "" },
        { actIdx: 1, status: "registered",   qr: "QR20260002BCDEFGHIJKLMNOPQRSTU", checked_in_at: "" },
        { actIdx: 2, status: "attended",     qr: "QR20260003CDEFGHIJKLMNOPQRSTUV", checked_in_at: "2026-05-15 10:30:00.000Z" },
        { actIdx: 3, status: "registered",   qr: "QR20260004DEFGHIJKLMNOPQRSTUVW", checked_in_at: "" },
        { actIdx: 4, status: "cancelled",    qr: "QR20260005EFGHIJKLMNOPQRSTUVWX", checked_in_at: "" },
        { actIdx: 5, status: "attended",     qr: "QR20260006FGHIJKLMNOPQRSTUVWXY", checked_in_at: "2026-05-20 09:00:00.000Z" },
        { actIdx: 0, status: "waiting_list", qr: "QR20260007GHIJKLMNOPQRSTUVWXYZ", checked_in_at: "" },
        { actIdx: 2, status: "registered",   qr: "QR20260008HIJKLMNOPQRSTUVWXYZA", checked_in_at: "" },
        { actIdx: 3, status: "attended",     qr: "QR20260009IJKLMNOPQRSTUVWXYZAB", checked_in_at: "2026-05-18 14:00:00.000Z" },
        { actIdx: 5, status: "registered",   qr: "QR20260010JKLMNOPQRSTUVWXYZABC", checked_in_at: "" },
    ];

    for (let i = 0; i < regData.length; i++) {
        const r = regData[i];
        if (r.actIdx >= allActivities.length) continue;
        const rec = new Record(regColl);
        rec.set("user",      youthUser.id);
        rec.set("activity",  allActivities[r.actIdx].id);
        rec.set("full_name", youthUser.get("full_name"));
        rec.set("phone",     "0550111222");
        rec.set("email",     "youth@chababia.dz");
        rec.set("status",    r.status);
        rec.set("qr_code",   r.qr);
        if (r.checked_in_at) rec.set("checked_in_at", r.checked_in_at);
        app.save(rec);
    }

    // ── 7. Recommendation requests ─────────────────────────────────────────────
    const recReqColl = app.findCollectionByNameOrId("recommendation_requests");

    const recReqData = [
        {
            commune: "Béjaïa", wilaya: "Béjaïa", establishment_type: "youth_house",
            input_summary: "béjaïa:youth_house:summer:2026",
            model_provider: "anthropic", model_api_used: "claude-haiku-4-5-20251001",
            status: "completed",
            suggestions_json: JSON.stringify([
                { title: "Camp d'été multidisciplinaire", description: "Une semaine d'activités variées : sport, art, science et orientation professionnelle pour les 14-22 ans.", target_age: "14-22", duration_days: 7 },
                { title: "Hackathon jeunes développeurs", description: "48h pour créer une application au service de la communauté locale. Encadrement par des professionnels IT.", target_age: "16-25", duration_days: 2 },
                { title: "Atelier entrepreneuriat social", description: "Formation de 5 jours sur la création de projets à impact social, avec accompagnement et mise en réseau.", target_age: "18-30", duration_days: 5 },
            ]),
        },
        {
            commune: "Oued Ghir", wilaya: "Béjaïa", establishment_type: "scientific_leisure_center",
            input_summary: "oued-ghir:scientific_leisure_center:autumn:2026",
            model_provider: "anthropic", model_api_used: "claude-haiku-4-5-20251001",
            status: "completed",
            suggestions_json: JSON.stringify([
                { title: "Initiation à l'astronomie", description: "Soirées d'observation du ciel avec télescope et conférences sur l'astronomie par des étudiants en physique.", target_age: "12-20", duration_days: 3 },
                { title: "Stage de chimie verte", description: "Ateliers pratiques de chimie éco-responsable : fabrication de produits naturels, sensibilisation à l'environnement.", target_age: "14-18", duration_days: 4 },
            ]),
        },
    ];

    for (let i = 0; i < recReqData.length; i++) {
        const r = recReqData[i];
        const rec = new Record(recReqColl);
        rec.set("admin_user",          wilayaUser.id);
        rec.set("commune",             r.commune);
        rec.set("wilaya",              r.wilaya);
        rec.set("establishment_type",  r.establishment_type);
        rec.set("input_summary",       r.input_summary);
        rec.set("model_provider",      r.model_provider);
        rec.set("model_api_used",      r.model_api_used);
        rec.set("suggestions_json",    r.suggestions_json);
        rec.set("status",              r.status);
        app.save(rec);
    }

    // ── 8. Content reports ─────────────────────────────────────────────────────
    const reportColl = app.findCollectionByNameOrId("content_reports");

    const reportData = [
        { target_type: "activity",      reason: "outdated_info",    status: "new",      details: "Les horaires indiqués ne correspondent plus à la réalité. L'activité a été reprogrammée mais la page n'a pas été mise à jour." },
        { target_type: "establishment", reason: "wrong_contact",    status: "reviewed", details: "Le numéro de téléphone de la MJ Takerietz a changé. L'ancien numéro affiché n'est plus valide depuis janvier 2026." },
        { target_type: "announcement",  reason: "cancelled",        status: "resolved", details: "L'événement mentionné dans cette annonce a été annulé. Le statut de l'annonce devrait être mis à jour en 'archivé'." },
        { target_type: "activity",      reason: "wrong_location",   status: "new",      details: "L'adresse indiquée pour l'atelier de robotique est incorrecte. Il se tient en salle B et non en salle A comme mentionné." },
        { target_type: "document",      reason: "outdated_info",    status: "dismissed", details: "Le formulaire d'inscription affiché est celui de 2024. Une nouvelle version pour 2026 doit remplacer l'ancienne." },
    ];

    for (let i = 0; i < reportData.length; i++) {
        const r = reportData[i];
        const rec = new Record(reportColl);
        rec.set("reporter",    youthUser.id);
        rec.set("target_type", r.target_type);
        rec.set("target_id",   allActivities.length > 0 ? allActivities[i % allActivities.length].id : "seed_placeholder");
        rec.set("reason",      r.reason);
        rec.set("details",     r.details);
        rec.set("status",      r.status);
        app.save(rec);
    }

}, (app) => {

    // ── Reverse: delete seeded records by distinguishing fields ────────────────

    const annTitles = [
        "Fermeture exceptionnelle — MJ Takerietz",
        "Programme d'été 2026 — Inscriptions ouvertes",
        "URGENT — Dernier délai d'inscription Camp Beni Ksila",
        "Nouveaux ateliers de programmation — CLS Oued Ghir",
        "Partenariat ODEJ — Université A. Mira de Béjaïa",
        "إعلان هام — برنامج التوجيه المهني 2026",
        "Maintenance du système Chababia — 15 juin 2026",
    ];
    for (let i = 0; i < annTitles.length; i++) {
        try { app.delete(app.findFirstRecordByFilter("announcements", "title = {:t}", { t: annTitles[i] })); } catch (_) {}
    }

    const newsTitles = [
        "Bulletin mensuel ODEJ Béjaïa — Mai 2026",
        "Spécial été 2026 — Guide des activités jeunesse",
        "Nos lauréats 2025-2026 — Talents d'exception",
        "نشرة خاصة — الأنشطة الثقافية لشهر يونيو 2026",
        "Ateliers mobiles dans les communes rurales de Béjaïa",
    ];
    for (let i = 0; i < newsTitles.length; i++) {
        try { app.delete(app.findFirstRecordByFilter("newsletters", "title = {:t}", { t: newsTitles[i] })); } catch (_) {}
    }

    const docTitles = [
        "Guide des services ODEJ Béjaïa 2026",
        "Formulaire d'inscription — Activités estivales 2026",
        "Charte des droits et devoirs des jeunes usagers",
        "وثيقة — إجراءات الانضمام إلى الأندية الشبابية",
        "Rapport annuel ODEJ Béjaïa 2025",
    ];
    for (let i = 0; i < docTitles.length; i++) {
        try { app.delete(app.findFirstRecordByFilter("documents", "title = {:t}", { t: docTitles[i] })); } catch (_) {}
    }

    const projTitles = [
        "Application mobile de transport communautaire",
        "Jardin communautaire solidaire de Béjaïa",
        "Atelier de réparation de vélos solidaire",
        "Podcast bilingue sur l'histoire de Kabylie",
        "Plateforme d'apprentissage du Tamazight en ligne",
        "Festival des arts de rue à Béjaïa",
    ];
    for (let i = 0; i < projTitles.length; i++) {
        try { app.delete(app.findFirstRecordByFilter("project_submissions", "project_title = {:t}", { t: projTitles[i] })); } catch (_) {}
    }

    const talentTitles = [
        "Premier jeu mobile développé à 17 ans",
        "Champion régional de natation — 400m nage libre",
        "Exposition de peinture — Lumières de Kabylie",
        "Album musical — Éveil amazigh",
        "Projet de tri sélectif dans notre lycée",
    ];
    for (let i = 0; i < talentTitles.length; i++) {
        try { app.delete(app.findFirstRecordByFilter("talent_showcase", "title = {:t}", { t: talentTitles[i] })); } catch (_) {}
    }

    // registrations — identified by QR prefix QR2026
    try {
        const regs = app.findRecordsByFilter("registrations", "qr_code ~ 'QR2026'", "-created", 20, 0);
        for (let i = 0; i < regs.length; i++) { app.delete(regs[i]); }
    } catch (_) {}

    // recommendation_requests — identified by input_summary content
    try {
        const recs = app.findRecordsByFilter("recommendation_requests", "input_summary ~ 'béjaïa' || input_summary ~ 'oued-ghir'", "-created", 10, 0);
        for (let i = 0; i < recs.length; i++) { app.delete(recs[i]); }
    } catch (_) {}

    // content_reports — identified by known details substrings
    const reportDetails = [
        "Les horaires indiqués ne correspondent plus",
        "Le numéro de téléphone de la MJ Takerietz a changé",
        "L'événement mentionné dans cette annonce a été annulé",
        "L'adresse indiquée pour l'atelier de robotique est incorrecte",
        "Le formulaire d'inscription affiché est celui de 2024",
    ];
    for (let i = 0; i < reportDetails.length; i++) {
        try { app.delete(app.findFirstRecordByFilter("content_reports", "details ~ {:d}", { d: reportDetails[i] })); } catch (_) {}
    }

});
