migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("r7xmjs8unqtz6rp")

  collection.listRule = "@request.auth.id = chat.owner.id ||\n(\n  @collection.chatUserMembership.chat.id ?= chat.id &&\n  @collection.chatUserMembership.user.id ?= @request.auth.id\n)"
  collection.createRule = ""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("r7xmjs8unqtz6rp")

  collection.listRule = null
  collection.createRule = null

  return dao.saveCollection(collection)
})
