import React, { useState } from "react";
import "./Signup.css";
import axios from '../axios';
import ErrorMessage from "./ErrorMessage";
import { Link } from "react-router-dom";

function Signup() {
    const [pnum, setPnum] = useState('');
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [error, setError] = useState('');

    const signup = async (e) => {

	e.preventDefault();
	try {

		const resUser = await axios.post('/users/register', {
		    pnum: pnum,
		    password: password,
		    passwordCheck: passwordCheck,
		    displayName: displayName
		});

	}
	catch (err) {
	    err.response.data.msg && setError(err.response.data.msg)
	}

    }

    return (
	<div className="signup">
	    <div className="signup_container">
		<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/800px-WhatsApp.svg.png" alt=""/>
		<div className="signup_text">
		    <h1>Register to WhatsApp</h1>
		</div>
		{error && <ErrorMessage message={error} clearError={() => setError(undefined)} />}
		<div className="signup_form">
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
		        <input 
			    placeholder="Re-enter your password"
			    type="password"
			    onChange={(e) => setPasswordCheck(e.target.value)}
		        />
		        <input 
			    placeholder="Enter a display name"
			    type="text"
			    onChange={(e) => setDisplayName(e.target.value)}
		        />
		        <button onClick={signup}
			    type="submit">
			    Sign Up
		        </button>
			<h6>Already Registered? <Link to="/">Login</Link></h6>
		   </form>
		</div>
	    </div>
	</div>
    )
}

export default Signup
