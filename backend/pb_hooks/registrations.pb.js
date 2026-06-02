/// <reference path="../pb_data/types.d.ts" />

// Fires before every registration record is persisted.
// Responsibilities:
//   1. Enforce server-side capacity — auto-downgrade to waiting_list when full.
//   2. Generate a unique QR code token (rendered client-side by the mobile app).
//   3. Ensure the authenticated user is always set as the owner.
onRecordCreateRequest((e) => {
    if (!e.record) return e.next();

    // ── 1. lock owner to the authenticated user ───────────────────────────
    if (e.auth) {
        e.record.set("user", e.auth.id);
    }

    // ── 2. capacity check ─────────────────────────────────────────────────
    const activityId = e.record.get("activity");

    if (activityId) {
        let activity;
        try {
            activity = e.app.findRecordById("activities", activityId);
        } catch (_) {
            // activity not found — PocketBase relation validation will reject it
            return e.next();
        }

        const capacity = activity.get("capacity");
        const requiresRegistration = activity.get("requires_registration");

        if (requiresRegistration && capacity && capacity > 0) {
            // Count active registrations for this activity
            const registered = e.app.countRecords(
                "registrations",
                $dbx.hashExp({ activity: activityId, status: "registered" })
            );

            if (registered >= capacity) {
                e.record.set("status", "waiting_list");
            } else {
                e.record.set("status", "registered");
            }
        } else {
            e.record.set("status", "registered");
        }
    } else {
        e.record.set("status", "registered");
    }

    // ── 3. generate QR code token ─────────────────────────────────────────
    // Stored as a 32-char random token. The mobile app renders it as a QR code.
    // Staff scans it and calls the attendance endpoint to set status = "attended".
    e.record.set("qr_code", $security.randomString(32));

    return e.next();
}, "registrations");
