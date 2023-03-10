migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("r7xmjs8unqtz6rp")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ec5m7af8",
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
  const collection = dao.findCollectionByNameOrId("r7xmjs8unqtz6rp")

  // remove
  collection.schema.removeField("ec5m7af8")

  return dao.saveCollection(collection)
})
