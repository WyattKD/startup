import React from 'react';
import { useNavigate } from 'react-router-dom';
import './room_settings.css';
import { useSound } from 'use-sound'
import { useWebSocket } from '../WebSocketContext.jsx';

export function Room_Settings({user, set_user}) {
  const navigate = useNavigate();
  const [button_click] = useSound('buttonclick.mp4', { volume: 3 });
  const ws = useWebSocket();
  const [players, setPlayers] = React.useState(0);

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
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('Message from server:', data);

        if (data.type === 'players') {
          setPlayers(data.message);
        }
      };
      ws.onclose = () => {
        navigate('/')
      };
    }
  }, [user, ws])
  
  function change_real_words() {
    if (localStorage.getItem("real_words?") == "true") {
      localStorage.setItem("real_words?", "false")
    } else {
      localStorage.setItem("real_words?", "true")
    }
  }

  function handle_button_click(type) {
    button_click()
    if (type == "navigate") {
      navigate('/input_word')
    } else if (type == "change_real_words") {
      change_real_words()
    }
  }

  return (
    <main>
      <div className="settings-box">
      <h1 className="settings-h1">Room Number: {localStorage.getItem("currentRoomNumber")}</h1>
      <h2 className="settings-h2">Players - {players}/2</h2>
        <div className="form-check">
          <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1"></input>
          <label className="form-check-label">
            Guesser: {localStorage.getItem("currentUser")}
          </label>
        </div>
        <div className="form-check">
          <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2"></input>
          <label className="form-check-label">
            Word-giver: {localStorage.getItem("currentUser")}
          </label>
        </div>
        <div className="form-check form-switch">
          <input onClick={() => handle_button_click("change_real_words")} className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked"></input>
          <label className="form-check-label">Real Words Only</label>
        </div>
        <button onClick={() => handle_button_click("navigate")} type="submit" className="btn btn-danger settings-button">Start!</button>
      </div>
    </main>
  );
}