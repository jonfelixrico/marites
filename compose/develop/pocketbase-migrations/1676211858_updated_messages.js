migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("bluhvh3lwcwex7h")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "nccw4dsl",
    "name": "sender",
    "type": "relation",
    "required": true,
    "unique": false,
    "options": {
      "collectionId": "_pb_users_auth_",
      "cascadeDelete": false,
      "maxSelect": 1,
      "displayFields": []
    }
  }))

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "s7unstbx",
    "name": "chat",
    "type": "relation",
    "required": true,
    "unique": false,
    "options": {
      "collectionId": "uy9yh7d9jnl5c9i",
      "cascadeDelete": false,
      "maxSelect": 1,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("bluhvh3lwcwex7h")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "nccw4dsl",
    "name": "senderId",
    "type": "relation",
    "required": true,
    "unique": false,
    "options": {
      "collectionId": "_pb_users_auth_",
      "cascadeDelete": false,
      "maxSelect": 1,
      "displayFields": [
        "id"
      ]
    }
  }))

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "s7unstbx",
    "name": "chatRoomId",
    "type": "relation",
    "required": true,
    "unique": false,
    "options": {
      "collectionId": "uy9yh7d9jnl5c9i",
      "cascadeDelete": false,
      "maxSelect": 1,
      "displayFields": [
        "id"
      ]
    }
  }))

  return dao.saveCollection(collection)
})
