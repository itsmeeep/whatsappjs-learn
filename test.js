const { MongoClient, ObjectId } = require("mongodb");
const url = "mongodb://0.0.0.0:27017";
const mongo = new MongoClient(url);
const databaseName = "whatsapp";

function getID() {
    var timestamp = Math.floor(new Date().getTime()/1000);
    var timestampDate = new Date(timestamp*1000);
    var id = new ObjectId(timestampDate.getTime());

    return id.toString();
}

const getAll = (collsName) => new Promise(async (resolve, reject) => {
    await mongo.connect();
    console.log("Connected successfully to server");

    const db = mongo.db(databaseName);
    const collection = db.collection(collsName);

    var result = await collection.find({}).toArray();
    await mongo.close();

    resolve(result);
});

const getAllFind = (collsName, paramters) => new Promise(async (resolve, reject) => {
    await mongo.connect();
    console.log("Connected successfully to server");

    const db = mongo.db(databaseName);
    const collection = db.collection(collsName);

    var result = await collection.find(paramters).toArray();
    await mongo.close();

    resolve(result);
});

const insertData = (collsName, data) => new Promise(async (resolve, reject) => {
    await mongo.connect();
    console.log("Connected successfully to server");

    const db = mongo.db(databaseName);
    const collection = db.collection(collsName);

    var result = await collection.insertMany(data);
    await mongo.close();

    resolve("success");
});

const testJoin = () => new Promise (async (resolve, reject) => {
    await mongo.connect();
    console.log("connected")

    const db = mongo.db(databaseName)
    const result = await db.collection('head').aggregate([
        {
            $lookup: {
                from: "foot",
                localField: "_id",
                foreignField: "head_id",
                as: "details"
            }
        }
    ]).toArray();

    await mongo.close();
    resolve(result)
}); 

(async () => {  
    var hehe = await testJoin();
    console.log(hehe[0])
    // await insertData("parents");
})();
