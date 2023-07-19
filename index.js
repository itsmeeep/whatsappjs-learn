const fs = require('fs')

const qrcode = require('qrcode-terminal');
const { Client, LocalAuth  } = require('whatsapp-web.js');
const whatsapp = new Client({
    authStrategy: new LocalAuth()
});

const express = require('express')
const app = express()
const port = 3000

// whatsapp
whatsapp.on('qr', qr => {
    qrcode.generate(qr, {
        small: true
    });
});

whatsapp.on('ready', () => {
    console.log('Client is ready!');
});

whatsapp.on('message', async message => {
	if(message.body === '!ping') {
		message.reply('pong');
        console.log(message.from);
	}
});

app.get('/send-whatsapp-notification', (req, res) => {
    var parents = fs.readFileSync('parents.json');
    parents = JSON.parse(parents);

    for (var i = 0; i < parents.length; i++) {
        var numbers = parents[i].number + '@c.us';
        var text = "Dear Mr/Mrs " + parents[i].number + ", \nwe inform you that " + parents[i].student + " is ..... . \nThank you";
        
        whatsapp.sendMessage(numbers, text)
    }

    res.send(parents)
})

whatsapp.initialize();

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})