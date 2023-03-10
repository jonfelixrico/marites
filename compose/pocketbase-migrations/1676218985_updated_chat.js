migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("uy9yh7d9jnl5c9i")

  collection.listRule = "owner.id = @request.auth.id || (\n  @request.data.id ?= @collection.chatMember.chat.id &&\n  @collection.chatMember.user.id = @request.auth.id\n)"
  collection.viewRule = "owner.id = @request.auth.id || (\n  @request.data.id ?= @collection.chatMember.chat.id &&\n  @collection.chatMember.user.id = @request.auth.id\n)"
  collection.updateRule = "owner.id = @request.auth.id"
  collection.deleteRule = "owner.id = @request.auth.id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("uy9yh7d9jnl5c9i")

  collection.listRule = null
  collection.viewRule = null
  collection.updateRule = null
  collection.deleteRule = null

  return dao.saveCollection(collection)
})
