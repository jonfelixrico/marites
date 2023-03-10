migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("bluhvh3lwcwex7h")

  collection.listRule = "chat.owner.id = @request.auth.id ||\n(\n  @collection.chatUserMembership.chat.id ?= chat.id &&\n  @collection.chatUserMembership.user.id ?= @request.auth.id\n)"
  collection.createRule = "sender.id = @request.auth.id &&\n(\n  chat.owner.id = @request.auth.id ||\n  (\n    @collection.chatUserMembership.chat.id ?= chat.id &&\n    @collection.chatUserMembership.user.id ?= @request.auth.id\n  )\n)"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("bluhvh3lwcwex7h")

  collection.listRule = null
  collection.createRule = null

  return dao.saveCollection(collection)
})
