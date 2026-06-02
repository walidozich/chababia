/// <reference path="../pb_data/types.d.ts" />

// Make recommendation_requests.admin_user optional.
// The original definition had required:true, but the endpoint is also callable
// by PocketBase superusers (stored in _superusers, not users), so the relation
// field cannot be set for them. Making it optional allows superuser requests
// to be stored without a users relation.

migrate((app) => {

    const coll  = app.findCollectionByNameOrId("recommendation_requests");
    const users = app.findCollectionByNameOrId("users");

    coll.fields.removeByName("admin_user");
    coll.fields.addMarshaledJSON(JSON.stringify([{
        type: "relation", name: "admin_user",
        collectionId: users.id, maxSelect: 1, required: false,
    }]));
    app.save(coll);

}, (app) => {

    const coll  = app.findCollectionByNameOrId("recommendation_requests");
    const users = app.findCollectionByNameOrId("users");

    coll.fields.removeByName("admin_user");
    coll.fields.addMarshaledJSON(JSON.stringify([{
        type: "relation", name: "admin_user",
        collectionId: users.id, maxSelect: 1, required: true,
    }]));
    app.save(coll);

});
