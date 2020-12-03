import React, { useEffect, useState, useContext } from "react";
import { Avatar, Dialog, DialogTitle, DialogContent } from "@material-ui/core";
import {UserContext} from '../context/UserContext';
import axios from '../axios';
import "./RoomDialog.css";
import ErrorMessage from "./ErrorMessage";

function RoomDialog({open, setOpen, createChat, error, setError}) {
  const [users, setUsers] = useState([]);
  const { userData } = useContext(UserContext);

  //Get list of all users registered, apart from logged in user
  useEffect(() => {
    axios.get('/users/getUsers',{
	    params: {
		pnum: userData.user.pnum
	    }
	})
	.then(response => {
	  setUsers(response.data)
    })
  }, [users]);

    return (
	<div>
	    <Dialog className="dialog" open={open} onClose={() => setOpen(false)}>
		<DialogTitle className="dialogTitle">Choose a Contact</DialogTitle>
<div className="dialog_content">
		<DialogContent>
		    {error && <ErrorMessage message={error} clearError={() => setError(undefined)}/>}
		    {users.map(user => (
		    <div className="dialogContent" onClick={() => {createChat(user.pnum, user.displayName,user.imageUrl)}}>
			<Avatar src={user.imageUrl} />
			<div className="dialogContent_info">
			<h4>{user.displayName}</h4>
			<h6>{user.pnum}</h6>
			</div>
		    </div>	
		    ))}
		</DialogContent>
</div>
	    </Dialog>
	</div>
    );

}

export default RoomDialog;
