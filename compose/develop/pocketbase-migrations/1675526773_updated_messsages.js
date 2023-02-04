migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("bluhvh3lwcwex7h")

  collection.listRule = ""
  collection.viewRule = ""
  collection.createRule = ""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("bluhvh3lwcwex7h")

  collection.listRule = null
  collection.viewRule = null
  collection.createRule = null

  return dao.saveCollection(collection)
})
