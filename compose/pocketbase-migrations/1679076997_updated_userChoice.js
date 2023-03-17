migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("6j330ctq2ksw4gp")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "trlufesa",
    "name": "code",
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
  const collection = dao.findCollectionByNameOrId("6j330ctq2ksw4gp")

  // remove
  collection.schema.removeField("trlufesa")

  return dao.saveCollection(collection)
})
