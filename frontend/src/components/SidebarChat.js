import React, { useState, useEffect, useContext } from "react";
import "./SidebarChat.css";
import { Avatar } from "@material-ui/core";
import axios from '../axios';
import { Link } from "react-router-dom";
import {UserContext} from '../context/UserContext';
import pusher from '../Pusher.js';
import RoomDialog from "./RoomDialog";

function SidebarChat({ addNewChat, id, name, imageUrl }) {
    const [seed, setSeed] = useState('');
    const { userData } = useContext(UserContext);
    const [messages, setMessages] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [error, setError] = useState('');
    
    useEffect(() => {
	setSeed(Math.floor(Math.random() * 5000));
    }, []);

  useEffect(() => {

    axios.get('/messages/sync',{
	    params: {
		roomId: id
	    }
	})
	.then(response => {
	  setMessages(response.data)
    });

    const channel = pusher.subscribe('messages');
    channel.bind('inserted', (newMessage) => {
      setMessages([...messages, newMessage])
    });

    return () => {
	channel.unbind();
	channel.unsubscribe("messages");
    };

  }, [messages,id]);

    const createChat = async (pnum, displayName, imageUrl) => {
	try {
	    await axios.post('rooms/new', {
		pnum: pnum,
		name: displayName,
		user: userData.user.pnum,
		imageUrl: imageUrl
	    });	
	setOpenDialog(false);
	}
	catch(err) {
	    err.response.data.msg && setError(err.response.data.msg)
	}    
    };

    return !addNewChat ? (
	<Link className="linkClass" to={`/rooms/${id}`}>
	<div className="sidebarChat">
		<Avatar src={imageUrl} />
		<div className="sidebarChat_info">
		    <h2>{name}</h2>
		    <p>{messages[messages.length-1]?.message}</p>
		</div>
	   </div>
	</Link>
): (
		<div onClick={() => setOpenDialog(true)} className="sidebarChat">
		    <h2>Add new Chat</h2>
		    <RoomDialog open={openDialog} setOpen={setOpenDialog} createChat={(pnum, displayName, imageUrl) => createChat(pnum, displayName, imageUrl)} error={error} setError={setError}/>
		</div>
	    );
}

export default SidebarChat;
