migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("dyrgu0atqi2z9sz")

  collection.listRule = "@collection.chatMember.removed ?= false &&\n(\n  @request.auth.id = chat.owner.id ||\n  (\n    chat.id ?= @collection.chatMember.chat.id &&\n    @collection.chatMember.user ?= @request.auth.id\n  )\n)"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("dyrgu0atqi2z9sz")

  collection.listRule = null

  return dao.saveCollection(collection)
})
