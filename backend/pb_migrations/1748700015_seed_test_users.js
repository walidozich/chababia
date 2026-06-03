/// <reference path="../pb_data/types.d.ts" />

// Seed one test user per role so the dashboard can be tested without needing the
// PocketBase superuser account for every role.
//
// All test accounts share the same password: Test1234!
//
// Credentials summary:
//   wilaya@chababia.dz     / Test1234!  → wilaya_admin
//   manager@chababia.dz    / Test1234!  → establishment_manager
//   editor@chababia.dz     / Test1234!  → content_editor
//   staff@chababia.dz      / Test1234!  → attendance_staff
//   youth@chababia.dz      / Test1234!  → youth
//
// Superuser (PocketBase admin, not a users record):
//   admin@chababia.dz      / Chababia2026!

migrate((app) => {

    const users = app.findCollectionByNameOrId("users");

    const testUsers = [
        {
            email:     "wilaya@chababia.dz",
            full_name: "Amira Boudjemaa",
            role:      "wilaya_admin",
            commune:   "Béjaïa",
            wilaya:    "Béjaïa",
            preferred_language: "fr",
            interests: [],
        },
        {
            email:     "manager@chababia.dz",
            full_name: "Karim Hamitouche",
            role:      "establishment_manager",
            commune:   "Béjaïa",
            wilaya:    "Béjaïa",
            preferred_language: "fr",
            interests: [],
        },
        {
            email:     "editor@chababia.dz",
            full_name: "Yasmine Aït Yahia",
            role:      "content_editor",
            commune:   "Béjaïa",
            wilaya:    "Béjaïa",
            preferred_language: "fr",
            interests: [],
        },
        {
            email:     "staff@chababia.dz",
            full_name: "Mourad Saïd",
            role:      "attendance_staff",
            commune:   "Béjaïa",
            wilaya:    "Béjaïa",
            preferred_language: "fr",
            interests: [],
        },
        {
            email:     "youth@chababia.dz",
            full_name: "Lina Amrani",
            role:      "youth",
            commune:   "Béjaïa",
            wilaya:    "Béjaïa",
            preferred_language: "fr",
            interests: ["Coding", "Science", "Environment"],
        },
    ];

    for (let i = 0; i < testUsers.length; i++) {
        const u = testUsers[i];
        const record = new Record(users);
        record.set("email",              u.email);
        record.set("emailVisibility",    true);
        record.set("verified",           true);
        record.set("full_name",          u.full_name);
        record.set("role",               u.role);
        record.set("commune",            u.commune);
        record.set("wilaya",             u.wilaya);
        record.set("preferred_language", u.preferred_language);
        if (u.interests.length > 0) record.set("interests", u.interests);
        record.setPassword("Test1234!");
        app.save(record);
    }

}, (app) => {

    const emails = [
        "wilaya@chababia.dz",
        "manager@chababia.dz",
        "editor@chababia.dz",
        "staff@chababia.dz",
        "youth@chababia.dz",
    ];

    for (let i = 0; i < emails.length; i++) {
        try {
            const record = app.findFirstRecordByFilter("users", "email = {:e}", { e: emails[i] });
            app.delete(record);
        } catch (_) {}
    }

});
