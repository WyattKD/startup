import React from 'react';
import { useNavigate } from 'react-router-dom';
import './room_settings.css';
import { useSound } from 'use-sound'
import { useWebSocket } from '../WebSocketContext.jsx';

export function Room_Settings({user, set_user}) {
  const navigate = useNavigate();
  const [button_click] = useSound('buttonclick.mp4', { volume: 3 });
  const ws = useWebSocket();
  const [players, setPlayers] = React.useState(0)
  const [current_role, set_current_role] = React.useState("")
  const [current_guesser, set_current_guesser] = React.useState("")
  const [current_word_giver, set_current_word_giver] = React.useState("")
  const [is_checked_1, set_is_checked_1] = React.useState(false)
  const [is_checked_2, set_is_checked_2] = React.useState(false)
  const [is_checked_3, set_is_checked_3] = React.useState(false)
  const [room_is_ready, set_room_is_ready] = React.useState(false)

  async function check_auth() {
    const response = await fetch('/api/auth/verify')
    if (response?.status === 401) {
        return false
    } else {
        return true
    }
  }
  React.useEffect(() => {
    check_auth().then((verified) => {if(!verified){navigate('/')}
    localStorage.setItem("real_words?", "false")
    set_user(localStorage.getItem('currentUser'))
    })
    if (ws) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'get_players',  
          room: localStorage.getItem('currentRoomNumber'),
          player: localStorage.getItem('currentUser')
        }));
      }
      ws.onopen = () => {
        navigate('/')
      };
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('Message from server:', data);

        if (data.type === 'players') {
          setPlayers(data.message);
        }
        if (data.type === 'roles') {
          handle_roles(data.message.guesser, data.message.word_giver)
        }
        if (data.type === 'real_words') {
          change_real_words()
        }
        if (data.type === 'start') {
          navigate('/input_word')
        }
      };
      ws.onclose = () => {
        navigate('/')
      };
    }
  }, [user, ws])

  React.useEffect(() => {
    if (players == 2) {
      set_room_is_ready(true)
    } else {
      set_room_is_ready(false)
      set_is_checked_1(false)
      set_is_checked_2(false)
      set_current_guesser("")
      set_current_word_giver("")
      set_current_role("")
    }
  }, [players])
  
  function change_real_words() {
    if (localStorage.getItem("real_words?") == "true") {
      localStorage.setItem("real_words?", "false")
      set_is_checked_3(false)
    } else {
      localStorage.setItem("real_words?", "true")
      set_is_checked_3(true)
    }
  }

  function handle_button_click(type) {
    button_click()
    if (type == "navigate") {
      localStorage.setItem("guesser", current_guesser)
      localStorage.setItem("word_giver", current_word_giver)
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'start_game',  
          room: localStorage.getItem('currentRoomNumber'),
        }));
      }
    } else if (type == "change_real_words") {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'change_real_words',  
          room: localStorage.getItem('currentRoomNumber'),
        }));
      }
    }
  }

  function handle_roles(new_guesser, new_word_giver) {
    if (new_word_giver == "") {
      set_current_word_giver("")
      set_is_checked_2(false)
    } else {
      set_current_word_giver(new_word_giver)
      set_is_checked_2(true)
    }
    if (new_guesser == "") {
      set_current_guesser("")
      set_is_checked_1(false)
    } else {
      set_current_guesser(new_guesser)
      set_is_checked_1(true)
    }
  }

  function toggle_role(role, user) {
    if (role == "guesser") {
      if (is_checked_1) {
        set_is_checked_1(false)
        set_current_guesser("")
        set_current_role("")
        update_roles("", current_word_giver)
      } else {
        set_is_checked_1(true)
        set_current_guesser(user)
        set_current_role("guesser")
        update_roles(user, current_word_giver)
      }
    } else if (role == "word_giver") {
      if (is_checked_2) {
        set_is_checked_2(false)
        set_current_word_giver("")
        set_current_role("")
        update_roles(current_guesser, "")
      } else {
        set_is_checked_2(true)
        set_current_word_giver(user)
        set_current_role("word_giver")
        update_roles(current_guesser, user)
      }
    }
    console.log("guesser: ", current_guesser)
    console.log("word giver: ", current_word_giver)
  }

  function update_roles(c_g, c_w) {
    if (ws) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'update_roles',  
          room: localStorage.getItem('currentRoomNumber'),
          player: localStorage.getItem('currentUser'),
          guesser: c_g,
          word_giver: c_w
        }));
      }
    }
  }

  return (
    <main>
      <div className="settings-box">
      <h1 className="settings-h1">Room Number: {localStorage.getItem("currentRoomNumber")}</h1>
      <h2 className="settings-h2">Players - {players}/2</h2>
        <div className="form-check">
          <input onChange={() => toggle_role("guesser", localStorage.getItem("currentUser"))} checked={is_checked_1} disabled={(current_role == "word_giver" || (current_guesser != "" && current_guesser != localStorage.getItem("currentUser")) || !room_is_ready)  ? true : false} className="form-check-input" type="checkbox" name="flexRadioDefault" id="flexRadioDefault1"></input>
          <label className="form-check-label">
            Guesser: {current_guesser}
          </label>
        </div>
        <div className="form-check">
          <input onChange={() => toggle_role("word_giver", localStorage.getItem("currentUser"))} checked={is_checked_2} disabled={(current_role == "guesser" || (current_word_giver != "" && current_word_giver != localStorage.getItem("currentUser")) || !room_is_ready)  ? true : false} className="form-check-input" type="checkbox" name="flexRadioDefault" id="flexRadioDefault2"></input>
          <label className="form-check-label">
            Word-giver: {current_word_giver}
          </label>
        </div>
        <div className="form-check form-switch">
          <input onChange={() => handle_button_click("change_real_words")} checked={is_checked_3} disabled={room_is_ready ? false : true} className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked"></input>
          <label className="form-check-label">Real Words Only</label>
        </div>
        <button onClick={() => handle_button_click("navigate")} type="submit" className="btn btn-secondary settings-button" disabled={!room_is_ready || current_guesser == "" || current_word_giver == "" ? true : false}>Start!</button>
      </div>
    </main>
  );
}