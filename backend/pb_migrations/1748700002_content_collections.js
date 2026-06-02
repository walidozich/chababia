/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {

    const establishments = app.findCollectionByNameOrId("establishments");
    const activities     = app.findCollectionByNameOrId("activities");

    // ─── 1. announcements ────────────────────────────────────────────────────
    // Short urgent messages from ODEJ staff. Published-only public read.
    const announcements = new Collection({
        type: "base",
        name: "announcements",
        listRule:   "status = 'published'",
        viewRule:   "status = 'published'",
        createRule: null,
        updateRule: null,
        deleteRule: null,
        fields: [
            { type: "text",     name: "title",    required: true },
            { type: "text",     name: "content",  required: true },
            {
                type: "select", name: "priority",
                values: ["normal", "high", "urgent"], maxSelect: 1,
            },
            {
                type: "relation", name: "related_establishment",
                collectionId: establishments.id, maxSelect: 1,
            },
            {
                type: "relation", name: "related_activity",
                collectionId: activities.id, maxSelect: 1,
            },
            {
                type: "select", name: "language",
                values: ["ar", "fr", "tzm", "all"], maxSelect: 1,
            },
            {
                type: "select", name: "status",
                values: ["draft", "published", "archived"], maxSelect: 1,
            },
        ],
        indexes: [
            "CREATE INDEX idx_announcements_status   ON announcements(status)",
            "CREATE INDEX idx_announcements_language ON announcements(language)",
        ],
    });
    app.save(announcements);

    // ─── 2. newsletters ───────────────────────────────────────────────────────
    // Admin-published digests and updates. Text-first; thumbnail is optional and compressed.
    const newsletters = new Collection({
        type: "base",
        name: "newsletters",
        listRule:   "status = 'published'",
        viewRule:   "status = 'published'",
        createRule: null,
        updateRule: null,
        deleteRule: null,
        fields: [
            { type: "text",     name: "title",   required: true },
            { type: "text",     name: "content", required: true },
            {
                type: "select", name: "language",
                values: ["ar", "fr", "tzm", "all"], maxSelect: 1,
            },
            { type: "text",     name: "target_commune" },
            { type: "text",     name: "target_wilaya" },
            {
                type: "relation", name: "related_activity",
                collectionId: activities.id, maxSelect: 1,
            },
            {
                type: "relation", name: "related_establishment",
                collectionId: establishments.id, maxSelect: 1,
            },
            {
                // optional compressed thumbnail — eco rule: not required for the message
                type: "file",   name: "thumbnail",
                maxSize:   307200,
                maxSelect: 1,
                mimeTypes: ["image/jpeg", "image/png", "image/webp"],
                thumbs:    ["400x0"],
            },
            {
                type: "select", name: "status",
                values: ["draft", "published", "archived"], maxSelect: 1,
            },
            { type: "date",     name: "published_at" },
        ],
        indexes: [
            "CREATE INDEX idx_newsletters_status          ON newsletters(status)",
            "CREATE INDEX idx_newsletters_language        ON newsletters(language)",
            "CREATE INDEX idx_newsletters_target_commune  ON newsletters(target_commune)",
        ],
    });
    app.save(newsletters);

    // ─── 3. documents ─────────────────────────────────────────────────────────
    // Guides, PDFs, and orientation documents. PDF-only file uploads (spec §19).
    const documents = new Collection({
        type: "base",
        name: "documents",
        listRule:   "status = 'published'",
        viewRule:   "status = 'published'",
        createRule: null,
        updateRule: null,
        deleteRule: null,
        fields: [
            { type: "text",     name: "title",       required: true },
            { type: "text",     name: "description" },
            {
                // PDF only, 10 MB limit
                type: "file",   name: "file",
                maxSize:   10485760,
                maxSelect: 1,
                mimeTypes: ["application/pdf"],
            },
            {
                type: "select", name: "language",
                values: ["ar", "fr", "tzm", "all"], maxSelect: 1,
            },
            {
                type: "select", name: "category",
                values: [
                    "orientation", "health", "legal", "training",
                    "volunteering", "science", "arts", "general",
                ],
                maxSelect: 1,
            },
            {
                type: "relation", name: "establishment",
                collectionId: establishments.id, maxSelect: 1,
            },
            {
                type: "select", name: "status",
                values: ["draft", "published", "archived"], maxSelect: 1,
            },
        ],
        indexes: [
            "CREATE INDEX idx_documents_status   ON documents(status)",
            "CREATE INDEX idx_documents_language ON documents(language)",
            "CREATE INDEX idx_documents_category ON documents(category)",
        ],
    });
    app.save(documents);

}, (app) => {
    for (const name of ["documents", "newsletters", "announcements"]) {
        try {
            const c = app.findCollectionByNameOrId(name);
            app.delete(c);
        } catch (_) {}
    }
});
