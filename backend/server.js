const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Messages = require('./dbmessages.js')
const Pusher = require('pusher')
const cors = require('cors')
const Rooms = require('./chatrooms.js')
require('dotenv').config()
const User = require('./users.js')

const app = express()
const port = process.env.PORT || 9000

const pusher = new Pusher({
  appId: process.env.pusherId,
  key: process.env.pusherKey,
  secret: process.env.pusherSecret,
  cluster: "ap2",
  useTLS: true
});

app.use(express.json());
app.use(cors());

const connection_url = process.env.MONGODB_CON_STR

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
	    console.log(roomDetails);
	    pusher.trigger('rooms','inserted',
		{
		    name: roomDetails.name,
		    _id: roomDetails._id
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

app.get('/rooms/getRoom', (req, res) => {
    Rooms.findById(req.query.roomId,(err, data) => {
	if (err) {
	    res.status(500).send(err)
	} else {
	    res.status(200).send(data)
	}
    })
});

app.post('/users/register', async (req, res) => {
    const {pnum, password, passwordCheck, displayName} = req.body;

    if (!pnum || !password || !passwordCheck || !displayName) {
	return res.status(400).json({msg:"Please enter all the fields"})
    }

    if (isNaN(pnum)) {
	return res.status(400).json({msg:"Please enter a valid phone number"})
    }

    if (password != passwordCheck) {
	return res.status(400).json({msg:"Passwords don't match"})
    }

    const existingUser = await User.findOne({pnum: pnum})

    if (existingUser) {
	return res.status(400).json({msg: "This mobile number is already registered."})
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    console.log(passwordHash);
   
    const newUser = User({
	pnum,
	password: passwordHash,
	displayName
    });
    const savedUser = await newUser.save();
    res.json(savedUser);
});

app.post("/users/login", async (req, res) => {
    const { pnum, password } = req.body;

    if (!pnum || !password) {
	return res.status(400).json({msg:"Please enter all the fields"})
    }

    if (isNaN(pnum)) {
	return res.status(400).json({msg: "Please enter a valid phone number"})
    }

    const user = await User.findOne({pnum: pnum});

    if (!user) {
	return res.status(400).json({msg: "No account with this phone number has been registered"});
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
	return res.status(400).json({msg: "Invalid Credentials"});

    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);

    res.json({
	token,
	user: {
	    id: user._id,
	    pnum: user.pnum,
	    displayName: user.displayName
	}
    });
});

app.listen(port, () => console.log(`listening on localhost:${port}`))
