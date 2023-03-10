migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("bluhvh3lwcwex7h")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "nccw4dsl",
    "name": "senderId",
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
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("bluhvh3lwcwex7h")

  // remove
  collection.schema.removeField("nccw4dsl")

  return dao.saveCollection(collection)
})
