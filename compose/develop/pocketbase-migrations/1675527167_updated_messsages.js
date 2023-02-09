migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("bluhvh3lwcwex7h")

  // remove
  collection.schema.removeField("j3sl1nmb")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "s7unstbx",
    "name": "chatRoomId",
    "type": "relation",
    "required": true,
    "unique": false,
    "options": {
      "collectionId": "uy9yh7d9jnl5c9i",
      "cascadeDelete": false,
      "maxSelect": 1,
      "displayFields": [
        "id"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("bluhvh3lwcwex7h")

  // add
  collection.schema.addField(new SchemaField({
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
  }))

  // remove
  collection.schema.removeField("s7unstbx")

  return dao.saveCollection(collection)
})
