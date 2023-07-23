const { MongoClient } = require("mongodb");
const url = "mongodb://localhost:27017";
const mongo = new MongoClient(url);
const databaseName = "whatsapp";

const getAll = (collsName) => new Promise(async (resolve, reject) => {
    await mongo.connect();
    console.log("Connected successfully to server");

    const db = mongo.db(databaseName);
    const collection = db.collection(collsName);

    var result = await collection.find({}).toArray();
    await mongo.close();

    resolve(result);
});

(async () => {  
    var result = await getAll();
    console.log(result)
})();
