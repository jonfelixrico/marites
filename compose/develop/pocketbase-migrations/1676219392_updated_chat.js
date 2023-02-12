migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("uy9yh7d9jnl5c9i")

  collection.listRule = "owner.id = @request.auth.id || (\n  id ?= @collection.chatMember.chat.id &&\n  @collection.chatMember.user.id ?= @request.auth.id\n)"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("uy9yh7d9jnl5c9i")

  collection.listRule = null

  return dao.saveCollection(collection)
})
