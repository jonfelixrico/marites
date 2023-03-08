migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("r7xmjs8unqtz6rp")

  collection.createRule = "(chat.owner.id = @request.auth.id && user.id != chat.owner.id) ||\n(chat.owner.id != @request.auth.id && user.id = @request.auth.id )"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("r7xmjs8unqtz6rp")

  collection.createRule = null

  return dao.saveCollection(collection)
})
