migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("dyrgu0atqi2z9sz")

  collection.createRule = ""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("dyrgu0atqi2z9sz")

  collection.createRule = null

  return dao.saveCollection(collection)
})
