migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("dyrgu0atqi2z9sz")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "yuapt16u",
    "name": "chat",
    "type": "relation",
    "required": true,
    "unique": false,
    "options": {
      "collectionId": "uy9yh7d9jnl5c9i",
      "cascadeDelete": false,
      "maxSelect": 1,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("dyrgu0atqi2z9sz")

  // update
  collection.schema.addField(new SchemaField({
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
  }))

  return dao.saveCollection(collection)
})
