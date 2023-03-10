migrate((db) => {
  const collection = new Collection({
    "id": "bluhvh3lwcwex7h",
    "created": "2023-02-04 13:56:18.058Z",
    "updated": "2023-02-04 13:56:18.058Z",
    "name": "messsages",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "h8ekb2mc",
        "name": "content",
        "type": "text",
        "required": true,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "j3sl1nmb",
        "name": "chatRoomId",
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
  const collection = dao.findCollectionByNameOrId("bluhvh3lwcwex7h");

  return dao.deleteCollection(collection);
})
