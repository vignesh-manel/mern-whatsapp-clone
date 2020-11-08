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

  useEffect(() => {
    axios.get('/rooms/sync')
	.then(response => {
	  setRooms(response.data)
    })
  }, []);

  useEffect(() => {
    const pusher = new Pusher('5', {
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

    return (
	<div className="sidebar">
	    <div className="sidebar_header">
		<Avatar src="https://avatars2.githubusercontent.com/u/23293306?s=400&u=f300e342a9811de4ffab06416f6d706ddd4c9180&v=4"/>
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
		    <SidebarChat name={room.name} />
		))}
	    </div>

	</div>
    )

}

export default Sidebar
