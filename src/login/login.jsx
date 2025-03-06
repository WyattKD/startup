import React from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

export function Login() {
  const [loginForm, setLoginForm] = React.useState({username:'', password:'', roomNumber:''})
  const [typeOfLogin, setTypeOfLogin] = React.useState('invalid')
  const [bad_entry, set_bad_entry] = React.useState(false)
  const [error_message, set_error_message] = React.useState("Enter the same room number as your friend!")
  const navigate = useNavigate();

  function handle_login(loginStatus) {
    if (loginStatus == "newLogin") {
      set_error_message("Error: Users doesn't exist, please sign up!")
    } else if (loginStatus == "correctLogin") {
      localStorage.setItem("currentUser", loginForm.username)
      localStorage.setItem("currentRoomNumber", loginForm.roomNumber)
      localStorage.setItem("scores", "")
      navigate('/room_settings')
    } else if (loginStatus == "incorrectLogin") {
      set_error_message("Error: Incorrect password.")
    } else {
      set_bad_entry(true)
    }
  }

  function handle_signup(loginStatus) {
    if (loginStatus == "newLogin") {
      localStorage.setItem(loginForm.username, loginForm.password)
      localStorage.setItem("currentUser", loginForm.username)
      localStorage.setItem("currentRoomNumber", loginForm.roomNumber)
      localStorage.setItem("scores", [])
      navigate('/room_settings')
    } else if (loginStatus == "correctLogin") {
      set_error_message("Error: User already exists!")
    } else if (loginStatus == "incorrectLogin") {
      set_error_message("Error: User already exists!")
    } else {
      set_bad_entry(true)
    }
  }

  if (loginForm.username != '' && loginForm.password != '' && loginForm.roomNumber != '' && loginForm.username != 'currentUser' && loginForm.username != "currentRoomNumber" && loginForm.username != "theWord" && loginForm.username != "scores") {
    if (localStorage.getItem(loginForm.username) != null && localStorage.getItem(loginForm.username) == loginForm.password) {
      if (typeOfLogin != "correctLogin") {setTypeOfLogin("correctLogin")}
    } else if (localStorage.getItem(loginForm.username) != null) {
      if (typeOfLogin != "incorrectLogin") {setTypeOfLogin("incorrectLogin")}
    } else {
      if (typeOfLogin != "newLogin") {setTypeOfLogin("newLogin")}
    }
  } else {
    if (typeOfLogin != "invalid") {setTypeOfLogin("invalid")}
  }
  
  return (
    <div className="login">
      <h1 className="login-h1">Hangman</h1>
      <h2 className="login-h2">with a friend!</h2>
        <div className="mb-3">
          <label className="login-label">Username: </label>
          <input autoComplete="off" onKeyDown={e => {if (e.key=="Enter") {handleSubmit(typeOfLogin)}}} onChange={e => {setLoginForm({...loginForm, username: e.target.value})}} type="username" className="login-input form-control" id="exampleFormControlInput1" placeholder={bad_entry ? "Please fill out all fields!" : "Enter your username"} ></input>
        </div>
          <label className="login-label">Password: </label>
          <input autoComplete="off" onKeyDown={e => {if (e.key=="Enter") {handleSubmit(typeOfLogin)}}} onChange={e => {setLoginForm({...loginForm, password: e.target.value})}} type="password" id="inputPassword5" className="login-input form-control" placeholder={bad_entry ? "Please fill out all fields!" : "Enter your password"}></input>
        <div className="mb-3">
          <label className="login-label">Room Number: </label>
          <input autoComplete="off" onKeyDown={e => {if (e.key=="Enter") {handleSubmit(typeOfLogin)}}} onChange={e => {setLoginForm({...loginForm, roomNumber: e.target.value})}} type="number" className="login-input form-control" id="exampleFormControlInput2" placeholder={bad_entry ? "Please fill out all fields!" : "Enter your room number"}></input>
        </div>
        <div className="form-text" id="basic-addon4">{error_message}</div>
        <button onClick={() => handle_login(typeOfLogin)} type="login" className="btn btn-primary login-button">Login</button>
        <button onClick={() => handle_signup(typeOfLogin)} type="signup" className="btn btn-primary signup-button">Sign Up</button>
    </div>
  );
}