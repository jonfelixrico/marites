migrate((db) => {
  const collection = new Collection({
    "id": "6j330ctq2ksw4gp",
    "created": "2023-03-17 18:16:12.597Z",
    "updated": "2023-03-17 18:16:12.597Z",
    "name": "userChoice",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "woizmc9j",
        "name": "user",
        "type": "relation",
        "required": true,
        "unique": true,
        "options": {
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": []
        }
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
  const collection = dao.findCollectionByNameOrId("6j330ctq2ksw4gp");

  return dao.deleteCollection(collection);
})
