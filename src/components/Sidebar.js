import React from "react";
import './Sidebar.css';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { SearchOutlined } from "@material-ui/icons/";

import { Avatar, IconButton } from "@material-ui/core"

function Sidebar() {
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
	</div>
    )

}

export default Sidebar
