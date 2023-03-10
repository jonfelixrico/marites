migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("bluhvh3lwcwex7h")

  collection.listRule = "chat.owner.id = @request.auth.id ||\n(\n  @collection.chatMember.chat.id ?= chat.id &&\n  @collection.chatMember.user.id ?= @request.auth.id\n)"
  collection.viewRule = null
  collection.createRule = "chat.owner.id = @request.auth.id ||\n(\n  @collection.chatMember.chat.id ?= chat.id &&\n  @collection.chatMember.user.id ?= @request.auth.id\n)"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("bluhvh3lwcwex7h")

  collection.listRule = null
  collection.viewRule = ""
  collection.createRule = null

  return dao.saveCollection(collection)
})
