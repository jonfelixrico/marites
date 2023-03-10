migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("dyrgu0atqi2z9sz")

  collection.createRule = "(@request.auth.id = chat.owner.id || @request.auth.id = user.id) &&\n(\n  @collection.chatMember.removed ?= false &&\n  @collection.chatMember.chat.id ?!= chat.id &&\n  @collection.chatMember.user.id ?!= user.id\n)\n"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("dyrgu0atqi2z9sz")

  collection.createRule = null

  return dao.saveCollection(collection)
})
