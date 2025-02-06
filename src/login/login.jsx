import React from 'react';
import './login.css';

export function Login() {
  return (
    <div className="login">
      <h1 className="login-h1">Hangman</h1>
      <h2 className="login-h2">with a friend!</h2>
      <form method="get" action="room_settings.html" className="login-form">
        <div className="mb-3">
          <label className="login-label">Username: </label>
          <input type="username" className="login-input form-control" id="exampleFormControlInput1" placeholder="Enter your username"></input>
        </div>
        <label className="login-label">Password: </label>
        <input type="password" id="inputPassword5" className="login-input form-control" placeholder="Enter your password"></input>
        <div className="mb-3">
          <label className="login-label">Room Number: </label>
          <input type="number" className="login-input form-control" id="exampleFormControlInput2" placeholder="Enter the room number"></input>
        </div>
        <div className="form-text" id="basic-addon4">Enter the same room number as your friend!</div>
        <button type="submit" className="btn btn-primary login-button">Submit</button>
      </form>
    </div>
  );
}