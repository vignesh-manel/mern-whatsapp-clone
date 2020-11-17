import React, { useEffect, useState, useContext } from "react";
import './App.css';
import Sidebar from "./components/Sidebar";
import Chat from "./components/Chat";
import Login from "./components/Login";
import Signup from "./components/Signup";
import {UserContext} from './context/UserContext';
import Pusher from "pusher-js";
import axios from './axios';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";


function App() {
  const [messages, setMessages] = useState([]);
  const { userData } = useContext(UserContext);

  useEffect(() => {
    axios.get('/messages/sync')
	.then(response => {
	  setMessages(response.data)
    })
  }, []);

  useEffect(() => {
    const pusher = new Pusher(process.env.REACT_APP_pusherKey, {
      cluster: 'ap2'
    });

    const channel = pusher.subscribe('messages');
    channel.bind('inserted', (newMessage) => {
      setMessages([...messages, newMessage])
    });

    return () => {
	channel.unbind();
	channel.unsubscribe("messages");
    };

  }, [messages]);

  console.log(messages);

  return (
    <div className="app">
		      <Router>
	{!userData.user ? (
	    <div>
	    <Route exact path="/"><Login /></Route>
	    <Route path="/signup"><Signup /></Route>
	    </div>
	): (
	    <div className="app_body">
		  <Switch>
		      <Route path="/rooms/:roomId">
			  <Sidebar />
			  <Chat messages={messages}/>
		      </Route>
		      <Route path="/">
			  <Sidebar />
			  <Chat messages={messages}/>
		      </Route>
		  </Switch>

	  </div>   
	)}
	     </Router>
    </div>
  );
}

export default App;
