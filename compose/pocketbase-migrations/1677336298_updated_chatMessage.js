migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("bluhvh3lwcwex7h")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "nccw4dsl",
    "name": "sender",
    "type": "relation",
    "required": true,
    "unique": false,
    "options": {
      "collectionId": "_pb_users_auth_",
      "cascadeDelete": false,
      "maxSelect": 1,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("bluhvh3lwcwex7h")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "nccw4dsl",
    "name": "sender",
    "type": "relation",
    "required": true,
    "unique": false,
    "options": {
      "collectionId": "dyrgu0atqi2z9sz",
      "cascadeDelete": false,
      "maxSelect": 1,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
})
