import React from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import {useSound} from 'use-sound'
import { useWebSocket } from '../WebSocketContext.jsx';

export function Login({user, set_info_message}) {
  const [login_form, set_login_form] = React.useState({username:'', password:'', roomNumber:''})
  const [error_message, set_error_message] = React.useState("Enter the same room number as your friend!")
  const [button_click] = useSound('buttonclick.mp4', { volume: 3 });
  const [invalid_sfx] = useSound('invalid.mp4', { volume: 3 });
  const navigate = useNavigate();
  const [logged_in, set_logged_in] = React.useState(false)
  const ws = useWebSocket();
  React.useEffect(() => {

    localStorage.setItem("guesser", "")
    localStorage.setItem("word_giver", "")
    localStorage.setItem("the_word", "")
    set_error_message("Enter the same room number as your friend!")
    if (ws) {
      const leave_info = JSON.stringify({
        type: 'leave_room',
      });
      try {
        console.log(localStorage.getItem('currentUser'))
        ws.send(leave_info);
        ws.send(JSON.stringify({
          type: 'get_players',  
          room: localStorage.getItem('currentRoomNumber'),
          player: localStorage.getItem('currentUser'),
        }));
        if (localStorage.getItem('currentRoomNumber')) {
          ws.send(JSON.stringify({
            type: 'leave_room',  
            room: localStorage.getItem('currentRoomNumber'),
          }));
        }
    } catch (error) {
      set_error_message("Error: Connection failed, try refreshing the page.")
    }
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'join_succeeded') {
        set_info_message(`${localStorage.getItem("currentUser")} has joined the room!`)
        navigate('/room_settings')
      } else if (data.type === 'join_failed') {
        set_error_message("Room is full!")
      }
    };
    }
    
  }, [user, ws])
  async function check_auth() {
    const response = await fetch('/api/auth/verify')
    if (response?.status === 401) {
        return false
    } else if (response?.status === 500) {
      set_error_message("Error: Connection failed, try refreshing the page.")
    } else {
        return true
    }
  }
  React.useEffect(() => {
    check_auth().then((verified) => {set_logged_in(verified)})
    if (ws) {
      ws.onopen = () => {
        set_error_message("Enter the same room number as your friend!")
      }
    }
    try {
      ws.send(JSON.stringify({
        type: 'test', 
      }));
    } catch (error) {
      set_error_message("Error: Connection failed, try refreshing the page.")
    }

  }, [ws, user]);
  React.useEffect(() => {
    if (logged_in) {
      set_info_message("Join a room to get started!")
    } else {
      set_info_message("Login or sign up to get started!")
    }
  }, [logged_in]);
  async function login() {
    if (logged_in && login_form.roomNumber != "") {
      localStorage.setItem("currentRoomNumber", login_form.roomNumber)
      join_room(login_form.roomNumber, localStorage.getItem("currentUser"))
    } else if (login_form.username == "" || login_form.password == "" || login_form.roomNumber == "") {
      set_error_message("Error: Please fill out all fields!")
      invalid_sfx()
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
        join_room(login_form.roomNumber, login_form.username)
      } else if (response?.status === 401) {
        set_error_message("Error: Incorrect password or unrecognized user.")
        invalid_sfx()
      } else {
        set_error_message("Error: Login failed.")
        invalid_sfx()
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
        join_room(login_form.roomNumber, login_form.username)
      } else if(response?.status === 409) {
        set_error_message("Error: User already exists.")
      } else {
        set_error_message("Error: Sign up failed.")
      }
    }
  }

  function join_room(room, player) {
    const join_info = JSON.stringify({
        type: 'join',
        room: room,
        player: player,
        guess: "",
        word_giver: "",
    });
    ws.send(join_info);
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


  return (
    <div className="login">
      <h1 className="login-h1">Hangman</h1>
      <h2 className="login-h2">with a friend!</h2>
        <div className="mb-3">
          <label className="login-label">Username: </label>
          <input maxLength="20" disabled={logged_in ? true : false} autoComplete="off" onKeyDown={e => {if (e.key=="Enter" && error_message != "Error: Connection failed, try refreshing the page.") {login()}}} onChange={e => {set_login_form({...login_form, username: e.target.value})}} type="username" className="login-input form-control" id="exampleFormControlInput1" placeholder={logged_in ? "You are logged in!" : "Enter your username"} ></input>
        </div>
          <label className="login-label">Password: </label>
          <input disabled={logged_in ? true : false} autoComplete="off" onKeyDown={e => {if (e.key=="Enter" && error_message != "Error: Connection failed, try refreshing the page.") {login()}}} onChange={e => {set_login_form({...login_form, password: e.target.value})}} type="password" id="inputPassword5" className="login-input form-control" placeholder={logged_in ? "You are logged in!" : "Enter your password"}></input>
        <div className="mb-3">
          <label className="login-label">Room Number: </label>
          <input maxLength="10" autoComplete="off" onKeyDown={e => {if (e.key=="Enter" && error_message != "Error: Connection failed, try refreshing the page.") {login()}}} onChange={e => {set_login_form({...login_form, roomNumber: e.target.value})}} type="number" className="login-input form-control" id="exampleFormControlInput2" placeholder="Enter your room number"></input>
        </div>
        <div className="form-text" id="basic-addon4">{error_message}</div>
        <button disabled={error_message == "Error: Connection failed, try refreshing the page." ? true : false} onClick={() => handle_button_click("login")} type="login" className="btn btn-secondary login-button">{logged_in ? "Go!" : "Login"}</button>
        {!logged_in && <button disabled={error_message == "Error: Connection failed, try refreshing the page." ? true : false} onClick={() => handle_button_click("sign_up")} type="signup" className="btn btn-secondary signup-button">Sign Up</button>}
        <img alt="Hangman-dance" className="gif-right" src={"stickman-dance.gif"}></img>
        <img alt="Hangman-dance" className="gif-left" src={"stickman-dance.gif"}></img>
    </div>
  );
}