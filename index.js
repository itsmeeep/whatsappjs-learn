const fs = require("fs").promises;

const qrcode = require("qrcode-terminal");
const { Client, LocalAuth } = require("whatsapp-web.js");
const whatsapp = new Client({
  authStrategy: new LocalAuth(),
});

const express = require("express");
const app = express();
const port = 3000;

// mongo
const { MongoClient } = require("mongodb");
const url = "mongodb://0.0.0.0:27017";
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
// end mongo

// whatsapp
whatsapp.on("qr", (qr) => {
  qrcode.generate(qr, {
    small: true,
  });
});

whatsapp.on("ready", () => {
  console.log("Client is ready!");
});

whatsapp.on("message", async (message) => {
  if (message.body === "!ping") {
    message.reply("pong");
    console.log(message.from);
  }
});

app.get("/send-whatsapp-notification", async (req, res) => {
  // Old Source Data
  // var parents = await fs.readFile("parents.json");
  // parents = JSON.parse(parents);

  // New Source Data
  var parents = await getAll("parents");

  for (var i = 0; i < parents.length; i++) {
    var numbers = parents[i].phone + "@c.us";
    var text =
      "Dear Mr/Mrs " +
      parents[i].phone +
      ", \nwe inform you that " +
      parents[i].student +
      " is ..... . \nThank you";

    await whatsapp.sendMessage(numbers, text);

    console.log(parents[i].phone)
  }

  res.send(parents);
});

whatsapp.initialize();

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
