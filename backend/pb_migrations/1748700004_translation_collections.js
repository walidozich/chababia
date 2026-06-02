/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {

    const activities     = app.findCollectionByNameOrId("activities");
    const establishments = app.findCollectionByNameOrId("establishments");
    const categories     = app.findCollectionByNameOrId("categories");

    // ─── 1. activity_translations ─────────────────────────────────────────────
    // One row per activity per language. Mobile app fetches the matching language row
    // alongside the activity detail. Public read — no status filter needed since
    // translations follow the parent activity's published status.
    const activityTranslations = new Collection({
        type: "base",
        name: "activity_translations",
        listRule:   "",
        viewRule:   "",
        createRule: null,
        updateRule: null,
        deleteRule: null,
        fields: [
            {
                type: "relation", name: "activity",
                collectionId: activities.id, maxSelect: 1, required: true,
            },
            {
                type: "select", name: "language", required: true,
                values: ["ar", "fr", "tzm"], maxSelect: 1,
            },
            { type: "text", name: "title" },
            { type: "text", name: "short_description" },
            { type: "text", name: "full_description" },
        ],
        indexes: [
            // compound index: most queries filter by both activity and language
            "CREATE UNIQUE INDEX idx_activity_translations_activity_lang ON activity_translations(activity, language)",
        ],
    });
    app.save(activityTranslations);

    // ─── 2. establishment_translations ────────────────────────────────────────
    const establishmentTranslations = new Collection({
        type: "base",
        name: "establishment_translations",
        listRule:   "",
        viewRule:   "",
        createRule: null,
        updateRule: null,
        deleteRule: null,
        fields: [
            {
                type: "relation", name: "establishment",
                collectionId: establishments.id, maxSelect: 1, required: true,
            },
            {
                type: "select", name: "language", required: true,
                values: ["ar", "fr", "tzm"], maxSelect: 1,
            },
            { type: "text", name: "description" },
            { type: "text", name: "services_text" },
            { type: "text", name: "accessibility_text" },
        ],
        indexes: [
            "CREATE UNIQUE INDEX idx_establishment_translations_establishment_lang ON establishment_translations(establishment, language)",
        ],
    });
    app.save(establishmentTranslations);

    // ─── 3. category_translations ─────────────────────────────────────────────
    const categoryTranslations = new Collection({
        type: "base",
        name: "category_translations",
        listRule:   "",
        viewRule:   "",
        createRule: null,
        updateRule: null,
        deleteRule: null,
        fields: [
            {
                type: "relation", name: "category",
                collectionId: categories.id, maxSelect: 1, required: true,
            },
            {
                type: "select", name: "language", required: true,
                values: ["ar", "fr", "tzm"], maxSelect: 1,
            },
            { type: "text", name: "name", required: true },
        ],
        indexes: [
            "CREATE UNIQUE INDEX idx_category_translations_category_lang ON category_translations(category, language)",
        ],
    });
    app.save(categoryTranslations);

}, (app) => {
    for (const name of ["category_translations", "establishment_translations", "activity_translations"]) {
        try {
            const c = app.findCollectionByNameOrId(name);
            app.delete(c);
        } catch (_) {}
    }
});
