import React from "react";
import './Chat.css';
import { Avatar, IconButton } from "@material-ui/core";
import { SearchOutlined, MoreVert, AttachFile } from "@material-ui/icons/";

function Chat() {
    return (
	<div className="chat">
	    <div className="chat_header">
		<Avatar />
		<div className="chat_headerInfo">
		    <h3>Room Name</h3>
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
		<p className="chat_message">
		    <span className="chat_name">Sonny</span>
		    This is a message
		    <span className="chat_timestamp">
			{new Date().toUTCString()}
		    </span>	
		</p>
		<p className="chat_message chat_receiver">
		    <span className="chat_name">Sonny</span>
		    This is a message
		    <span className="chat_timestamp">
			{new Date().toUTCString()}
		    </span>	
		</p>
	    </div>
	</div>
    )

}

export default Chat
