migrate((db) => {
  const collection = new Collection({
    "id": "x3bhdy6tjfmtip7",
    "created": "2023-03-14 15:03:46.085Z",
    "updated": "2023-03-14 15:03:46.085Z",
    "name": "chatJoinCode",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "owvhqrjy",
        "name": "chat",
        "type": "relation",
        "required": true,
        "unique": true,
        "options": {
          "collectionId": "uy9yh7d9jnl5c9i",
          "cascadeDelete": false,
          "maxSelect": 1,
          "displayFields": []
        }
      },
      {
        "system": false,
        "id": "hwhggja5",
        "name": "joinCode",
        "type": "text",
        "required": true,
        "unique": true,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      }
    ],
    "listRule": "",
    "viewRule": null,
    "createRule": "",
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("x3bhdy6tjfmtip7");

  return dao.deleteCollection(collection);
})
