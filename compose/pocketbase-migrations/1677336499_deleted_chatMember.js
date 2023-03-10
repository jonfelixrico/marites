migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("dyrgu0atqi2z9sz");

  return dao.deleteCollection(collection);
}, (db) => {
  const collection = new Collection({
    "id": "dyrgu0atqi2z9sz",
    "created": "2023-02-12 14:22:27.283Z",
    "updated": "2023-02-25 14:44:07.314Z",
    "name": "chatMember",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "yuapt16u",
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
      },
      {
        "system": false,
        "id": "mm5jtcqr",
        "name": "user",
        "type": "relation",
        "required": true,
        "unique": false,
        "options": {
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": false,
          "maxSelect": 1,
          "displayFields": []
        }
      },
      {
        "system": false,
        "id": "47vzqd5b",
        "name": "removed",
        "type": "bool",
        "required": false,
        "unique": false,
        "options": {}
      }
    ],
    "listRule": "removed = false &&\n(\n  @request.auth.id = chat.owner.id ||\n  (\n    chat.id ?= @collection.chatMember.chat.id &&\n    @collection.chatMember.user ?= @request.auth.id\n  )\n)",
    "viewRule": null,
    "createRule": "(@request.auth.id = chat.owner.id || @request.auth.id = user.id) &&\n(\n  @collection.chatMember.chat.id ?!= chat.id ||\n  @collection.chatMember.user.id ?!= user.id ||\n  (\n    @collection.chatMember.chat.id ?= chat.id && \n    @collection.chatMember.user.id ?= user.id &&\n    @collection.chatMember.removed ?!= true\n  )\n) &&\nremoved = false\n",
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
})
