migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("r7xmjs8unqtz6rp")

  collection.createRule = "chat.owner.id != user.id &&\n(\n  (\n    @collection.chatUserMembership.chat.id != chat.id &&\n    @collection.chatUserMembership.user.id != user.id\n  )\n)"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("r7xmjs8unqtz6rp")

  collection.createRule = null

  return dao.saveCollection(collection)
})
