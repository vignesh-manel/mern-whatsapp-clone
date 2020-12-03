import React, { useContext } from "react";
import './App.css';
import Sidebar from "./components/Sidebar";
import Chat from "./components/Chat";
import Login from "./components/Login";
import Signup from "./components/Signup";
import {UserContext} from './context/UserContext';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";


function App() {
  const { userData } = useContext(UserContext);

  //Check if user is logged in or not and render routes accordingly
  return (
    <div className="app">
		      <Router>
	{!userData.user ? (
	    <div>
	    <Route exact path={["/","/login"]}><Login /></Route>
	    <Route path="/signup"><Signup /></Route>
	    </div>
	): (
	    <div className="app_body">
		  <Switch>
		      <Route path="/rooms/:roomId">
			  <Sidebar />
			  <Chat />
		      </Route>
		      <Route path="/">
			  <Sidebar />
			  <Chat />
		      </Route>
		  </Switch>

	  </div>   
	)}
	     </Router>
    </div>
  );
}

export default App;
