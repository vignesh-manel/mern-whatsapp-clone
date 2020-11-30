import React, {useState, useEffect, useContext} from "react";
import './Sidebar.css';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { SearchOutlined } from "@material-ui/icons/";
import SidebarChat from "./SidebarChat";
import axios from '../axios';
import { Avatar, IconButton, Menu, MenuItem } from "@material-ui/core";
import {UserContext} from '../context/UserContext';
import pusher from '../Pusher.js';

function Sidebar() {

  const [rooms, setRooms] = useState([]);
  const { userData, setUserData } = useContext(UserContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const MENU_HEIGHT = 24;

  const logout = () => {
	setUserData({
	    token: undefined,
	    user: undefined
	});
  }

  useEffect(() => {
    axios.get('/rooms/sync', {
	    params: {
		pnum: userData.user.pnum
	    }
	})
	.then(response => {
	  setRooms(response.data)
    })
  }, [userData.user.pnum,rooms]);

  useEffect(() => {

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
		<Avatar src={userData.user.imageUrl}/>
		<div className="sidebar_headerRight">
		    <IconButton>
			<DonutLargeIcon />
		    </IconButton>
		    <IconButton>
			<ChatIcon />
		    </IconButton>
		    <div>
		    <IconButton onClick={(event) => setAnchorEl(event.currentTarget)}>
			<MoreVertIcon />
		    </IconButton>
		    <Menu 
        		anchorEl={anchorEl}
        		open={open}
        		onClose={() => setAnchorEl(null)}
        		PaperProps={{
          		    style: {
            			maxHeight: MENU_HEIGHT * 2.4,
            			width: '15ch',
          		    },
        		}}
		    >
			<MenuItem onClick={logout}>Logout</MenuItem>
		    </Menu>
		    </div>
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
		    <SidebarChat key={room._id} id={room._id} name={room.name} imageUrl={room.imageUrl}/>
		))}
	    </div>

	</div>
    )

}

export default Sidebar
