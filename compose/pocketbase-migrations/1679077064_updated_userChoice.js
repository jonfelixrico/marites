migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("6j330ctq2ksw4gp")

  collection.name = "userCode"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("6j330ctq2ksw4gp")

  collection.name = "userChoice"

  return dao.saveCollection(collection)
})
