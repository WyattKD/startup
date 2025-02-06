import React from 'react';
import './room_settings.css';

export function Room_Settings() {
  return (
    <main>
      <div className="settings-box">
      <h1 className="settings-h1">Room Number: 45</h1>
      <h2 className="settings-h2">Players - 2/2</h2>
      <form method="get" action="hangman.html" className="settings-form">
        <div className="form-check">
          <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1"></input>
          <label className="form-check-label">
            Guesser: Robert
          </label>
        </div>
        <div className="form-check">
          <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2"></input>
          <label className="form-check-label">
            Word-giver: Dylan
          </label>
        </div>
        <div className="form-check form-switch">
          <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked"></input>
          <label className="form-check-label">Real Words Only</label>
        </div>
        <div className="mb-3">
          <label className="form-label">Rounds: </label>
          <input type="number" className="form-control settings-input" id="exampleFormControlInput2"></input>
        </div>
        <button type="button" className="btn btn-danger settings-button">Start!</button>
      </form>
      </div>
    </main>
  );
}