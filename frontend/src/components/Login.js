import React from "react";
import "./Login.css";

function Login() {
    return (
	<div className="login">
	    <div className="login_container">
		<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/800px-WhatsApp.svg.png" alt=""/>
		<div className="login_text">
		    <h1>Sign in to WhatsApp</h1>
		</div>
		<div className="login_form">
		    <form>
		        <input
			    placeholder="Enter your phone number"
			    type="text"
		        />
		        <input
			    placeholder="Enter your password"
			    type="password"
		        />
		        <button onClick=""
			    type="submit">
			    Login
		        </button>
			<h6>Not Registered? <a href="#">Sign up</a></h6>
		   </form>
		</div>
	    </div>
	</div>
    )
}

export default Login
