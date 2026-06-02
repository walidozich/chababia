/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {

    // ─── 1. users (auth) ─────────────────────────────────────────────────────
    // PocketBase auto-creates a default "users" auth collection on every fresh DB
    // via its own built-in migration. We update it in place rather than recreating.
    const users = app.findCollectionByNameOrId("users");
    users.authRule   = "";
    users.listRule   = null;
    users.viewRule   = "id = @request.auth.id";
    users.createRule = "";
    users.updateRule = "id = @request.auth.id";
    users.deleteRule = null;

    // Remove PocketBase's default "name" and "avatar" fields — replaced by our full_name
    users.fields.removeByName("name");
    users.fields.removeByName("avatar");

    // Add our custom fields via addMarshaledJSON (required for existing collection updates)
    users.fields.addMarshaledJSON(JSON.stringify([
        { type: "text",   name: "full_name", required: true },
        { type: "text",   name: "phone" },
        {
            type: "select", name: "role", required: true,
            values: [
                "youth", "super_admin", "wilaya_admin",
                "establishment_manager", "content_editor", "attendance_staff",
            ],
            maxSelect: 1,
        },
        { type: "select", name: "preferred_language", values: ["ar", "fr", "tzm"], maxSelect: 1 },
        { type: "text",   name: "commune" },
        { type: "text",   name: "wilaya" },
        {
            type: "select", name: "interests",
            values: [
                "Sports", "Culture", "Training", "Volunteering",
                "Health Awareness", "Science", "Arts", "Environment",
                "Youth Orientation", "Camps and Trips", "Coding",
                "Design", "Robotics", "Photography", "Debate",
            ],
            maxSelect: 15,
        },
    ]));
    users.indexes = [
        ...users.indexes,
        "CREATE INDEX idx_users_role    ON users(role)",
        "CREATE INDEX idx_users_commune ON users(commune)",
    ];
    app.save(users);

    // ─── 2. categories ───────────────────────────────────────────────────────
    // Publicly readable; write is superuser-only (null = superusers only in PocketBase).
    const categories = new Collection({
        type: "base",
        name: "categories",
        listRule:   "",
        viewRule:   "",
        createRule: null,
        updateRule: null,
        deleteRule: null,
        fields: [
            { type: "text",   name: "name",   required: true },
            { type: "text",   name: "icon" },
            {
                type: "select", name: "status", required: true,
                values: ["active", "inactive"], maxSelect: 1,
            },
        ],
    });
    app.save(categories);

    // ─── 3. establishments ───────────────────────────────────────────────────
    // Public read for published records only. Write is superuser-only.
    // image: max 300 KB (307200 bytes) per eco/security rules.
    const establishments = new Collection({
        type: "base",
        name: "establishments",
        listRule:   "status = 'published'",
        viewRule:   "status = 'published'",
        createRule: null,
        updateRule: null,
        deleteRule: null,
        fields: [
            { type: "text",   name: "name",     required: true },
            {
                type: "select", name: "type",
                values: [
                    "youth_house", "youth_hostel", "sports_complex",
                    "youth_camp", "polyvalent_hall", "scientific_leisure_center",
                ],
                maxSelect: 1,
            },
            { type: "text",   name: "commune" },
            { type: "text",   name: "wilaya" },
            { type: "text",   name: "address" },
            { type: "number", name: "latitude" },
            { type: "number", name: "longitude" },
            { type: "text",   name: "phone" },
            { type: "email",  name: "email" },
            { type: "text",   name: "opening_hours" },
            { type: "text",   name: "services" },
            { type: "text",   name: "accessibility_notes" },
            {
                type: "file", name: "image",
                maxSize:   307200,
                maxSelect: 1,
                mimeTypes: ["image/jpeg", "image/png", "image/webp"],
                thumbs:    ["400x0", "100x100"],
            },
            {
                type: "select", name: "status",
                values: ["draft", "published", "archived"], maxSelect: 1,
            },
            { type: "date", name: "last_verified_at" },
        ],
        indexes: [
            "CREATE INDEX idx_establishments_status  ON establishments(status)",
            "CREATE INDEX idx_establishments_commune ON establishments(commune)",
            "CREATE INDEX idx_establishments_type    ON establishments(type)",
        ],
    });
    app.save(establishments);

    // ─── 4. activities ───────────────────────────────────────────────────────
    // Public read for published records only.
    // commune/wilaya are denormalized from the establishment for direct filtering (spec §13.2 index).
    const activities = new Collection({
        type: "base",
        name: "activities",
        listRule:   "status = 'published'",
        viewRule:   "status = 'published'",
        createRule: null,
        updateRule: null,
        deleteRule: null,
        fields: [
            { type: "text",     name: "title",             required: true },
            { type: "text",     name: "short_description" },
            { type: "text",     name: "full_description" },
            // denormalized for fast list filtering without a JOIN
            { type: "text",     name: "commune" },
            { type: "text",     name: "wilaya" },
            {
                type: "relation", name: "category",
                collectionId: categories.id, maxSelect: 1,
            },
            {
                type: "relation", name: "establishment",
                collectionId: establishments.id, maxSelect: 1,
            },
            {
                type: "select", name: "activity_mode",
                values: ["physical", "online", "hybrid"], maxSelect: 1,
            },
            { type: "url",      name: "online_link" },
            { type: "date",     name: "start_datetime",        required: true },
            { type: "date",     name: "end_datetime" },
            { type: "date",     name: "registration_deadline" },
            { type: "number",   name: "capacity" },
            { type: "bool",     name: "requires_registration" },
            { type: "bool",     name: "is_free" },
            { type: "number",   name: "age_min" },
            { type: "number",   name: "age_max" },
            {
                type: "select", name: "language",
                values: ["ar", "fr", "tzm", "mixed"], maxSelect: 1,
            },
            { type: "text",     name: "accessibility_notes" },
            { type: "text",     name: "required_documents" },
            {
                // for hybrid activities (spec §12.1)
                type: "select", name: "bandwidth_level",
                values: ["low", "medium", "high"], maxSelect: 1,
            },
            { type: "bool",     name: "replay_available" },
            {
                type: "file",   name: "image",
                maxSize:   307200,
                maxSelect: 1,
                mimeTypes: ["image/jpeg", "image/png", "image/webp"],
                thumbs:    ["400x0", "100x100"],
            },
            { type: "text",     name: "contact_phone" },
            { type: "email",    name: "contact_email" },
            {
                type: "select", name: "status",
                values: ["draft", "published", "cancelled", "archived"],
                maxSelect: 1,
            },
            { type: "date",     name: "last_verified_at" },
        ],
        indexes: [
            "CREATE INDEX idx_activities_status         ON activities(status)",
            "CREATE INDEX idx_activities_start_datetime ON activities(start_datetime)",
            "CREATE INDEX idx_activities_commune        ON activities(commune)",
            "CREATE INDEX idx_activities_wilaya         ON activities(wilaya)",
            "CREATE INDEX idx_activities_category       ON activities(category)",
            "CREATE INDEX idx_activities_establishment  ON activities(establishment)",
        ],
    });
    app.save(activities);

    // ─── 5. registrations ────────────────────────────────────────────────────
    // Auth users can create their own registration and read their own.
    // Updates/deletes are admin-only (status changes via hooks or admin UI).
    const registrations = new Collection({
        type: "base",
        name: "registrations",
        listRule:   "user = @request.auth.id",
        viewRule:   "user = @request.auth.id",
        createRule: "@request.auth.id != ''",
        updateRule: null,
        deleteRule: null,
        fields: [
            {
                type: "relation", name: "user",
                collectionId: users.id, maxSelect: 1, required: true,
            },
            {
                type: "relation", name: "activity",
                collectionId: activities.id, maxSelect: 1, required: true,
            },
            { type: "text",     name: "full_name", required: true },
            { type: "text",     name: "phone" },
            { type: "email",    name: "email" },
            {
                type: "select", name: "status",
                values: ["registered", "waiting_list", "cancelled", "attended"],
                maxSelect: 1,
            },
            // populated server-side by hook on create (Phase 6)
            { type: "text",     name: "qr_code" },
            { type: "date",     name: "checked_in_at" },
        ],
        indexes: [
            "CREATE INDEX idx_registrations_user     ON registrations(user)",
            "CREATE INDEX idx_registrations_activity ON registrations(activity)",
            "CREATE INDEX idx_registrations_status   ON registrations(status)",
        ],
    });
    app.save(registrations);

}, (app) => {
    // down: delete our collections in reverse dependency order.
    for (const name of ["registrations", "activities", "establishments", "categories"]) {
        try {
            const c = app.findCollectionByNameOrId(name);
            app.delete(c);
        } catch (_) {}
    }

    // Reverse the in-place "users" mutations so a subsequent `migrate up` is clean.
    // "users" is owned by PocketBase's automigration — we don't delete it, we just
    // undo our custom fields/indexes and restore the default name + avatar fields.
    try {
        const users = app.findCollectionByNameOrId("users");

        for (const f of ["full_name","phone","role","preferred_language","commune","wilaya","interests"]) {
            users.fields.removeByName(f);
        }

        // drop our custom indexes; keep PocketBase's own (email, tokenKey, etc.)
        users.indexes = users.indexes.filter((idx) =>
            idx.indexOf("idx_users_role") === -1 &&
            idx.indexOf("idx_users_commune") === -1
        );

        // restore PocketBase's default fields removed in the up migration
        users.fields.addMarshaledJSON(JSON.stringify([
            { type: "text", name: "name" },
            {
                type: "file", name: "avatar",
                maxSelect: 1, maxSize: 5242880,
                mimeTypes: ["image/jpeg","image/png","image/svg+xml","image/gif","image/webp"],
            },
        ]));

        app.save(users);
    } catch (_) {}
});
