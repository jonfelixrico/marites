migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("r7xmjs8unqtz6rp")

  collection.viewRule = ""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("r7xmjs8unqtz6rp")

  collection.viewRule = null

  return dao.saveCollection(collection)
})
