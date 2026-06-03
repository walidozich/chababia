/// <reference path="../pb_data/types.d.ts" />

// Security fixes (code review 2026-06-03):
//
//   1. registrations.updateRule was too broad:
//        "@request.auth.id != '' && (user = @request.auth.id || @request.auth.role != 'youth')"
//      Any non-youth user — including content_editor — could update any registration
//      from any establishment. Tightened to only the roles that legitimately need it:
//      the registration owner, attendance_staff (pointage), establishment_manager,
//      wilaya_admin, and super_admin. content_editor is explicitly excluded.
//
//   2. users.listRule was too broad:
//        "@request.auth.role = 'super_admin' || @request.auth.role = 'wilaya_admin'"
//      A wilaya_admin could list users from every wilaya. Scoped to own wilaya.
//      viewRule is intentionally left broad — it must stay permissive so that
//      admin relation expand queries (e.g. expand=user in registrations) work.

migrate((app) => {

    // ── 1. registrations — tighten updateRule ─────────────────────────────────
    const regC = app.findCollectionByNameOrId("registrations");
    regC.updateRule =
        "@request.auth.id != '' && (" +
            "user = @request.auth.id || " +
            "@request.auth.role = 'attendance_staff' || " +
            "@request.auth.role = 'establishment_manager' || " +
            "@request.auth.role = 'wilaya_admin' || " +
            "@request.auth.role = 'super_admin'" +
        ")";
    app.save(regC);

    // ── 2. users — scope wilaya_admin listRule to own wilaya ──────────────────
    const usersC = app.findCollectionByNameOrId("users");
    usersC.listRule =
        "@request.auth.role = 'super_admin' || " +
        "(@request.auth.role = 'wilaya_admin' && wilaya = @request.auth.wilaya)";
    app.save(usersC);

}, (app) => {

    // Restore the rules from migration 1748700014
    const regC = app.findCollectionByNameOrId("registrations");
    regC.updateRule = "@request.auth.id != '' && (user = @request.auth.id || @request.auth.role != 'youth')";
    app.save(regC);

    const usersC = app.findCollectionByNameOrId("users");
    usersC.listRule = "@request.auth.role = 'super_admin' || @request.auth.role = 'wilaya_admin'";
    app.save(usersC);

});
