import React, { useState, useEffect } from "react";
import "./Signup.css";
import axios from '../axios';
import ErrorMessage from "./ErrorMessage";
import { Link, useHistory } from "react-router-dom";

function Signup() {
    const [pnum, setPnum] = useState('');
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [gender, setGender] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [seed, setSeed] = useState('');
    const history = useHistory();

    const sleep = (ms) => {
	return new Promise(resolve => setTimeout(resolve, ms));
    }

    useEffect(() => {
	setSeed(Math.floor(Math.random() * 5000));
    }, []);

    const signup = async (e) => {

	e.preventDefault();
	try {
		await axios.post('/users/register', {
		    pnum: pnum,
		    password: password,
		    passwordCheck: passwordCheck,
		    displayName: displayName,
		    imageUrl: `https://avatars.dicebear.com/api/${gender}/${seed}.svg`,
		    gender: gender
		});
		setSuccess(true);
		await sleep(2000);
		history.push("/");

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

		{success && <div className="successMessage">
		    <span>Successfully Registered</span>
		</div>
		}


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
			<div className="radio" onChange={(e) => setGender(e.target.value)}>
			<input type="radio" id="male" name="gender" value="male"/>
			    <label for="male">Male</label>
			<input type="radio" id="female" name="gender" value="female"/>
			<label for="female">Female</label>
			</div>
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
