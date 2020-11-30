import React, { useState, useEffect, useContext } from "react";
import './Chat.css';
import { Avatar, IconButton } from "@material-ui/core";
import { SearchOutlined, MoreVert, AttachFile } from "@material-ui/icons/";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";
import axios from "../axios";
import { useParams } from "react-router-dom";
import {UserContext} from "../context/UserContext";
import pusher from '../Pusher.js';

function Chat() {
    const [input, setInput] = useState("");
    const { roomId } = useParams();
    const [room, setRoom] = useState('');
    const { userData } = useContext(UserContext);
    const [messages, setMessages] = useState([]);
    const [arr, setArr] = useState([]);

    useEffect(() => {
	if (roomId) {
	 axios.get('/rooms/getRoom', {
	    params: {
		roomId: roomId
	    }
	})
	.then(response => {
	  setRoom(response.data)
    })
	}
    }, [roomId]);

    const sendMessage = async (e) => {
	e.preventDefault();
	if (roomId) {
	await axios.post('messages/new', {
	    roomId: roomId,
	    message: input,
	    name: userData.user.displayName,
	    timestamp: new Date().toUTCString(),
	    roomName: userData.user.displayName,
	    pnum: userData.user.pnum,
	    user: room.pnum,
	    imageUrl: userData.user.imageUrl
	});
	
	setInput('');
	}
    }

  useEffect(() => {
    axios.get('/messages/sync',{
	    params: {
		roomId: roomId
	    }
	})
	.then(response => {
	  setMessages(response.data)
    })
    setArr(messages.filter((message) => {
	return message.name == room.name
    }))

  }, [roomId,messages]);

  useEffect(() => {

    const channel = pusher.subscribe('messages');
    channel.bind('inserted', (newMessage) => {
      setMessages([...messages, newMessage])
    });

    return () => {
	channel.unbind();
	channel.unsubscribe("messages");
    };

  }, [messages]);

    return (
	<div className="chat">
	    <div className="chat_header">
		<Avatar src={room?.imageUrl} style={{display:room?"block":"none"}}/>
		<div className="chat_headerInfo">
		    <h3>{room.name}</h3>
		    <p>{arr[arr.length-1]?"Last seen at "+arr[arr.length-1].timestamp:""}</p>
		</div>
		<div className="chat_headerRight">
		    <IconButton>
			<SearchOutlined />
		    </IconButton>
		    <IconButton>
			<AttachFile />
		    </IconButton>
		    <IconButton>
			<MoreVert />
		    </IconButton>
		</div>
	    </div>

	    <div className="chat_body">
		{messages.map((message) => (
		    <p className={`chat_message ${message.name !== userData.user.displayName && "chat_receiver"}`}>
		        <span className="chat_name">{message.name}</span>
		        {message.message}
		        <span className="chat_timestamp">
			    {message.timestamp}
		        </span>	
		</p>
		))}
	    </div>
	    <div className="chat_footer">
		<InsertEmoticonIcon />
		<form>
		    <input value={input}
			onChange={e => setInput(e.target.value)}
			placeholder="Type a message"
			type="text"
		    />
		    <button onClick={sendMessage}
			type="submit">
			Send a message
		    </button>
		</form>
		<MicIcon />
	    </div>
	</div>
    )

}

export default Chat
