migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("x3bhdy6tjfmtip7")

  collection.createRule = "chat.owner = @request.auth.id"
  collection.updateRule = "chat.owner = @request.auth.id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("x3bhdy6tjfmtip7")

  collection.createRule = null
  collection.updateRule = null

  return dao.saveCollection(collection)
})
