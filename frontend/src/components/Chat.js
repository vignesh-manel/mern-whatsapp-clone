import React, { useState, useEffect, useContext } from "react";
import './Chat.css';
import { Avatar, IconButton } from "@material-ui/core";
import { SearchOutlined, MoreVert, AttachFile } from "@material-ui/icons/";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";
import axios from "../axios";
import { useParams } from "react-router-dom";
import {UserContext} from "../context/UserContext"

function Chat({messages}) {
    const [input, setInput] = useState("");
    const [seed, setSeed] = useState('');
    const { roomId } = useParams();
    const [roomName, setRoomName] = useState('');
const { userData } = useContext(UserContext);

    useEffect(() => {
	if (roomId) {
	 axios.get('/rooms/getRoom', {
	    params: {
		roomId: roomId
	    }
	})
	.then(response => {
	  setRoomName(response.data.name)
    })
	}
    }, [roomId]);
    
    useEffect(() => {
	setSeed(Math.floor(Math.random() * 5000));
    }, [roomId]);

    const sendMessage = async (e) => {
	e.preventDefault();

	await axios.post('messages/new', {
	    message: input,
	    name: userData.user.displayName,
	    timestamp: new Date().toUTCString(),
	    received: false
	});
	
	setInput('');
    }

    return (
	<div className="chat">
	    <div className="chat_header">
		<Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
		<div className="chat_headerInfo">
		    <h3>{roomName}</h3>
		    <p>Last seen at...</p>
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
		    <p className={`chat_message ${message.received && "chat_receiver"}`}>
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
