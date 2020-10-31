const express = require('express');
const mongoose = require('mongoose');
const Messages = require('./dbmessages.js')

const app = express()
const port = process.env.PORT || 9000

app.use(express.json())

const connection_url = 'mongodb+srv://admin:xA1vF1OievwsDShq@cluster0.fujwv.mongodb.net/whatsappdb?retryWrites=true&w=majority'

mongoose.connect(connection_url,{
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.get('/',(req,res) => res.status(200).send('hello world'))

app.post('/messages/new', (req, res) => {
    const dbMessage = req.body;

    Messages.create(dbMessage, (err, data) => {
	if (err) {
	    res.status(500).send(err)
	} else {
	    res.status(201).send(data)
	}
    })
})

app.listen(port, () => console.log(`listening on localhost:${port}`))
