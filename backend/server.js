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

//Initialize express app
const app = express()
const port = process.env.PORT || 9000

//Create pusher object
const pusher = new Pusher({
  appId: process.env.pusherId,
  key: process.env.pusherKey,
  secret: process.env.pusherSecret,
  cluster: "ap2",
  useTLS: true
});

//setup middleware
app.use(express.json());
app.use(cors());

//setup mongodb connection
const connection_url = process.env.MONGODB_CON_STR

mongoose.connect(connection_url,{
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection

//Watch for changes in mongodb collections using pusher
db.once('open', () => {
    console.log('DB is connected');
    const msgCollection = db.collection("messagecontents");
    const changeStream = msgCollection.watch();

    const roomCollection = db.collection("chatrooms");
    const changeStream2 = roomCollection.watch();

    changeStream.on('change', (change) => {
	
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
	
	if (change.operationType === 'insert') {
	    const roomDetails = change.fullDocument;
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

//Get messages based on RoomId
app.get('/messages/sync', (req, res) => {
    Messages.find({"$or":[{fromRoomId: req.query.roomId},{toRoomId:req.query.roomId}]},(err, data) => {
	if (err) {
	    res.status(500).send(err)
	} else {
	    res.status(200).send(data)
	}
    })
});

//insert messages to existing or new Room
app.post('/messages/new', async (req, res) => {
    const {roomId, message, name, timestamp, roomName, pnum, user, imageUrl} = req.body;
    var toRoomId;

    const existingRoom = await Messages.findOne({"$or":[{fromRoomId:roomId},{toRoomId:roomId}]})
 
    if(!existingRoom) {

	newRoom = Rooms({
	    pnum,
	    name: roomName,
	    user,
	    imageUrl
	});

 	const savedRoom = await newRoom.save();
	toRoomId = savedRoom._id
    }
    else {
	if (roomId == existingRoom.fromRoomId)
	    toRoomId = existingRoom.toRoomId
	else
	    toRoomId = existingRoom.fromRoomId
    }

    dbMessage = {
	fromRoomId: roomId,
	toRoomId,
	message,
	name,
	timestamp
    }

    Messages.create(dbMessage, (err, data) => {
	if (err) {
	    res.status(500).send(err)
	} else {
	    res.status(201).send(data)
	}
    })
});

//Create new room if room doesn't exists
app.post('/rooms/new', async (req, res) => {
    const newRoom= req.body;

    const {pnum, displayName, user, imageUrl} = req.body;

    const existingRoom = await Rooms.findOne({pnum: pnum, user: user})

    if (existingRoom) {
	return res.status(400).json({msg: "Chat already added."})
    }

    Rooms.create(newRoom, (err, data) => {
	if (err) {
	    res.status(500).send(err)
	} else {
	    res.status(201).send(data)
	}
    })
});

//Get all rooms for logged in user
app.get('/rooms/sync', (req, res) => {
    Rooms.find({user: req.query.pnum},(err, data) => {
	if (err) {
	    res.status(500).send(err)
	} else {
	    res.status(200).send(data)
	}
    })
});

//Get Room details based on RoomId
app.get('/rooms/getRoom', (req, res) => {
    Rooms.findById(req.query.roomId,(err, data) => {
	if (err) {
	    res.status(500).send(err)
	} else {
	    res.status(200).send(data)
	}
    })
});

//Register new user
app.post('/users/register', async (req, res) => {
    const {pnum, password, passwordCheck, displayName, imageUrl, gender} = req.body;

    if (!pnum || !password || !passwordCheck || !displayName) {
	return res.status(400).json({msg:"Please enter all the fields"})
    }

    if (isNaN(pnum)) {
	return res.status(400).json({msg:"Please enter a valid phone number"})
    }

    if (password != passwordCheck) {
	return res.status(400).json({msg:"Passwords don't match"})
    }

    if (gender === null) {
	return res.status(400).json({msg:"Please select a gender"})
    }

    const existingUser = await User.findOne({pnum: pnum})

    if (existingUser) {
	return res.status(400).json({msg: "This mobile number is already registered."})
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
   
    const newUser = User({
	pnum,
	password: passwordHash,
	displayName,
	imageUrl
    });
    const savedUser = await newUser.save();
    res.json(savedUser);
});

//User login
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
	    displayName: user.displayName,
	    imageUrl: user.imageUrl
	}
    });
});

//Get list of users
app.get('/users/getUsers', (req, res) => {
    User.find({pnum: {$ne: req.query.pnum}},(err, data) => {
	if (err) {
	    res.status(500).send(err)
	} else {
	    res.status(200).send(data)
	}
    })
});

app.listen(port, () => console.log(`listening on localhost:${port}`))
