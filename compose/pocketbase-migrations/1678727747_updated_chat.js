migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("uy9yh7d9jnl5c9i")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "nfayvhsi",
    "name": "joinCode",
    "type": "text",
    "required": true,
    "unique": true,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("uy9yh7d9jnl5c9i")

  // remove
  collection.schema.removeField("nfayvhsi")

  return dao.saveCollection(collection)
})
