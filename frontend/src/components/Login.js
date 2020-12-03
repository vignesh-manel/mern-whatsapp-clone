import React, { useState, useContext } from "react";
import "./Login.css";
import axios from '../axios';
import {UserContext} from "../context/UserContext";
import ErrorMessage from "./ErrorMessage";
import { Link } from "react-router-dom";

function Login() {
    const [pnum, setPnum] = useState('');
    const [password, setPassword] = useState('');
    const { setUserData } = useContext(UserContext);
    const [error, setError] = useState('');

    //log in the user and set user data in context
    const login = async (e) => {

	e.preventDefault();
	try {

		const resUser = await axios.post('/users/login', {
		    pnum: pnum,
		    password: password
		});
		setUserData({
		    token: resUser.data.token,
		    user: resUser.data.user
		});
	}
	catch (err) {
	    err.response.data.msg && setError(err.response.data.msg)
	}

    }

    return (
	<div className="login">
	    <div className="login_container">
		<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/800px-WhatsApp.svg.png" alt=""/>
		<div className="login_text">
		    <h1>Sign in to WhatsApp</h1>
		</div>
		{error && <ErrorMessage message={error} clearError={() => setError(undefined)} />}
		<div className="login_form">
		    <form>
		        <input
			    placeholder="Enter your phone number"
			    type="text"
			    onChange={(e) => setPnum(e.target.value)}
		        />
		        <input 
			    placeholder="Enter your password"
			    type="password"
			    onChange={(e) => setPassword(e.target.value)}
		        />
		        <button onClick={login}
			    type="submit">
			    Login
		        </button>
			<h6>Not Registered? <Link to="/signup">Sign up</Link></h6>
		   </form>
		</div>
	    </div>
	</div>
    )
}

export default Login
