import React from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

export function Login() {
  const [loginForm, setLoginForm] = React.useState({username:'', password:'', roomNumber:''})
  const [typeOfLogin, setTypeOfLogin] = React.useState('invalid')
  const [bad_entry, set_bad_entry] = React.useState(false)
  const [error_message, set_error_message] = React.useState("Enter the same room number as your friend!")
  const navigate = useNavigate();

  async function login() {
    if (loginForm.username == "" || loginForm.password == "" || loginForm.roomNumber == "") {
      set_error_message("Error: Please fill out all fields!")
    } else {
      const response = await fetch(`/api/auth/login`, {
        method: 'post',
        body: JSON.stringify({ user_name: loginForm.username, password: loginForm.password }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      if (response?.status === 200) {
        localStorage.setItem("currentUser", loginForm.username)
        localStorage.setItem("currentRoomNumber", loginForm.roomNumber)
        localStorage.setItem("scores", "")
        navigate('/room_settings')
      } else if (response?.status === 401) {
        set_error_message("Error: Incorrect password or unrecognized user.")
      } else {
        set_error_message("Error: Login failed.")
      }
    }
  }

  async function sign_up() {
    if (loginForm.username == "" || loginForm.password == "" || loginForm.roomNumber == "") {
      set_error_message("Error: Please fill out all fields!")
    } else {
      const response = await fetch(`/api/auth/sign_up`, {
        method: 'post',
        body: JSON.stringify({ user_name: loginForm.username, password: loginForm.password }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      if (response?.status === 200) {
        //localStorage.setItem(loginForm.username, loginForm.password)
        localStorage.setItem("currentUser", loginForm.username)
        localStorage.setItem("currentRoomNumber", loginForm.roomNumber)
        localStorage.setItem("scores", "")
        navigate('/room_settings')
      } else if(response?.status === 409) {
        set_error_message("Error: User already exists.")
      } else {
        set_error_message("Error: Sign up failed.")
      }
    }
  }
  
  return (
    <div className="login">
      <h1 className="login-h1">Hangman</h1>
      <h2 className="login-h2">with a friend!</h2>
        <div className="mb-3">
          <label className="login-label">Username: </label>
          <input autoComplete="off" onKeyDown={e => {if (e.key=="Enter") {login()}}} onChange={e => {setLoginForm({...loginForm, username: e.target.value})}} type="username" className="login-input form-control" id="exampleFormControlInput1" placeholder={bad_entry ? "Please fill out all fields!" : "Enter your username"} ></input>
        </div>
          <label className="login-label">Password: </label>
          <input autoComplete="off" onKeyDown={e => {if (e.key=="Enter") {login()}}} onChange={e => {setLoginForm({...loginForm, password: e.target.value})}} type="password" id="inputPassword5" className="login-input form-control" placeholder={bad_entry ? "Please fill out all fields!" : "Enter your password"}></input>
        <div className="mb-3">
          <label className="login-label">Room Number: </label>
          <input autoComplete="off" onKeyDown={e => {if (e.key=="Enter") {login()}}} onChange={e => {setLoginForm({...loginForm, roomNumber: e.target.value})}} type="number" className="login-input form-control" id="exampleFormControlInput2" placeholder={bad_entry ? "Please fill out all fields!" : "Enter your room number"}></input>
        </div>
        <div className="form-text" id="basic-addon4">{error_message}</div>
        <button onClick={() => login()} type="login" className="btn btn-primary login-button">Login</button>
        <button onClick={() => sign_up()} type="signup" className="btn btn-primary signup-button">Sign Up</button>
    </div>
  );
}