migrate((db) => {
  const collection = new Collection({
    "id": "r7xmjs8unqtz6rp",
    "created": "2023-02-25 14:46:41.029Z",
    "updated": "2023-02-25 14:46:41.029Z",
    "name": "chatMembership",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "a278qelx",
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
  const collection = dao.findCollectionByNameOrId("r7xmjs8unqtz6rp");

  return dao.deleteCollection(collection);
})
