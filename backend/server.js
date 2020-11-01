const express = require('express')
const mongoose = require('mongoose')
const Messages = require('./dbmessages.js')
const Pusher = require('pusher')

const app = express()
const port = process.env.PORT || 9000

const pusher = new Pusher({
  appId: "1100262",
  key: "eee705de17860fccb053",
  secret: "8e0e3cdb7dc8641299d2",
  cluster: "ap2",
  useTLS: true
});

app.use(express.json());

const connection_url = 'mongodb+srv://admin:weLehoFQN3NBiGTg@cluster0.fujwv.mongodb.net/whatsappdb?retryWrites=true&w=majority'

mongoose.connect(connection_url,{
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection

db.once('open', () => {
    console.log('DB is connected');
    const msgCollection = db.collection("messagecontents");
    const changeStream = msgCollection.watch();

    changeStream.on('change', (change) => {
	console.log(change);
	
	if (change.operationType === 'insert') {
	    const messageDetails = change.fullDocument;
	    pusher.trigger('messages','inserted',
		{
		    name: messageDetails.name,
		    message: messageDetails.message
		}
	    );
	} else {
	    console.log('Error triggering Pusher');
	}
    });
})

app.get('/',(req,res) => res.status(200).send('hello world'))

app.get('/messages/sync', (req, res) => {
    Messages.find((err, data) => {
	if (err) {
	    res.status(500).send(err)
	} else {
	    res.status(200).send(data)
	}
    })
})

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
