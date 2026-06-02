/// <reference path="../pb_data/types.d.ts" />

// §18 / §23.2 (Should-Have) — "Users can report outdated information."
//
// A logged-in youth user can flag an activity / establishment / announcement /
// newsletter / document as outdated or wrong. Reports are private to ODEJ staff
// (superuser-only read) so they can review and fix the source content.
//
// reporter + default status are set server-side by pb_hooks/reports.pb.js.

migrate((app) => {

    const users = app.findCollectionByNameOrId("users");

    const reports = new Collection({
        type: "base",
        name: "content_reports",
        listRule:   null,                     // superuser only (staff review queue)
        viewRule:   null,
        createRule: "@request.auth.id != ''", // any authenticated youth can report
        updateRule: null,
        deleteRule: null,
        fields: [
            {
                type: "relation", name: "reporter",
                collectionId: users.id, maxSelect: 1,
            },
            {
                type: "select", name: "target_type", required: true, maxSelect: 1,
                values: ["activity", "establishment", "announcement", "newsletter", "document"],
            },
            // id of the reported record (kept as text — points across collections)
            { type: "text", name: "target_id", required: true },
            {
                type: "select", name: "reason", required: true, maxSelect: 1,
                values: ["outdated_info", "wrong_contact", "cancelled", "wrong_location", "other"],
            },
            { type: "text", name: "details" },
            {
                type: "select", name: "status", maxSelect: 1,
                values: ["new", "reviewed", "resolved", "dismissed"],
            },
            { type: "autodate", name: "created", onCreate: true, onUpdate: false },
            { type: "autodate", name: "updated", onCreate: true, onUpdate: true },
            { type: "text", name: "created_by" },
            { type: "text", name: "updated_by" },
        ],
        indexes: [
            "CREATE INDEX idx_content_reports_status ON content_reports(status)",
            "CREATE INDEX idx_content_reports_target ON content_reports(target_type, target_id)",
        ],
    });
    app.save(reports);

}, (app) => {
    try {
        const c = app.findCollectionByNameOrId("content_reports");
        app.delete(c);
    } catch (_) {}
});
