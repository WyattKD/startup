import React from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import {useSound} from 'use-sound'

export function Login() {
  const [login_form, set_login_form] = React.useState({username:'', password:'', roomNumber:''})
  const [error_message, set_error_message] = React.useState("Enter the same room number as your friend!")
  const [button_click] = useSound('buttonclick.mp4', { volume: 3 });
  const navigate = useNavigate();

  async function login() {
    if (login_form.username == "" || login_form.password == "" || login_form.roomNumber == "") {
      set_error_message("Error: Please fill out all fields!")
    } else {
      const response = await fetch(`/api/auth/login`, {
        method: 'post',
        body: JSON.stringify({ username: login_form.username, password: login_form.password }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      if (response?.status === 200) {
        localStorage.setItem("currentUser", login_form.username)
        localStorage.setItem("currentRoomNumber", login_form.roomNumber)
        localStorage.setItem("scores", "")
        join_room(login_form.roomNumber, login_form.username)
        navigate('/room_settings')
      } else if (response?.status === 401) {
        set_error_message("Error: Incorrect password or unrecognized user.")
      } else {
        set_error_message("Error: Login failed.")
      }
    }
  }

  async function sign_up() {
    if (login_form.username == "" || login_form.password == "" || login_form.roomNumber == "") {
      set_error_message("Error: Please fill out all fields!")
    } else {
      const response = await fetch(`/api/auth/sign_up`, {
        method: 'post',
        body: JSON.stringify({ username: login_form.username, password: login_form.password }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      if (response?.status === 200) {
        localStorage.setItem("currentUser", login_form.username)
        localStorage.setItem("currentRoomNumber", login_form.roomNumber)
        localStorage.setItem("scores", "")
        join_room(login_form.roomNumber, login_form.username)
        navigate('/room_settings')
      } else if(response?.status === 409) {
        set_error_message("Error: User already exists.")
      } else {
        set_error_message("Error: Sign up failed.")
      }
    }
  }

  function handle_button_click(type) {
    if (type == "login") {
      button_click()
      login()
    } else if (type == "sign_up") {
      button_click()
      sign_up()
    }
  }


  let port = window.location.port;
  const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
  const socket = new WebSocket(`${protocol}://${window.location.hostname}:${port}/ws`);

  // Event listener for when the connection is open
  socket.addEventListener('open', (event) => {
      console.log('Connected to WebSocket server');
  });

  // Event listener for receiving messages from the server
  socket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      console.log('Message from server:', data);
  });


  function join_room(room, player) {
    const join_info = JSON.stringify({
        type: 'join',
        room: room,
        player: player,
    });
    socket.send(join_info);
  }
  
  return (
    <div className="login">
      <h1 className="login-h1">Hangman</h1>
      <h2 className="login-h2">with a friend!</h2>
        <div className="mb-3">
          <label className="login-label">Username: </label>
          <input autoComplete="off" onKeyDown={e => {if (e.key=="Enter") {login()}}} onChange={e => {set_login_form({...login_form, username: e.target.value})}} type="username" className="login-input form-control" id="exampleFormControlInput1" placeholder="Enter your username" ></input>
        </div>
          <label className="login-label">Password: </label>
          <input autoComplete="off" onKeyDown={e => {if (e.key=="Enter") {login()}}} onChange={e => {set_login_form({...login_form, password: e.target.value})}} type="password" id="inputPassword5" className="login-input form-control" placeholder="Enter your password"></input>
        <div className="mb-3">
          <label className="login-label">Room Number: </label>
          <input autoComplete="off" onKeyDown={e => {if (e.key=="Enter") {login()}}} onChange={e => {set_login_form({...login_form, roomNumber: e.target.value})}} type="number" className="login-input form-control" id="exampleFormControlInput2" placeholder="Enter your room number"></input>
        </div>
        <div className="form-text" id="basic-addon4">{error_message}</div>
        <button onClick={() => handle_button_click("login")} type="login" className="btn btn-primary login-button">Login</button>
        <button onClick={() => handle_button_click("sign_up")} type="signup" className="btn btn-primary signup-button">Sign Up</button>
        <img alt="Hangman-dance" className="gif-right" src={"stickman-dance.gif"}></img>
        <img alt="Hangman-dance" className="gif-left" src={"stickman-dance.gif"}></img>
    </div>
  );
}