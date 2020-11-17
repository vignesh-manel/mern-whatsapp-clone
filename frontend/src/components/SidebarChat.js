import React, { useState, useEffect } from "react";
import "./SidebarChat.css";
import { Avatar } from "@material-ui/core";
import axios from '../axios';
import { Link } from "react-router-dom";

function SidebarChat({ addNewChat, id, name }) {
    const [seed, setSeed] = useState('')
    
    useEffect(() => {
	setSeed(Math.floor(Math.random() * 5000));
    }, []);

    const createChat = () => {
	const roomName = prompt("Please enter name for chat room");

	if (roomName) {
	    axios.post('rooms/new', {
	    name: roomName
	});	    
	}
    };

    return !addNewChat ? (
	<Link to={`/rooms/${id}`}>
	<div className="sidebarChat">
		<Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
		<div className="sidebarChat_info">
		    <h2>{name}</h2>
		    <p>This is the last message</p>
		</div>
	   </div>
	</Link>
): (
		<div onClick={createChat} className="sidebarChat">
		    <h2>Add new Chat</h2>
		</div>
	    );
}

export default SidebarChat;
