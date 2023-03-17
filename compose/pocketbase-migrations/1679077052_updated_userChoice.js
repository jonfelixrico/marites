migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("6j330ctq2ksw4gp")

  collection.listRule = ""
  collection.createRule = "user.id = @request.auth.id"
  collection.updateRule = "user.id = @request.auth.id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("6j330ctq2ksw4gp")

  collection.listRule = null
  collection.createRule = null
  collection.updateRule = null

  return dao.saveCollection(collection)
})
