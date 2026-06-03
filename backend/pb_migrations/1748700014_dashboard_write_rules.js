/// <reference path="../pb_data/types.d.ts" />

// Dashboard write rules (spec §23 — role-scoped access).
//
// Before this migration all createRule/updateRule were null (superuser-only).
// Now admin-role users can create/edit through the API:
//
//   super_admin / wilaya_admin        → activities, establishments, content
//   establishment_manager             → activities, establishments (update only)
//   content_editor                    → announcements, newsletters, documents, talent_showcase
//   attendance_staff / any admin      → registrations (for check-in)
//
// List/view rules on content collections are widened so admins see drafts
// (public / youth still see published-only).
//
// users.viewRule is widened so non-youth admins can expand user records
// when viewing registrations, project submissions, etc.

migrate((app) => {

    // ── activities ────────────────────────────────────────────────────────────
    const actC = app.findCollectionByNameOrId("activities");
    actC.listRule   = "status = 'published' || (@request.auth.id != '' && @request.auth.role != 'youth')";
    actC.viewRule   = "status = 'published' || (@request.auth.id != '' && @request.auth.role != 'youth')";
    actC.createRule = "@request.auth.role = 'super_admin' || @request.auth.role = 'wilaya_admin' || @request.auth.role = 'establishment_manager'";
    actC.updateRule = "@request.auth.role = 'super_admin' || @request.auth.role = 'wilaya_admin' || @request.auth.role = 'establishment_manager'";
    app.save(actC);

    // ── establishments ────────────────────────────────────────────────────────
    const estC = app.findCollectionByNameOrId("establishments");
    estC.listRule   = "status = 'published' || (@request.auth.id != '' && @request.auth.role != 'youth')";
    estC.viewRule   = "status = 'published' || (@request.auth.id != '' && @request.auth.role != 'youth')";
    estC.createRule = "@request.auth.role = 'super_admin' || @request.auth.role = 'wilaya_admin'";
    estC.updateRule = "@request.auth.role = 'super_admin' || @request.auth.role = 'wilaya_admin' || @request.auth.role = 'establishment_manager'";
    app.save(estC);

    // ── announcements / newsletters / documents ───────────────────────────────
    const contentNames = ["announcements", "newsletters", "documents"];
    for (let i = 0; i < contentNames.length; i++) {
        const c = app.findCollectionByNameOrId(contentNames[i]);
        c.listRule   = "status = 'published' || (@request.auth.id != '' && @request.auth.role != 'youth')";
        c.viewRule   = "status = 'published' || (@request.auth.id != '' && @request.auth.role != 'youth')";
        c.createRule = "@request.auth.role = 'super_admin' || @request.auth.role = 'wilaya_admin' || @request.auth.role = 'content_editor'";
        c.updateRule = "@request.auth.role = 'super_admin' || @request.auth.role = 'wilaya_admin' || @request.auth.role = 'content_editor'";
        app.save(c);
    }

    // ── talent_showcase ───────────────────────────────────────────────────────
    // Admin-curated (staff creates/publishes achievements; youth do not submit directly)
    const talC = app.findCollectionByNameOrId("talent_showcase");
    talC.listRule   = "status = 'published' || (@request.auth.id != '' && @request.auth.role != 'youth')";
    talC.viewRule   = "status = 'published' || (@request.auth.id != '' && @request.auth.role != 'youth')";
    talC.createRule = "@request.auth.role = 'super_admin' || @request.auth.role = 'wilaya_admin' || @request.auth.role = 'content_editor'";
    talC.updateRule = "@request.auth.role = 'super_admin' || @request.auth.role = 'wilaya_admin' || @request.auth.role = 'content_editor'";
    app.save(talC);

    // ── project_submissions ───────────────────────────────────────────────────
    // Youth create their own; admins can list all and update review status
    const projC = app.findCollectionByNameOrId("project_submissions");
    projC.listRule   = "@request.auth.id != '' && (user = @request.auth.id || @request.auth.role != 'youth')";
    projC.viewRule   = "@request.auth.id != '' && (user = @request.auth.id || @request.auth.role != 'youth')";
    projC.updateRule = "@request.auth.role = 'super_admin' || @request.auth.role = 'wilaya_admin' || @request.auth.role = 'establishment_manager'";
    app.save(projC);

    // ── registrations ─────────────────────────────────────────────────────────
    // Admins and attendance_staff need to list all registrations for an activity
    // and update checked_in_at (or cancel registrations)
    const regC = app.findCollectionByNameOrId("registrations");
    regC.listRule   = "@request.auth.id != '' && (user = @request.auth.id || @request.auth.role != 'youth')";
    regC.viewRule   = "@request.auth.id != '' && (user = @request.auth.id || @request.auth.role != 'youth')";
    regC.updateRule = "@request.auth.id != '' && (user = @request.auth.id || @request.auth.role != 'youth')";
    app.save(regC);

    // ── activity_translations / establishment_translations ────────────────────
    // Public read stays open; writes now allowed for non-youth staff
    const transNames = ["activity_translations", "establishment_translations"];
    for (let i = 0; i < transNames.length; i++) {
        const c = app.findCollectionByNameOrId(transNames[i]);
        c.createRule = "@request.auth.id != '' && @request.auth.role != 'youth'";
        c.updateRule = "@request.auth.id != '' && @request.auth.role != 'youth'";
        app.save(c);
    }

    // ── users — widen viewRule so admins can expand user records ──────────────
    // Needed for: registrations list (expand user), project submissions, etc.
    // listRule opens to wilaya_admin + super_admin for the user-management screen.
    const usersC = app.findCollectionByNameOrId("users");
    usersC.listRule = "@request.auth.role = 'super_admin' || @request.auth.role = 'wilaya_admin'";
    usersC.viewRule = "id = @request.auth.id || (@request.auth.id != '' && @request.auth.role != 'youth')";
    app.save(usersC);

}, (app) => {

    // Restore original rules from the initial migrations

    const actC = app.findCollectionByNameOrId("activities");
    actC.listRule = actC.viewRule = "status = 'published'";
    actC.createRule = actC.updateRule = null;
    app.save(actC);

    const estC = app.findCollectionByNameOrId("establishments");
    estC.listRule = estC.viewRule = "status = 'published'";
    estC.createRule = estC.updateRule = null;
    app.save(estC);

    const contentNames = ["announcements", "newsletters", "documents"];
    for (let i = 0; i < contentNames.length; i++) {
        const c = app.findCollectionByNameOrId(contentNames[i]);
        c.listRule = c.viewRule = "status = 'published'";
        c.createRule = c.updateRule = null;
        app.save(c);
    }

    const talC = app.findCollectionByNameOrId("talent_showcase");
    talC.listRule = talC.viewRule = "status = 'published'";
    talC.createRule = talC.updateRule = null;
    app.save(talC);

    const projC = app.findCollectionByNameOrId("project_submissions");
    projC.listRule = projC.viewRule = "user = @request.auth.id";
    projC.updateRule = null;
    app.save(projC);

    const regC = app.findCollectionByNameOrId("registrations");
    regC.listRule = regC.viewRule = "user = @request.auth.id";
    regC.updateRule = null;
    app.save(regC);

    const transNames = ["activity_translations", "establishment_translations"];
    for (let i = 0; i < transNames.length; i++) {
        const c = app.findCollectionByNameOrId(transNames[i]);
        c.createRule = c.updateRule = null;
        app.save(c);
    }

    const usersC = app.findCollectionByNameOrId("users");
    usersC.listRule = null;
    usersC.viewRule = "id = @request.auth.id";
    app.save(usersC);

});
