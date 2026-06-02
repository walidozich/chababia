/// <reference path="../pb_data/types.d.ts" />

// Seed migration — real ODEJ Béjaïa data
// Sources: odejbejaia-dz.com (scraped 2026-06-03)
// Sections: 15 categories → 5 establishments → 6 activities → translations (ar/fr/tzm)

migrate((app) => {

    // ── 1. CATEGORIES ─────────────────────────────────────────────────────────
    const catColl = app.findCollectionByNameOrId("categories");
    const catDefs = [
        ["Sports",            "sports"],
        ["Culture",           "culture"],
        ["Training",          "training"],
        ["Volunteering",      "volunteering"],
        ["Health Awareness",  "health"],
        ["Science",           "science"],
        ["Arts",              "arts"],
        ["Environment",       "environment"],
        ["Youth Orientation", "orientation"],
        ["Camps and Trips",   "camps"],
        ["Coding",            "coding"],
        ["Design",            "design"],
        ["Robotics",          "robotics"],
        ["Photography",       "photography"],
        ["Debate",            "debate"],
    ];

    const catIds = {};
    for (const [name, slug] of catDefs) {
        const r = new Record(catColl);
        r.set("name", name);
        r.set("icon", slug);
        r.set("status", "active");
        app.save(r);
        catIds[slug] = r.id;
    }

    // ── 2. ESTABLISHMENTS ─────────────────────────────────────────────────────
    // Real data from odejbejaia-dz.com — 5 representative facilities
    const estColl = app.findCollectionByNameOrId("establishments");

    const estDefs = [
        {
            key: "mj_takerietz",
            name: "Maison des Jeunes Takerietz",
            type: "youth_house",
            commune: "Takerietz",
            wilaya: "Béjaïa",
            address: "Commune de Takerietz, Béjaïa",
            latitude: 36.62,
            longitude: 4.76,
            phone: "034847169",
            email: "mjtakerietz@odejbejaia-dz.com",
            opening_hours: "Dim–Jeu 08h00–17h00 / Ven–Sam 09h00–12h00",
            services: "Ateliers artistiques, activités sportives, bibliothèque, soutien scolaire, activités culturelles",
            accessibility_notes: "Salles de plain-pied, accessible aux fauteuils roulants",
        },
        {
            key: "mj_bejaia",
            name: "Maison des Jeunes Fatima Ramtani - Béjaïa",
            type: "youth_house",
            commune: "Béjaïa",
            wilaya: "Béjaïa",
            address: "Centre-ville, Béjaïa",
            latitude: 36.7510,
            longitude: 5.0560,
            phone: "034165665",
            email: "mjfatimaramtani@odejbejaia-dz.com",
            opening_hours: "Dim–Jeu 08h00–18h00 / Sam 09h00–13h00",
            services: "Ateliers numériques, théâtre amateur, musique, clubs scientifiques, orientation jeunesse",
            accessibility_notes: "Centre-ville, facilement accessible en transports en commun",
        },
        {
            key: "camp_beniksila",
            name: "Camp de Jeunesse Beni Ksila",
            type: "youth_camp",
            commune: "Adkar",
            wilaya: "Béjaïa",
            address: "Commune d'Adkar, Béjaïa",
            latitude: 36.77,
            longitude: 5.03,
            phone: "034283151",
            email: "ajadekar@odejbejaia-dz.com",
            opening_hours: "Ouvert en période de vacances scolaires",
            services: "Hébergement, activités de plein air, camp de jeunesse, sport, ateliers environnement",
            accessibility_notes: "Milieu naturel — contacter l'administration pour besoins spécifiques",
        },
        {
            key: "cls_ouedghir",
            name: "Centre de Loisirs Scientifiques d'Oued Ghir",
            type: "scientific_leisure_center",
            commune: "Oued Ghir",
            wilaya: "Béjaïa",
            address: "Commune d'Oued Ghir, Béjaïa",
            latitude: 36.7220,
            longitude: 5.0050,
            phone: "034759117",
            email: "clsouedghir@odejbejaia-dz.com",
            opening_hours: "Dim–Jeu 08h30–17h00",
            services: "Informatique, robotique, astronomie, club environnement, STEM, ateliers scientifiques",
            accessibility_notes: "Équipé pour accueillir les personnes à besoins spécifiques",
        },
        {
            key: "sp_jebla",
            name: "Salle Polyvalente de Jebla",
            type: "polyvalent_hall",
            commune: "Jebla",
            wilaya: "Béjaïa",
            address: "Commune de Jebla, Béjaïa",
            latitude: 36.74,
            longitude: 4.85,
            phone: "034607386",
            email: "spdjebla@odejbejaia-dz.com",
            opening_hours: "Dim–Jeu 08h00–17h00",
            services: "Formation, ateliers créatifs, événements culturels, soutien psychosocial, sensibilisation",
            accessibility_notes: "Grande salle équipée — contacter l'administration pour besoins spécifiques",
        },
    ];

    const estIds = {};
    for (const e of estDefs) {
        const r = new Record(estColl);
        r.set("name", e.name);
        r.set("type", e.type);
        r.set("commune", e.commune);
        r.set("wilaya", e.wilaya);
        r.set("address", e.address);
        r.set("latitude", e.latitude);
        r.set("longitude", e.longitude);
        r.set("phone", e.phone);
        r.set("email", e.email);
        r.set("opening_hours", e.opening_hours);
        r.set("services", e.services);
        r.set("accessibility_notes", e.accessibility_notes);
        r.set("status", "published");
        r.set("last_verified_at", "2026-06-03 00:00:00.000Z");
        app.save(r);
        estIds[e.key] = r.id;
    }

    // ── 3. ACTIVITIES ─────────────────────────────────────────────────────────
    // 6 published activities across the 5 establishments above
    const actColl = app.findCollectionByNameOrId("activities");

    const actDefs = [
        {
            key: "digital_safety",
            title: "Ateliers Sécurité Numérique",
            short_description: "Sensibilisation des jeunes aux dangers d'Internet et aux bonnes pratiques de sécurité numérique.",
            full_description: "Une série d'ateliers interactifs organisés par la MJ Fatima Ramtani pour initier les jeunes aux risques numériques : cyberharcèlement, protection des données personnelles, usage responsable des réseaux sociaux et pratiques de mot de passe sécurisé.",
            category: "coding",
            establishment: "mj_bejaia",
            commune: "Béjaïa",
            wilaya: "Béjaïa",
            activity_mode: "physical",
            start_datetime: "2026-06-10 09:00:00.000Z",
            end_datetime: "2026-06-10 12:00:00.000Z",
            registration_deadline: "2026-06-08 23:59:00.000Z",
            capacity: 30,
            requires_registration: true,
            is_free: true,
            age_min: 14,
            age_max: 30,
            language: "fr",
            contact_phone: "034165665",
            contact_email: "mjfatimaramtani@odejbejaia-dz.com",
        },
        {
            key: "sports_tournament",
            title: "Tournoi Sportif de Proximité — Takerietz",
            short_description: "Tournoi de football, basketball et volleyball entre équipes de jeunes de la commune.",
            full_description: "Tournoi interquartiers organisé par la Maison des Jeunes Takerietz. Les équipes de 6 à 16 joueurs s'affrontent dans une ambiance festive et fraternelle. Ouvert aux jeunes de 16 à 30 ans résidant dans la commune de Takerietz et communes voisines.",
            category: "sports",
            establishment: "mj_takerietz",
            commune: "Takerietz",
            wilaya: "Béjaïa",
            activity_mode: "physical",
            start_datetime: "2026-06-15 08:00:00.000Z",
            end_datetime: "2026-06-15 18:00:00.000Z",
            registration_deadline: "2026-06-12 23:59:00.000Z",
            capacity: 100,
            requires_registration: true,
            is_free: true,
            age_min: 16,
            age_max: 30,
            language: "fr",
            contact_phone: "034847169",
            contact_email: "mjtakerietz@odejbejaia-dz.com",
        },
        {
            key: "science_camp",
            title: "Séjour Scientifique — Camp Beni Ksila",
            short_description: "Camp de 5 jours dédié aux sciences, à l'environnement et à la découverte de la nature.",
            full_description: "Les jeunes participent à des ateliers de sciences expérimentales, d'astronomie et d'environnement dans le cadre verdoyant du camp Beni Ksila à Adkar. Programme journalier : sciences le matin, randonnées écologiques l'après-midi, veillées culturelles le soir. Hébergement et repas inclus.",
            category: "science",
            establishment: "camp_beniksila",
            commune: "Adkar",
            wilaya: "Béjaïa",
            activity_mode: "physical",
            start_datetime: "2026-07-01 08:00:00.000Z",
            end_datetime: "2026-07-05 17:00:00.000Z",
            registration_deadline: "2026-06-25 23:59:00.000Z",
            capacity: 50,
            requires_registration: true,
            is_free: true,
            age_min: 12,
            age_max: 18,
            language: "fr",
            contact_phone: "034283151",
            contact_email: "ajadekar@odejbejaia-dz.com",
        },
        {
            key: "theater_workshop",
            title: "Atelier Théâtral Amateur",
            short_description: "Initiation au théâtre amateur : expression corporelle, improvisation et mise en scène.",
            full_description: "La Salle Polyvalente de Jebla organise un atelier d'initiation au théâtre animé par un metteur en scène professionnel. Au programme : échauffement, improvisation, travail sur le texte et répétition d'une courte pièce présentée à la fin du stage. Aucune expérience préalable requise.",
            category: "arts",
            establishment: "sp_jebla",
            commune: "Jebla",
            wilaya: "Béjaïa",
            activity_mode: "physical",
            start_datetime: "2026-06-20 14:00:00.000Z",
            end_datetime: "2026-06-20 17:00:00.000Z",
            registration_deadline: "2026-06-18 23:59:00.000Z",
            capacity: 25,
            requires_registration: true,
            is_free: true,
            age_min: 15,
            age_max: 35,
            language: "fr",
            contact_phone: "034607386",
            contact_email: "spdjebla@odejbejaia-dz.com",
        },
        {
            key: "env_day",
            title: "Journée Mondiale de l'Environnement",
            short_description: "Sensibilisation à la protection de l'environnement, expositions et ateliers de recyclage créatif.",
            full_description: "À l'occasion de la Journée mondiale de l'environnement, le CLS d'Oued Ghir organise une journée ouverte à tous. Au programme : expositions interactives sur le changement climatique, ateliers de recyclage créatif, conférence d'un chercheur environnementaliste et plantation d'arbres en groupe.",
            category: "environment",
            establishment: "cls_ouedghir",
            commune: "Oued Ghir",
            wilaya: "Béjaïa",
            activity_mode: "physical",
            start_datetime: "2026-06-05 09:00:00.000Z",
            end_datetime: "2026-06-05 17:00:00.000Z",
            registration_deadline: "2026-06-04 23:59:00.000Z",
            capacity: 200,
            requires_registration: false,
            is_free: true,
            age_min: 10,
            age_max: 99,
            language: "ar",
            contact_phone: "034759117",
            contact_email: "clsouedghir@odejbejaia-dz.com",
        },
        {
            key: "photo_club",
            title: "Club de Photographie — Session Été 2026",
            short_description: "Initiation à la photographie numérique : composition, lumière et retouche photo.",
            full_description: "La MJ Takerietz lance une session estivale du Club de Photographie. En 4 séances hebdomadaires, les participants apprennent les bases de la composition, l'utilisation de la lumière naturelle et la retouche légère sur smartphone. La session se termine par une exposition des meilleures photos dans les locaux de la MJ.",
            category: "photography",
            establishment: "mj_takerietz",
            commune: "Takerietz",
            wilaya: "Béjaïa",
            activity_mode: "physical",
            start_datetime: "2026-06-25 15:00:00.000Z",
            end_datetime: "2026-07-16 17:00:00.000Z",
            registration_deadline: "2026-06-22 23:59:00.000Z",
            capacity: 20,
            requires_registration: true,
            is_free: true,
            age_min: 16,
            age_max: 35,
            language: "fr",
            contact_phone: "034847169",
            contact_email: "mjtakerietz@odejbejaia-dz.com",
        },
    ];

    const actIds = {};
    for (const a of actDefs) {
        const r = new Record(actColl);
        r.set("title", a.title);
        r.set("short_description", a.short_description);
        r.set("full_description", a.full_description);
        r.set("category", catIds[a.category]);
        r.set("establishment", estIds[a.establishment]);
        r.set("commune", a.commune);
        r.set("wilaya", a.wilaya);
        r.set("activity_mode", a.activity_mode);
        r.set("start_datetime", a.start_datetime);
        r.set("end_datetime", a.end_datetime);
        r.set("registration_deadline", a.registration_deadline);
        r.set("capacity", a.capacity);
        r.set("requires_registration", a.requires_registration);
        r.set("is_free", a.is_free);
        r.set("age_min", a.age_min);
        r.set("age_max", a.age_max);
        r.set("language", a.language);
        r.set("contact_phone", a.contact_phone);
        r.set("contact_email", a.contact_email);
        r.set("status", "published");
        r.set("last_verified_at", "2026-06-03 00:00:00.000Z");
        app.save(r);
        actIds[a.key] = r.id;
    }

    // ── 4. CATEGORY TRANSLATIONS (ar / fr / tzm) ──────────────────────────────
    const catTransColl = app.findCollectionByNameOrId("category_translations");

    const catTransDefs = [
        // [slug, ar, fr, tzm]
        ["sports",       "الرياضة",              "Sports",                     "Asertay"],
        ["culture",      "الثقافة",              "Culture",                    "Tadles"],
        ["training",     "التكوين",              "Formation",                  "Tawennaḍt"],
        ["volunteering", "التطوع",               "Bénévolat",                  "Tawuri"],
        ["health",       "التوعية الصحية",       "Sensibilisation Santé",      "Asebyan n tselwit"],
        ["science",      "العلوم",               "Sciences",                   "Tussna"],
        ["arts",         "الفنون",               "Arts",                       "Tifnunin"],
        ["environment",  "البيئة",               "Environnement",              "Amadal"],
        ["orientation",  "توجيه الشباب",         "Orientation des Jeunes",     "Tiririt n iḍelman"],
        ["camps",        "المخيمات والرحلات",    "Camps et Excursions",        "Ikampen d Iswi"],
        ["coding",       "البرمجة",              "Programmation",              "Taktabt"],
        ["design",       "التصميم",              "Design",                     "Asmeslay"],
        ["robotics",     "الروبوتيك",            "Robotique",                  "Arubut"],
        ["photography",  "التصوير",              "Photographie",               "Taɣect"],
        ["debate",       "النقاش",               "Débat",                      "Asentel"],
    ];

    for (const [slug, ar, fr, tzm] of catTransDefs) {
        for (const [lang, name] of [["ar", ar], ["fr", fr], ["tzm", tzm]]) {
            const r = new Record(catTransColl);
            r.set("category", catIds[slug]);
            r.set("language", lang);
            r.set("name", name);
            app.save(r);
        }
    }

    // ── 5. ESTABLISHMENT TRANSLATIONS (ar / fr / tzm) ─────────────────────────
    const estTransColl = app.findCollectionByNameOrId("establishment_translations");

    const estTransDefs = [
        {
            key: "mj_takerietz",
            ar: {
                description: "بيت الشباب تقريت مؤسسة شبابية تابعة لمديرية الشباب والرياضة لولاية بجاية. يقدم أنشطة ثقافية ورياضية وفنية للشباب.",
                services_text: "ورشات فنية، أنشطة رياضية، مكتبة، دعم مدرسي، أنشطة ثقافية",
                accessibility_text: "قاعات على مستوى الأرض، متاح للكراسي المتحركة",
            },
            fr: {
                description: "La Maison des Jeunes de Takerietz est un établissement de jeunesse relevant de la direction de la Jeunesse et des Sports de la wilaya de Béjaïa.",
                services_text: "Ateliers artistiques, activités sportives, bibliothèque, soutien scolaire, activités culturelles",
                accessibility_text: "Salles de plain-pied, accessible aux fauteuils roulants",
            },
            tzm: {
                description: "Taddart n Tmazight n Takerietz d takdant n tḍrimt i iḍelman deg wilaya n Bgayet.",
                services_text: "Tiwuriwin n tsenselkimt, tigawt ussekti, taskla, tallalt n tɣuri",
                accessibility_text: "Ixxamen deg yidda n tmurt, iɛedday i kursiy amezdagi",
            },
        },
        {
            key: "mj_bejaia",
            ar: {
                description: "بيت الشباب فاطمة رمطاني في قلب مدينة بجاية، فضاء حيوي يقدم برامج رقمية وثقافية وفنية متنوعة للشباب.",
                services_text: "ورشات رقمية، مسرح هاوٍ، موسيقى، نوادي علمية، توجيه الشباب",
                accessibility_text: "موقع مركزي بالمدينة، سهل الوصول بالمواصلات العامة",
            },
            fr: {
                description: "La Maison des Jeunes Fatima Ramtani, au cœur de Béjaïa, est un espace dynamique proposant des programmes numériques, culturels et artistiques variés.",
                services_text: "Ateliers numériques, théâtre amateur, musique, clubs scientifiques, orientation jeunesse",
                accessibility_text: "Centre-ville, facilement accessible en transports en commun",
            },
            tzm: {
                description: "Taddart n Tmazight Fatima Ramtani, deg tlemmast n Bgayet, d asarag aɣellalan i iḍelman.",
                services_text: "Tiwuriwin tidigitaliyin, amezgun, aẓawan, igmawen n tussna",
                accessibility_text: "Deg tlemmast n temdint, iɛedday s ubrid amatu",
            },
        },
        {
            key: "camp_beniksila",
            ar: {
                description: "مخيم شباب بني كسيلة في بلدية أدكار وسط الطبيعة الخلابة لمنطقة بجاية، يستقبل الشباب في إطار مخيمات علمية وترفيهية.",
                services_text: "إيواء، أنشطة خلاء، مخيم شباب، رياضة، ورشات بيئة",
                accessibility_text: "وسط الطبيعة — يُفضل إخبار الإدارة بالاحتياجات الخاصة مسبقاً",
            },
            fr: {
                description: "Le Camp de Jeunesse Beni Ksila, dans la commune d'Adkar, est entouré par la nature verdoyante de Béjaïa. Il accueille les jeunes pour des séjours scientifiques et récréatifs.",
                services_text: "Hébergement, activités de plein air, camp de jeunesse, sport, ateliers environnement",
                accessibility_text: "Milieu naturel — prévenir l'administration pour toute nécessité d'accessibilité spéciale",
            },
            tzm: {
                description: "Ikamp n Tmazight Beni Ksila, deg taddart n Adkar, iḥuzen s unṣib n tmurt n Bgayet.",
                services_text: "Tazdwit, tigawt deg berra, ikamp, asertay, tiwuriwin n amadal",
                accessibility_text: "Deg tmurt — d aḥajet ad tessnem tigawt s tnaqqalt tuzzigt",
            },
        },
        {
            key: "cls_ouedghir",
            ar: {
                description: "مركز الترفيه العلمي بوادي غير يهدف إلى نشر الثقافة العلمية وتحفيز البحث العلمي لدى الشباب عبر مختبرات تفاعلية وورشات STEM.",
                services_text: "إعلام آلي، روبوتيك، فلك، نادي بيئة، STEM، ورشات علمية",
                accessibility_text: "مجهز لاستقبال ذوي الاحتياجات الخاصة",
            },
            fr: {
                description: "Le Centre de Loisirs Scientifiques d'Oued Ghir diffuse la culture scientifique et stimule la recherche chez les jeunes via des laboratoires interactifs et ateliers STEM.",
                services_text: "Informatique, robotique, astronomie, club environnement, STEM, ateliers scientifiques",
                accessibility_text: "Équipé pour accueillir les personnes à besoins spécifiques",
            },
            tzm: {
                description: "Agemmaḍ n tferkit n tussna n Wad Agher yettaɣ ad yefk tadles tussna s tiwuriwin n STEM d iseɣwan n tussna.",
                services_text: "Iselkimen, arubutik, taẓult, amadal, STEM, tiwuriwin n tussna",
                accessibility_text: "Yettwasḍal i imdanen yesɛan iḥtijajen tuzziɣin",
            },
        },
        {
            key: "sp_jebla",
            ar: {
                description: "القاعة متعددة الخدمات بجبلة فضاء تكويني وثقافي للشباب، يقدم برامج تدريبية وورشات إبداعية وأنشطة توعوية.",
                services_text: "تكوين، ورشات إبداعية، فعاليات ثقافية، دعم نفسي اجتماعي، تحسيس",
                accessibility_text: "قاعة واسعة ومجهزة — يُرجى التواصل مع الإدارة للاحتياجات الخاصة",
            },
            fr: {
                description: "La Salle Polyvalente de Jebla est un espace de formation et de culture pour les jeunes, proposant des formations, ateliers créatifs et activités de sensibilisation.",
                services_text: "Formation, ateliers créatifs, événements culturels, soutien psychosocial, sensibilisation",
                accessibility_text: "Grande salle équipée — contacter l'administration pour besoins spécifiques",
            },
            tzm: {
                description: "Taburt Tanekkart n Jebla d asarag n tawennaḍt d tadles i iḍelman.",
                services_text: "Tawennaḍt, tiwuriwin n ufti, tigawt tadelsan, tallalt taɣerbanzant",
                accessibility_text: "Taburt tameqqrant — ttmeslayeḍ d teneggart i iḥtijajen",
            },
        },
    ];

    for (const est of estTransDefs) {
        for (const [lang, t] of [["ar", est.ar], ["fr", est.fr], ["tzm", est.tzm]]) {
            const r = new Record(estTransColl);
            r.set("establishment", estIds[est.key]);
            r.set("language", lang);
            r.set("description", t.description);
            r.set("services_text", t.services_text);
            r.set("accessibility_text", t.accessibility_text);
            app.save(r);
        }
    }

    // ── 6. ACTIVITY TRANSLATIONS (ar / fr / tzm) ──────────────────────────────
    const actTransColl = app.findCollectionByNameOrId("activity_translations");

    const actTransDefs = [
        {
            key: "digital_safety",
            ar: {
                title: "ورشات الأمن الرقمي",
                short_description: "تحسيس الشباب بمخاطر الإنترنت وأفضل ممارسات الأمن الرقمي.",
                full_description: "سلسلة ورشات تفاعلية تنظمها بيت الشباب فاطمة رمطاني لتعريف الشباب بالمخاطر الرقمية: التنمر الإلكتروني، حماية البيانات الشخصية، الاستخدام المسؤول لوسائل التواصل الاجتماعي وممارسات كلمة المرور الآمنة.",
            },
            fr: {
                title: "Ateliers Sécurité Numérique",
                short_description: "Sensibilisation des jeunes aux dangers d'Internet et aux bonnes pratiques de sécurité numérique.",
                full_description: "Une série d'ateliers interactifs organisés par la MJ Fatima Ramtani pour initier les jeunes aux risques numériques : cyberharcèlement, protection des données personnelles, usage responsable des réseaux sociaux et pratiques de mot de passe sécurisé.",
            },
            tzm: {
                title: "Tiwuriwin n Tɣellist Tidigitalit",
                short_description: "Asnillem n iḍelman ɣef yiɣewwaṛen n Internet d ugelluy adigital.",
                full_description: "Taggayt n tiwuriwin n ttmenyaf tettili deg MJ Fatima Ramtani i usnillem n iḍelman ɣef iɣewwaṛen n udigital: asemmaḍ, tɣellist n isefka d ufran amatu n iẓḍaṛen.",
            },
        },
        {
            key: "sports_tournament",
            ar: {
                title: "دوري رياضي جواري — تقريت",
                short_description: "دوري في كرة القدم وكرة السلة والكرة الطائرة بين فرق شباب البلدية.",
                full_description: "دوري بين الأحياء منظم من طرف بيت الشباب تقريت. تتنافس الفرق في أجواء احتفالية وأخوية. مفتوح للشباب من 16 إلى 30 سنة المقيمين في بلدية تقريت والبلديات المجاورة.",
            },
            fr: {
                title: "Tournoi Sportif de Proximité — Takerietz",
                short_description: "Tournoi de football, basketball et volleyball entre équipes de jeunes de la commune.",
                full_description: "Tournoi interquartiers organisé par la Maison des Jeunes Takerietz. Les équipes s'affrontent dans une ambiance festive et fraternelle. Ouvert aux jeunes de 16 à 30 ans de Takerietz et communes voisines.",
            },
            tzm: {
                title: "Asentel n Usertay — Takerietz",
                short_description: "Asentel n ukuzan, taḍuft n yibdan d teḍuft n uzgel gar igmawen n iḍelman.",
                full_description: "Asentel gar n wagaraw ittwaselkem s MJ Takerietz. Igmawen ttaɛreḍ deg yiɣeff yifraren. Iɛedday i iḍelman seg 16 ɣer 30 n yiseggasen.",
            },
        },
        {
            key: "science_camp",
            ar: {
                title: "معسكر علمي — مخيم بني كسيلة",
                short_description: "إقامة علمية لمدة 5 أيام مخصصة للعلوم والبيئة واكتشاف الطبيعة.",
                full_description: "يشارك الشباب في ورشات العلوم التجريبية والفلك والبيئة في الإطار الطبيعي الخلاب لمخيم بني كسيلة. البرنامج: تجارب علمية صباحاً، رحلات بيئية بعد الظهر، سهرات ثقافية مساءً. الإقامة والوجبات مشمولة.",
            },
            fr: {
                title: "Séjour Scientifique — Camp Beni Ksila",
                short_description: "Camp de 5 jours dédié aux sciences, à l'environnement et à la découverte de la nature.",
                full_description: "Les jeunes participent à des ateliers de sciences expérimentales, d'astronomie et d'environnement au camp Beni Ksila. Programme : sciences le matin, randonnées écologiques l'après-midi, veillées culturelles le soir. Hébergement et repas inclus.",
            },
            tzm: {
                title: "Ikamp n Tussna — Beni Ksila",
                short_description: "Tazdwit n tussna n 5 ussan ɣef tussna, amadal d tsenqudemt n tmurt.",
                full_description: "Iḍelman ttekkin deg tiwuriwin n tussna tasɣimit, taẓult d amadal deg wakal azegzaw n ikamp Beni Ksila. Tazdwit d imensi yettwakkes.",
            },
        },
        {
            key: "theater_workshop",
            ar: {
                title: "ورشة مسرحية للهواة",
                short_description: "تمهيد في المسرح الهاوي: التعبير الجسدي، الارتجال والإخراج.",
                full_description: "تنظم القاعة متعددة الخدمات بجبلة ورشة مسرحية بإشراف مخرج متخصص. البرنامج: تمارين الإحماء، الارتجال، العمل على النص وبروفا قصيرة تُعرض في نهاية الدورة. لا يُشترط أي خبرة سابقة.",
            },
            fr: {
                title: "Atelier Théâtral Amateur",
                short_description: "Initiation au théâtre amateur : expression corporelle, improvisation et mise en scène.",
                full_description: "La Salle Polyvalente de Jebla organise un atelier théâtral animé par un metteur en scène professionnel. Au programme : échauffement, improvisation, travail sur le texte et représentation finale. Aucune expérience préalable requise.",
            },
            tzm: {
                title: "Taɣult n Umezgun — Iḥbaben",
                short_description: "Assnekcem ɣer umezgun n iḥbaben: tifawt n wul, isɣallen, adiwenni.",
                full_description: "Taburt Tanekkart n Jebla tessekcel taɣult n umezgun s uzref n yimezgun amaẓan. Ulac tazmert n zik i d-ttɣellesen.",
            },
        },
        {
            key: "env_day",
            ar: {
                title: "اليوم العالمي للبيئة",
                short_description: "توعية بحماية البيئة، معارض وورشات إعادة التدوير الإبداعية.",
                full_description: "بمناسبة اليوم العالمي للبيئة، ينظم مركز الترفيه العلمي بوادي غير يوماً تحسيسياً مفتوحاً للجميع: معارض تفاعلية عن تغير المناخ، ورشات إعادة التدوير، محاضرة باحث بيئي وزراعة أشجار جماعية.",
            },
            fr: {
                title: "Journée Mondiale de l'Environnement",
                short_description: "Sensibilisation à la protection de l'environnement, expositions et ateliers de recyclage créatif.",
                full_description: "Le CLS d'Oued Ghir organise une journée de sensibilisation ouverte à tous. Au programme : expositions sur le changement climatique, ateliers de recyclage créatif, conférence d'un chercheur environnementaliste et plantation d'arbres.",
            },
            tzm: {
                title: "Ass Amaḍlan n Amadal",
                short_description: "Asnillem ɣef tɣellist n amadal, timɣarin d tiwuriwin n usnulfu azedgan.",
                full_description: "CLS n Wad Agher issekcel ass n usnillem i wid kullu. Aɣbalu: timɣarin ɣef usnifel n taɣect, tiwuriwin n usnulfu, awal n unagraw d ussers n yijdad.",
            },
        },
        {
            key: "photo_club",
            ar: {
                title: "نادي التصوير — دورة صيف 2026",
                short_description: "تمهيد في التصوير الرقمي: التكوين والإضاءة والتعديل.",
                full_description: "تطلق بيت الشباب تقريت دورة صيفية لنادي التصوير. في 4 جلسات أسبوعية، يتعلم المشاركون أسس التكوين الفوتوغرافي والضوء الطبيعي والتعديل الخفيف عبر الهاتف الذكي. تنتهي الدورة بمعرض لأفضل الصور.",
            },
            fr: {
                title: "Club de Photographie — Session Été 2026",
                short_description: "Initiation à la photographie numérique : composition, lumière et retouche photo.",
                full_description: "La MJ Takerietz lance une session estivale du Club de Photographie. En 4 séances hebdomadaires : composition photographique, lumière naturelle, retouche légère sur smartphone. La session se clôture par une exposition des meilleures photos.",
            },
            tzm: {
                title: "Agraw n Taɣect — Taslit n Anẓul 2026",
                short_description: "Assnekcem ɣer taɣect tidigilalit: asmeslay, tanfust d usnulfu.",
                full_description: "MJ Takerietz tessekcel taslit n unẓul n agraw n taɣect. Deg 4 tarmitin s imalas imsumrar teẓren isallen n taɣect d unṣib azegzaw. Taslit tettemmal s tmɣart n tɣecciwin ifazen.",
            },
        },
    ];

    for (const act of actTransDefs) {
        for (const [lang, t] of [["ar", act.ar], ["fr", act.fr], ["tzm", act.tzm]]) {
            const r = new Record(actTransColl);
            r.set("activity", actIds[act.key]);
            r.set("language", lang);
            r.set("title", t.title);
            r.set("short_description", t.short_description);
            r.set("full_description", t.full_description);
            app.save(r);
        }
    }

}, (app) => {
    // Rollback: delete seeded records by known names

    const catNames = [
        "Sports", "Culture", "Training", "Volunteering", "Health Awareness",
        "Science", "Arts", "Environment", "Youth Orientation", "Camps and Trips",
        "Coding", "Design", "Robotics", "Photography", "Debate",
    ];
    try {
        const catColl = app.findCollectionByNameOrId("categories");
        const all = app.findRecordsByFilter("categories", "id != ''", "-created", 200, 0);
        for (const r of all) {
            if (catNames.includes(r.get("name"))) { try { app.delete(r); } catch (_) {} }
        }
    } catch (_) {}

    const actTitles = [
        "Ateliers Sécurité Numérique",
        "Tournoi Sportif de Proximité — Takerietz",
        "Séjour Scientifique — Camp Beni Ksila",
        "Atelier Théâtral Amateur",
        "Journée Mondiale de l'Environnement",
        "Club de Photographie — Session Été 2026",
    ];
    try {
        const all = app.findRecordsByFilter("activities", "id != ''", "-created", 200, 0);
        for (const r of all) {
            if (actTitles.includes(r.get("title"))) { try { app.delete(r); } catch (_) {} }
        }
    } catch (_) {}

    const estNames = [
        "Maison des Jeunes Takerietz",
        "Maison des Jeunes Fatima Ramtani - Béjaïa",
        "Camp de Jeunesse Beni Ksila",
        "Centre de Loisirs Scientifiques d'Oued Ghir",
        "Salle Polyvalente de Jebla",
    ];
    try {
        const all = app.findRecordsByFilter("establishments", "id != ''", "-created", 200, 0);
        for (const r of all) {
            if (estNames.includes(r.get("name"))) { try { app.delete(r); } catch (_) {} }
        }
    } catch (_) {}
});
