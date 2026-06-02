/// <reference path="../pb_data/types.d.ts" />

// Audit stamping (spec §19) — records WHO created/updated a record.
//
// Global request hooks (no collection tag) so they fire for every write, including
// edits made through the PocketBase Admin UI. The acting auth record id is written
// to created_by / updated_by when those fields exist on the target collection.
// Stored as the raw auth id (works for both `users` and `_superusers` actors).

onRecordCreateRequest((e) => {
    if (!e.record || !e.auth) return e.next();
    try {
        const fields = e.record.collection().fields;
        if (fields.getByName("created_by")) e.record.set("created_by", e.auth.id);
        if (fields.getByName("updated_by")) e.record.set("updated_by", e.auth.id);
    } catch (_) {}
    return e.next();
});

onRecordUpdateRequest((e) => {
    if (!e.record || !e.auth) return e.next();
    try {
        const fields = e.record.collection().fields;
        if (fields.getByName("updated_by")) e.record.set("updated_by", e.auth.id);
    } catch (_) {}
    return e.next();
});
