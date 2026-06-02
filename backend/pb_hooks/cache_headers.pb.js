/// <reference path="../pb_data/types.d.ts" />

// Sets Cache-Control headers and handles conditional GET (ETag / 304) for
// public collection endpoints. Uses routerUse so e.response is available.
//
// ETag strategy: weak ETag derived from the collection's highest record ID.
// ID changes on any insert or delete, so the ETag invalidates correctly for
// those events. Modifications to existing records don't change the ID —
// the Cache-Control max-age provides the freshness guarantee for those cases.
//
// NOTE: PocketBase 0.39 base collections do not store per-row created/updated
// timestamps in SQLite, so ID-based ETag is the lightweight alternative.
//
// Cache durations per spec §13.3:
//   categories / *_translations / documents → 7 days
//   establishments / *_translations         → 24 hours
//   activities                              → 30 min
//   announcements / newsletters             → 10 min
//   talent_showcase                         → 1 hour

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
               collectionName === "activity_translations" ||
               collectionName === "establishment_translations") {
        maxAge = 86400;
    } else if (collectionName === "activities") {
        maxAge = 1800;
    } else if (collectionName === "announcements" ||
               collectionName === "newsletters") {
        maxAge = 600;
    } else if (collectionName === "talent_showcase") {
        maxAge = 3600;
    }

    if (maxAge === 0) return e.next();

    // Weak ETag: sort by -id gives the lexicographically latest record ID.
    // $app (global) is used to avoid any goja closure issue.
    let etag = "";
    try {
        const latest = $app.findRecordsByFilter(collectionName, "id != ''", "-id", 1, 0);
        if (latest && latest.length > 0) {
            etag = 'W/"' + latest[0].id + '"';
        }
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
