migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("uy9yh7d9jnl5c9i")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "6xxtxeh1",
    "name": "owner",
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
  const collection = dao.findCollectionByNameOrId("uy9yh7d9jnl5c9i")

  // remove
  collection.schema.removeField("6xxtxeh1")

  return dao.saveCollection(collection)
})
