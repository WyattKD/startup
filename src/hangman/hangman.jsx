import React from 'react';
import './hangman.css';

export function Hangman() {
  const [game_data, set_game_data] = React.useState({incorrect_guesses:[], correct_guesses:[], the_hidden_word:'', score_1:0, score_2:0})
  const the_word = localStorage.getItem("theWord")
  const z = React.useMemo(() => {
    for (let i = 0; i < the_word.length; i++) {
      set_game_data({...game_data, the_hidden_word: game_data.the_hidden_word += "_ "})
    }
  }, [])
  console.log(the_word)
  console.log(game_data.the_hidden_word)
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
              <li>(Guesser) {localStorage.getItem("currentUser")}: {game_data.score_1}</li>
              <li>(Word-giver) {localStorage.getItem("currentUser")}: {game_data.score_2}</li>
            </ul>
          </div>
          <div className="col">
            <img alt="Hangman" src="https://imgs.search.brave.com/7KcQL1-YjmKKgd7z5lPRBeaiPFe0ahAc1FBUxJlqr58/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzAzLzE4LzA1LzU4/LzM2MF9GXzMxODA1/NTg5MV9hU09tWjJo/ZUtkN0VPQURWRUtO/clN2bEdCVDNvaWRP/OC5qcGc"></img>
          </div>
          <div className="col">
            <h3 className="incorrect-guess-label">Incorrect Guesses:</h3>
            <p>{game_data.incorrect_guesses}</p>
          </div>
        </div>
        <div className="row">
          <label className="word-label">{game_data.the_hidden_word} </label>
        </div>
        <div className="row">
          <label className="guess-label">Guess: </label>
          <input type="text" className="form-control guess-input" id="exampleFormControlInput1" placeholder="Enter your guess!"></input>
        </div>
      </div>
    </div>
  );
}