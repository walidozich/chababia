/// <reference path="../pb_data/types.d.ts" />

// Add `created` + `updated` autodate fields to all 13 custom collections.
//
// Defining collections via `new Collection({fields:[...]})` in a migration does NOT
// auto-add the created/updated autodate fields that the PocketBase Admin UI adds by
// default. Without them, records can't be sorted by recency (spec §15 ER diagram shows
// created_at/updated_at) and the cache ETag can't detect in-place edits.
//
// `created` is stamped once on insert; `updated` is stamped on insert and every update.
// Existing seeded rows are backfilled with the migration timestamp.

migrate((app) => {

    const collections = [
        "categories", "establishments", "activities", "registrations",
        "announcements", "newsletters", "documents", "project_submissions",
        "talent_showcase", "recommendation_requests",
        "activity_translations", "establishment_translations", "category_translations",
    ];

    // PocketBase datetime format: "YYYY-MM-DD HH:MM:SS.sssZ"
    const stamp = new Date().toISOString().replace("T", " ");

    for (const name of collections) {
        const c = app.findCollectionByNameOrId(name);
        c.fields.addMarshaledJSON(JSON.stringify([
            { type: "autodate", name: "created", onCreate: true, onUpdate: false },
            { type: "autodate", name: "updated", onCreate: true, onUpdate: true },
        ]));
        app.save(c);

        // Backfill rows that existed before the columns were added (e.g. seeded data),
        // so they carry a real timestamp instead of an empty string.
        app.db()
            .newQuery("UPDATE " + name + " SET created = {:t}, updated = {:t} " +
                      "WHERE created IS NULL OR created = ''")
            .bind({ t: stamp })
            .execute();
    }

}, (app) => {

    const collections = [
        "categories", "establishments", "activities", "registrations",
        "announcements", "newsletters", "documents", "project_submissions",
        "talent_showcase", "recommendation_requests",
        "activity_translations", "establishment_translations", "category_translations",
    ];

    for (const name of collections) {
        try {
            const c = app.findCollectionByNameOrId(name);
            c.fields.removeByName("created");
            c.fields.removeByName("updated");
            app.save(c);
        } catch (_) {}
    }

});
