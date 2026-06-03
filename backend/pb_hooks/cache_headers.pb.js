/// <reference path="../pb_data/types.d.ts" />

// Sets Cache-Control headers and handles conditional GET (ETag / 304) for
// public collection endpoints. Uses routerUse so e.response is available.
//
// ETag strategy: weak ETag = "<record count>-<latest updated timestamp>".
// The count changes on inserts/deletes; the max(updated) changes on inserts and
// in-place edits (migration 1748700011 added the updated autodate field). Together
// they invalidate the cache for every data change.
//
// Cache durations per spec §13.3:
//   categories / category_translations / documents → 7 days
//   establishments / establishment_translations    → 24 hours
//   activities / activity_translations             → 30 min  (aligned so translations invalidate with parent)
//   announcements / newsletters                    → 10 min
//   talent_showcase                                → 1 hour

routerUse((e) => {
    const path = (e.request && e.request.url && e.request.url.path) ? e.request.url.path : "";
    if (!path.startsWith("/api/collections/")) return e.next();

    const parts          = path.split("/");
    const collectionName = parts[3];
    const segment        = parts[4];
    if (segment !== "records") return e.next();

    // Determine max-age (inline — avoids goja closure/scope issues)
    let maxAge = 0;
    if (collectionName === "categories" ||
        collectionName === "category_translations" ||
        collectionName === "documents") {
        maxAge = 604800;
    } else if (collectionName === "establishments" ||
               collectionName === "establishment_translations") {
        maxAge = 86400;
    } else if (collectionName === "activities" ||
               collectionName === "activity_translations") {
        maxAge = 1800;
    } else if (collectionName === "announcements" ||
               collectionName === "newsletters") {
        maxAge = 600;
    } else if (collectionName === "talent_showcase") {
        maxAge = 3600;
    }

    if (maxAge === 0) return e.next();

    // Weak ETag = "<count>-<latest updated>" — detects inserts, deletes, and edits.
    // $app (global) is used to avoid any goja closure issue.
    let etag = "";
    try {
        const total  = $app.countRecords(collectionName);
        const latest = $app.findRecordsByFilter(collectionName, "id != ''", "-updated", 1, 0);
        const stamp  = (latest && latest.length > 0) ? String(latest[0].get("updated")) : "empty";
        etag = 'W/"' + total + '-' + stamp + '"';
    } catch (_) {}

    // Conditional GET: return 304 when client's ETag still matches
    const clientEtag = (e.request && e.request.header) ? e.request.header.get("If-None-Match") : "";
    if (etag && clientEtag && clientEtag === etag) {
        e.response.header().set("Cache-Control", "public, max-age=" + maxAge);
        e.response.header().set("ETag", etag);
        e.response.writeHeader(304);
        return; // short-circuit — no body for 304
    }

    // Normal response: set headers before handler writes the body
    e.response.header().set("Cache-Control", "public, max-age=" + maxAge);
    if (etag) {
        e.response.header().set("ETag", etag);
    }

    return e.next();
});
