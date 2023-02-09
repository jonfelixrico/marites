migrate((db) => {
  const collection = new Collection({
    "id": "uy9yh7d9jnl5c9i",
    "created": "2023-02-04 13:58:25.484Z",
    "updated": "2023-02-04 13:58:25.484Z",
    "name": "chatrooms",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "kre9dhkl",
        "name": "name",
        "type": "text",
        "required": true,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
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
  const collection = dao.findCollectionByNameOrId("uy9yh7d9jnl5c9i");

  return dao.deleteCollection(collection);
})
