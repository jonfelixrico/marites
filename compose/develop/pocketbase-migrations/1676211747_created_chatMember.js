migrate((db) => {
  const collection = new Collection({
    "id": "dyrgu0atqi2z9sz",
    "created": "2023-02-12 14:22:27.283Z",
    "updated": "2023-02-12 14:22:27.283Z",
    "name": "chatMember",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "yuapt16u",
        "name": "chatRoom",
        "type": "relation",
        "required": true,
        "unique": false,
        "options": {
          "collectionId": "uy9yh7d9jnl5c9i",
          "cascadeDelete": false,
          "maxSelect": 1,
          "displayFields": []
        }
      },
      {
        "system": false,
        "id": "mm5jtcqr",
        "name": "user",
        "type": "relation",
        "required": true,
        "unique": false,
        "options": {
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": false,
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
  const collection = dao.findCollectionByNameOrId("dyrgu0atqi2z9sz");

  return dao.deleteCollection(collection);
})
