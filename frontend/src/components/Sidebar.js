import React, {useState, useEffect} from "react";
import './Sidebar.css';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { SearchOutlined } from "@material-ui/icons/";
import SidebarChat from "./SidebarChat";
import Pusher from "pusher-js";
import axios from '../axios';

import { Avatar, IconButton } from "@material-ui/core"

function Sidebar() {

  const [rooms, setRooms] = useState([]);
  const [seed, setSeed] = useState('')
    
    useEffect(() => {
	setSeed(Math.floor(Math.random() * 5000));
    }, []);

  useEffect(() => {
    axios.get('/rooms/sync')
	.then(response => {
	  setRooms(response.data)
    })
  }, []);

  useEffect(() => {
    const pusher = new Pusher(process.env.REACT_APP_pusherKey, {
      cluster: 'ap2'
    });

    const channel = pusher.subscribe('rooms');
    channel.bind('inserted', (newRoom) => {
      setRooms([...rooms, newRoom])
    });

    return () => {
	channel.unbind();
	channel.unsubscribe("rooms");
    };

  }, [rooms]);

   console.log(rooms);

    return (
	<div className="sidebar">
	    <div className="sidebar_header">
		<Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`}/>
		<div className="sidebar_headerRight">
		    <IconButton>
			<DonutLargeIcon />
		    </IconButton>
		    <IconButton>
			<ChatIcon />
		    </IconButton>
		    <IconButton>
			<MoreVertIcon />
		    </IconButton>
		</div>
	    </div>

	    <div className="sidebar_search">
		<div className="sidebar_searchContainer">
		    <SearchOutlined /> 
		    <input type="text" placeholder="Search or start new chat" />
		</div>
	    </div>

	    <div className="sidebar_chats">
		<SidebarChat addNewChat />		
		{rooms.map(room => (
		    <SidebarChat key={room._id} id={room._id} name={room.name} />
		))}
	    </div>

	</div>
    )

}

export default Sidebar
