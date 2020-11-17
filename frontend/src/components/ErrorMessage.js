import React from "react";
import "./ErrorMessage.css";

export default function ErrorMessage(props) {
    return (
	<div className="error_message">
	    <span>{props.message}</span>
	    <button onClick={props.clearError}>X</button>
	</div>
    )
} 
