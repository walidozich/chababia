/// <reference path="../pb_data/types.d.ts" />

// Spec compliance hardening:
//   §19 — add created_by / updated_by audit fields (stamped by pb_hooks/audit.pb.js)
//   §18 — add last_verified_at to the public content collections that lacked it
//
// created_by / updated_by are stored as TEXT holding the acting auth record id.
// Text (not a relation to users) because the actor may be a PocketBase superuser
// — who lives in _superusers, not users — when editing via the Admin UI.

migrate((app) => {

    // ── 1. created_by / updated_by on all 13 custom collections ───────────────
    const audited = [
        "categories", "establishments", "activities", "registrations",
        "announcements", "newsletters", "documents", "project_submissions",
        "talent_showcase", "recommendation_requests",
        "activity_translations", "establishment_translations", "category_translations",
    ];
    for (const name of audited) {
        const c = app.findCollectionByNameOrId(name);
        c.fields.addMarshaledJSON(JSON.stringify([
            { type: "text", name: "created_by" },
            { type: "text", name: "updated_by" },
        ]));
        app.save(c);
    }

    // ── 2. last_verified_at on the remaining public collections (§18) ─────────
    // activities + establishments already have it. Add to the rest of the
    // publicly-readable content so "Last verified" can be shown everywhere.
    const needsVerified = ["announcements", "newsletters", "documents", "talent_showcase"];
    for (const name of needsVerified) {
        const c = app.findCollectionByNameOrId(name);
        c.fields.addMarshaledJSON(JSON.stringify([
            { type: "date", name: "last_verified_at" },
        ]));
        app.save(c);
    }

}, (app) => {

    const audited = [
        "categories", "establishments", "activities", "registrations",
        "announcements", "newsletters", "documents", "project_submissions",
        "talent_showcase", "recommendation_requests",
        "activity_translations", "establishment_translations", "category_translations",
    ];
    for (const name of audited) {
        try {
            const c = app.findCollectionByNameOrId(name);
            c.fields.removeByName("created_by");
            c.fields.removeByName("updated_by");
            app.save(c);
        } catch (_) {}
    }

    const needsVerified = ["announcements", "newsletters", "documents", "talent_showcase"];
    for (const name of needsVerified) {
        try {
            const c = app.findCollectionByNameOrId(name);
            c.fields.removeByName("last_verified_at");
            app.save(c);
        } catch (_) {}
    }

});
