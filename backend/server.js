const express = require('express')
const mongoose = require('mongoose')
const Messages = require('./dbmessages.js')
const Pusher = require('pusher')
const cors = require('cors')
const Rooms = require('./chatrooms.js')

const app = express()
const port = process.env.PORT || 9000

const pusher = new Pusher({
  appId: "1",
  key: "5",
  secret: "9",
  cluster: "ap2",
  useTLS: true
});

app.use(express.json());
app.use(cors());

const connection_url = 'mongodb+srv://admin:a@cluster0.fujwv.mongodb.net/whatsappdb?retryWrites=true&w=majority'

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

    const roomCollection = db.collection("chatrooms");
    const changeStream2 = roomCollection.watch();

    changeStream.on('change', (change) => {
	console.log(change);
	
	if (change.operationType === 'insert') {
	    const messageDetails = change.fullDocument;
	    pusher.trigger('messages','inserted',
		{
		    name: messageDetails.name,
		    message: messageDetails.message,
		    timestamp: messageDetails.timestamp,
		    received: messageDetails.received
		}
	    );
	} else {
	    console.log('Error triggering Pusher');
	}
    });

    changeStream2.on('change', (change) => {
	console.log(change);
	
	if (change.operationType === 'insert') {
	    const roomDetails = change.fullDocument;
	    pusher.trigger('rooms','inserted',
		{
		    name: roomDetails.name
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
});

app.post('/messages/new', (req, res) => {
    const dbMessage = req.body;

    Messages.create(dbMessage, (err, data) => {
	if (err) {
	    res.status(500).send(err)
	} else {
	    res.status(201).send(data)
	}
    })
});


app.post('/rooms/new', (req, res) => {
    const dbMessage = req.body;

    Rooms.create(dbMessage, (err, data) => {
	if (err) {
	    res.status(500).send(err)
	} else {
	    res.status(201).send(data)
	}
    })
});

app.get('/rooms/sync', (req, res) => {
    Rooms.find((err, data) => {
	if (err) {
	    res.status(500).send(err)
	} else {
	    res.status(200).send(data)
	}
    })
});

app.listen(port, () => console.log(`listening on localhost:${port}`))
