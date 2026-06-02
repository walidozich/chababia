/// <reference path="../pb_data/types.d.ts" />

// Sets HTTP Cache-Control headers on public collection endpoints.
// Uses routerUse (HTTP middleware layer) so e.response is always available.
// Cache durations per spec §13.3:
//   categories / *_translations  → 7 days   (rarely changes)
//   establishments               → 24 hours (changes slowly)
//   *_translations (activity/est)→ 24 hours (follows parent)
//   activities                   → 30 min   (changes moderately)
//   announcements / newsletters  → 10 min   (can be urgent)
//   documents                    → 7 days   (usually stable)
//   talent_showcase              → 1 hour

// Path format for PocketBase collection APIs:
//   /api/collections/{name}/records
//   /api/collections/{name}/records/{id}
// Cache rules are defined inline to avoid goja closure/scope issues.
routerUse((e) => {
    const path = (e.request && e.request.url && e.request.url.path) ? e.request.url.path : "";

    if (!path.startsWith("/api/collections/")) return e.next();

    const parts          = path.split("/");
    const collectionName = parts[3];
    const segment        = parts[4];

    if (segment !== "records") return e.next();

    // 7 days — rarely changes
    if (collectionName === "categories" ||
        collectionName === "category_translations" ||
        collectionName === "documents") {
        e.response.header().set("Cache-Control", "public, max-age=604800");

    // 24 hours — changes slowly
    } else if (collectionName === "establishments" ||
               collectionName === "activity_translations" ||
               collectionName === "establishment_translations") {
        e.response.header().set("Cache-Control", "public, max-age=86400");

    // 30 min — changes moderately
    } else if (collectionName === "activities") {
        e.response.header().set("Cache-Control", "public, max-age=1800");

    // 10 min — can be urgent
    } else if (collectionName === "announcements" ||
               collectionName === "newsletters") {
        e.response.header().set("Cache-Control", "public, max-age=600");

    // 1 hour
    } else if (collectionName === "talent_showcase") {
        e.response.header().set("Cache-Control", "public, max-age=3600");
    }

    return e.next();
});
