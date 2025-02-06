import React from 'react';
import './hangman.css';

export function Hangman() {
  return (
    <div className="hangman">
      <div className="container text-center">
        <div className="row">
          <h1 className="hangman-h1">Hangman</h1>
        </div>
        <div className="row">
          <div className="col">
            <h3 className="players-label">Players:</h3>
            <ul>
              <li>(Guesser) Robert: 1500</li>
              <li>(Word-giver) Dylan: 300</li>
            </ul>
          </div>
          <div className="col">
            <img alt="Hangman" src="https://imgs.search.brave.com/7KcQL1-YjmKKgd7z5lPRBeaiPFe0ahAc1FBUxJlqr58/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzAzLzE4LzA1LzU4/LzM2MF9GXzMxODA1/NTg5MV9hU09tWjJo/ZUtkN0VPQURWRUtO/clN2bEdCVDNvaWRP/OC5qcGc"></img>
          </div>
          <div className="col">
            <h3 className="incorrect-guess-label">Incorrect Guesses:</h3>
            <p>A, S, Q, L, R</p>
          </div>
        </div>
        <div className="row">
          <label className="word-label">_ E E _ _ </label>
        </div>
        <div className="row">
          <label className="guess-label">Guess: </label>
          <input type="text" className="form-control guess-input" id="exampleFormControlInput1" placeholder="Enter your guess!"></input>
        </div>
      </div>
    </div>
  );
}