migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("dyrgu0atqi2z9sz")

  collection.createRule = "(@request.auth.id = chat.owner.id || @request.auth.id = user.id) &&\n(\n  @collection.chatMember.chat.id ?= chat.id &&\n  @collection.chatMember.user.id ?= user.id &&\n  @collection.chatMember.deleted = true\n)\n"

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "osrlbc5y",
    "name": "deleted",
    "type": "bool",
    "required": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("dyrgu0atqi2z9sz")

  collection.createRule = null

  // remove
  collection.schema.removeField("osrlbc5y")

  return dao.saveCollection(collection)
})
