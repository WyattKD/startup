import React from 'react';
import { useNavigate } from 'react-router-dom';
import './room_settings.css';

export function Room_Settings() {
  const navigate = useNavigate();

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
  })
  }, [])

  return (
    <main>
      <div className="settings-box">
      <h1 className="settings-h1">Room Number: {localStorage.getItem("currentRoomNumber")}</h1>
      <h2 className="settings-h2">Players - 2/2</h2>
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
          <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked"></input>
          <label className="form-check-label">Real Words Only</label>
        </div>
        <button onClick={() => navigate('/input_word')} type="submit" className="btn btn-danger settings-button">Start!</button>
      </div>
    </main>
  );
}