/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {

    const users          = app.findCollectionByNameOrId("users");
    const establishments = app.findCollectionByNameOrId("establishments");

    // ─── 1. project_submissions ───────────────────────────────────────────────
    // Youth submit project ideas; ODEJ staff review them.
    // Auth users can create and read their own submissions only.
    const projectSubmissions = new Collection({
        type: "base",
        name: "project_submissions",
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
                type: "relation", name: "establishment",
                collectionId: establishments.id, maxSelect: 1,
            },
            { type: "text",     name: "project_title",    required: true },
            {
                type: "select", name: "category",
                values: [
                    "Sports", "Culture", "Training", "Volunteering",
                    "Health Awareness", "Science", "Arts", "Environment",
                    "Youth Orientation", "Camps and Trips", "Coding",
                    "Design", "Robotics", "Photography", "Debate",
                ],
                maxSelect: 1,
            },
            { type: "text",     name: "commune",          required: true },
            { type: "text",     name: "short_description", required: true },
            { type: "text",     name: "needed_support" },
            { type: "text",     name: "contact_phone",    required: true },
            {
                // optional supporting document — PDF only, 5 MB limit
                type: "file",   name: "optional_document",
                maxSize:   5242880,
                maxSelect: 1,
                mimeTypes: ["application/pdf"],
            },
            {
                type: "select", name: "status",
                values: ["submitted", "reviewed", "accepted", "rejected", "needs_more_info"],
                maxSelect: 1,
            },
            { type: "text",     name: "assigned_mentor" },
        ],
        indexes: [
            "CREATE INDEX idx_project_submissions_user   ON project_submissions(user)",
            "CREATE INDEX idx_project_submissions_status ON project_submissions(status)",
        ],
    });
    app.save(projectSubmissions);

    // ─── 2. talent_showcase ───────────────────────────────────────────────────
    // Admin-curated youth achievements. Public read for published items.
    // Eco rules: no public comments, no likes, no video hosting, paginated list,
    // compressed image only — external_link for video references.
    const talentShowcase = new Collection({
        type: "base",
        name: "talent_showcase",
        listRule:   "status = 'published'",
        viewRule:   "status = 'published'",
        createRule: null,
        updateRule: null,
        deleteRule: null,
        fields: [
            {
                type: "relation", name: "user",
                collectionId: users.id, maxSelect: 1,
            },
            { type: "text",     name: "title",       required: true },
            { type: "text",     name: "description" },
            {
                type: "select", name: "category",
                values: [
                    "Sports", "Culture", "Training", "Volunteering",
                    "Health Awareness", "Science", "Arts", "Environment",
                    "Youth Orientation", "Camps and Trips", "Coding",
                    "Design", "Robotics", "Photography", "Debate",
                ],
                maxSelect: 1,
            },
            {
                // compressed image only — no video hosting (spec §12.4)
                type: "file",   name: "media",
                maxSize:   307200,
                maxSelect: 1,
                mimeTypes: ["image/jpeg", "image/png", "image/webp"],
                thumbs:    ["400x0", "100x100"],
            },
            // video or external resource links stored as URL, not hosted (spec §12.4)
            { type: "url",      name: "external_link" },
            {
                type: "select", name: "status",
                values: ["draft", "published", "archived"], maxSelect: 1,
            },
            { type: "date",     name: "published_at" },
        ],
        indexes: [
            "CREATE INDEX idx_talent_showcase_status   ON talent_showcase(status)",
            "CREATE INDEX idx_talent_showcase_category ON talent_showcase(category)",
        ],
    });
    app.save(talentShowcase);

    // ─── 3. recommendation_requests ───────────────────────────────────────────
    // Admin-only: stores compact summaries of AI event-recommendation requests.
    // All rules null = superuser access only. No youth-facing data stored here.
    // Eco rule: store only input_summary + suggestions_json, never full prompts or profiles.
    const recommendationRequests = new Collection({
        type: "base",
        name: "recommendation_requests",
        listRule:   null,
        viewRule:   null,
        createRule: null,
        updateRule: null,
        deleteRule: null,
        fields: [
            {
                type: "relation", name: "admin_user",
                collectionId: users.id, maxSelect: 1, required: true,
            },
            { type: "text",     name: "commune" },
            { type: "text",     name: "wilaya" },
            {
                type: "select", name: "establishment_type",
                values: [
                    "youth_house", "youth_hostel", "sports_complex",
                    "youth_camp", "polyvalent_hall", "scientific_leisure_center",
                ],
                maxSelect: 1,
            },
            // compact summary of the request inputs (not full user profiles)
            { type: "text",     name: "input_summary",   required: true },
            { type: "text",     name: "model_provider" },
            { type: "text",     name: "model_api_used" },
            // JSON string containing the returned draft suggestions
            { type: "text",     name: "suggestions_json" },
            {
                type: "select", name: "status",
                values: ["pending", "completed", "failed", "cached"],
                maxSelect: 1,
            },
        ],
        indexes: [
            "CREATE INDEX idx_recommendation_requests_admin_user ON recommendation_requests(admin_user)",
            "CREATE INDEX idx_recommendation_requests_status     ON recommendation_requests(status)",
        ],
    });
    app.save(recommendationRequests);

}, (app) => {
    for (const name of ["recommendation_requests", "talent_showcase", "project_submissions"]) {
        try {
            const c = app.findCollectionByNameOrId(name);
            app.delete(c);
        } catch (_) {}
    }
});
