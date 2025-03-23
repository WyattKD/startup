import React from 'react';
import { useNavigate } from 'react-router-dom';
import './input_word.css';
import { useSound } from 'use-sound';
import { useWebSocket } from '../WebSocketContext.jsx';

export function Input_Word({user}) {
  const navigate = useNavigate();
  const [the_word, set_the_word] = React.useState('')
  const [valid_word, set_valid_word] = React.useState(true)
  const [input_text, set_input_text] = React.useState("")
  const [button_click] = useSound('buttonclick.mp4', { volume: 3 });
  const ws = useWebSocket();

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
    if (ws) {
      ws.onopen = () => {
        navigate('/')
      };
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'get_players',  
          room: localStorage.getItem('currentRoomNumber'),
          player: localStorage.getItem('currentUser')
        }));
      }
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'players' && data.message < 2) {
          navigate(-1)
        }
      }
    }
  
  }, [ws, user])

  async function verify_word(word) {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    return (response.ok)
  }

  async function button_submit(e) {
    button_click()
    submit_real_word("Enter", e)
  }

  async function submit_real_word(key="Enter", event=null) {
    if (key == "Enter" && localStorage.getItem("real_words?") == "true" && /^[a-zA-Z]+$/.test(the_word)) {
      await verify_word(the_word).then((valid) => {if(valid){submit_word("Enter", event)}else{submit_word("", event, true)}})
    } else if (key == "Enter") {
      submit_word(key, event)
    }
  }

  function submit_word(key="Enter", event=null, invalid_word=false) {
    if (key == "Enter" && the_word != "" && /^[a-zA-Z]+$/.test(the_word)) {
      localStorage.setItem("the_word", the_word)
      navigate('/hangman')
    } else if (key == "Enter" || invalid_word) {
      event.target.value = ""
      set_valid_word(false)
      set_input_text("")
    }
  }
  return (
    <main className="word-main">
      <div className="word-box">
      
        <div className="mb-3">
          <h1 className="word-h1">{localStorage.getItem("currentUser") == localStorage.getItem("word_giver") ? "Enter Word:" : `${localStorage.getItem("word_giver")} is picking a word!`} </h1>
          <input disabled={localStorage.getItem("currentUser") == localStorage.getItem("word_giver") ? false : true} autoComplete="off" onKeyDown={e => submit_real_word(e.key, e)} onChange={e => {set_the_word(e.target.value.trim()); set_input_text(e.target.value)}} type="text" className="form-control word-input" id="exampleFormControlInput2" maxLength="30" value={input_text} placeholder={valid_word ? "" : "Not a valid word!"}></input>
          <button disabled={localStorage.getItem("currentUser") == localStorage.getItem("word_giver") ? false : true} onClick={e => button_submit(e)} type="submit" className="btn btn-danger word-button">Confirm</button>
        </div>
      </div>
    </main>
  );
}