migrate((db) => {
  const collection = new Collection({
    "id": "b9634gi5i6xa0vz",
    "created": "2023-02-04 14:02:46.731Z",
    "updated": "2023-02-04 14:02:46.731Z",
    "name": "chatroomMembers",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "rarbjz5a",
        "name": "userId",
        "type": "relation",
        "required": true,
        "unique": false,
        "options": {
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": false,
          "maxSelect": 1,
          "displayFields": [
            "id"
          ]
        }
      },
      {
        "system": false,
        "id": "y0ghlupj",
        "name": "field",
        "type": "text",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "n511fz1u",
        "name": "isOwner",
        "type": "bool",
        "required": false,
        "unique": false,
        "options": {}
      }
    ],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("b9634gi5i6xa0vz");

  return dao.deleteCollection(collection);
})
