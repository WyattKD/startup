import React from 'react';
import { useNavigate } from 'react-router-dom';
import './hangman.css';
import { useSound } from 'use-sound';

export function Hangman({user}) {
  const [game_data, set_game_data] = React.useState({incorrect_guesses:[], correct_guesses:[], the_hidden_word:'', score_1:0, score_2:0})
  const the_word = localStorage.getItem("the_word").toLocaleLowerCase()
  const [win, set_win] = React.useState(false)
  const [lose, set_lose] = React.useState(false)
  const [button_click] = useSound('buttonclick.mp4', { volume: 3 });

  const [correct_guess_sfx] = useSound('chaching.mp4');
  const [incorrect_guess_sfx] = useSound('ahhdangit.mp4');
  const [win_sfx] = useSound('yippee.mp4');
  const [lose_sfx] = useSound('wawawaaa.mp4');

  const navigate = useNavigate();
  const z = React.useMemo(() => {
    for (let i = 0; i < the_word.length; i++) {
      set_game_data({...game_data, the_hidden_word: game_data.the_hidden_word += "_ "})
    }
    set_game_data({...game_data, the_hidden_word: find_all_letters(" ", 0, game_data.the_hidden_word)})
  }, [])

  React.useEffect(() => {
    if (game_data.the_hidden_word.indexOf("_") == -1) {
      win_sfx()
      set_win(true)
      handle_scores(game_data.score_1, " (Guesser)")
      handle_scores(game_data.score_2, " (Word-giver)")
    } else if (game_data.incorrect_guesses.length >= 9) {
      lose_sfx()
      set_lose(true)
      handle_scores(game_data.score_1, " (Guesser)")
      handle_scores(game_data.score_2, " (Word-giver)")
    }
    
  }, [game_data.the_hidden_word, game_data.incorrect_guesses])

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
  }, [user])

  async function handle_scores(score, role) {
    let user = localStorage.getItem("currentUser") + role
    const new_score = { name: user, score: score};

    await fetch('/api/score', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(new_score),
    });
  }


  function log_guess(guess, correct, new_word) {
    if (correct) {
      if (the_word.length - game_data.correct_guesses.length > 1) {
        correct_guess_sfx()
      }
      set_game_data({...game_data, correct_guesses: game_data.correct_guesses.concat([guess]), score_1: game_data.score_1 + 50, the_hidden_word: new_word})
    } else {
      if (game_data.incorrect_guesses.length < 8) {
        incorrect_guess_sfx()
      }
      set_game_data({...game_data, incorrect_guesses: game_data.incorrect_guesses.concat([guess + ", "]), score_2: game_data.score_2 + 50, the_hidden_word: new_word})
    }
  }

  function guess(event) {
    if (event.key == "Enter" && event.target.value.toLowerCase() != "" && /^[a-zA-Z]+$/.test(event.target.value.toLowerCase())) {
      let letter = event.target.value.toLowerCase()
      if (letter == null || letter == "" || letter == " ") {
        event.target.value = ""
        event.target.placeholder = "Enter your guess!"
      } else if (game_data.incorrect_guesses.includes(letter + ", ") || game_data.correct_guesses.includes(letter)) {
        event.target.value = ""
        event.target.placeholder = "You've already guessed that letter!"
      } else {
        let previous_word = game_data.the_hidden_word
        let new_word = find_all_letters(letter, 0, previous_word)
        if (previous_word == new_word) {
          log_guess(letter, false, new_word)
        } else {
          log_guess(letter, true, new_word)
        }
        event.target.value = ""
        event.target.placeholder = "Enter your guess!"
      }
    }
  }

  function replace_letter(letter, position, word) {
    position *= 2
    let first_half = word.substring(0, position)
    let last_half = word.substring(position + 1)
    word = first_half + letter + last_half
    return word
  }
  
  function find_all_letters(letter, position, word) {
    let new_pos = the_word.indexOf(letter, position)
    if (new_pos == -1) {
      return word
    } else if (new_pos != -1 && position < the_word.length) {
      word = replace_letter(letter, new_pos, word) 
      return find_all_letters(letter, new_pos+1, word)
    }
  }

  function button_navigate(type) {
    button_click()
    if (type == "room_settings") {
      navigate('/room_settings')
    } else if (type == "scores") {
      navigate('/scores')
    }
  }

  return (
    <div className="hangman">
      <div className="container text-center">
        <div className="row">
          <h1 className="hangman-h1">Hangman</h1>
        </div>
        <div style={{display: win ? 'inline-block' : 'none'}} className="alert alert-success hangman-win" role="alert">
          <div className="mb-3">
            <h1 className="hm-h1">You WIN!!! </h1>
            <button onClick={() => button_navigate("room_settings")} type="submit" className="btn btn-success hm-button">Play Again</button>
            <button onClick={() => button_navigate("scores")} type="submit" className="btn btn-success hm-button">High Scores</button>
          </div>
        </div>
        <div style={{display: lose ? 'inline-block' : 'none'}} className="alert alert-danger hangman-lose" role="alert">
        <div className="mb-3">
            <h1 className="hm-h1">You lose! </h1>
            <h2 className="hm-h2">The word was "{the_word}" </h2>
            <button onClick={() => button_navigate("room_settings")} type="submit" className="btn btn-danger hm-button">Play Again</button>
            <button onClick={() => button_navigate("scores")} type="submit" className="btn btn-danger hm-button">High Scores</button>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <h3 className="players-label">Players:</h3>
            <ul>
              <li className="hm-li">(Guesser) {localStorage.getItem("currentUser")}: {game_data.score_1}</li>
              <li className="hm-li">(Word-giver) {localStorage.getItem("currentUser")}: {game_data.score_2}</li>
            </ul>
          </div>
          <div className="col">
            <img alt="Hangman" className="hm-img" src={win ? "hangman0.png" : "hangman" + game_data.incorrect_guesses.length + ".png"} width="250px"></img>
            {win && <img alt="Hangman-dance" className="win-gif" src={"stickman-dance.gif"}></img>}
          </div>
          <div className="col">
            <h3 className="incorrect-guess-label">Incorrect Guesses:</h3>
            <p className="hm-p">{game_data.incorrect_guesses.join("").substring(0, game_data.incorrect_guesses.join("").length-2)}</p>
          </div>
        </div>
        <div className="row">
          <label className="word-label">{game_data.the_hidden_word} </label>
        </div>
        <div className="row">
          <label className="guess-label">Guess: </label>
          <input autoComplete="off" autoFocus type="text" className="form-control guess-input" id="exampleFormControlInput1" placeholder="Enter your guess!" maxLength="1" onKeyDown={e => guess(e)} disabled={lose || win ? true : false}></input>
        </div>
      </div>
    </div>
  );
}