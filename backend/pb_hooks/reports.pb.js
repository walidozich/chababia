/// <reference path="../pb_data/types.d.ts" />

// Content report ownership (spec §18 / §23.2).
//
// Users can flag outdated or incorrect public content, but the client must not
// decide who the reporter is or whether the report is already reviewed/resolved.
// Staff review remains superuser-only via the collection rules.

onRecordCreateRequest((e) => {
    if (!e.record || !e.auth) return e.next();

    e.record.set("reporter", e.auth.id);
    e.record.set("status", "new");

    return e.next();
}, "content_reports");
