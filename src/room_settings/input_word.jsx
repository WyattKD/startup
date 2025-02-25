import React from 'react';
import { useNavigate } from 'react-router-dom';
import './input_word.css';

export function Input_Word() {
  const navigate = useNavigate();
  const [theWord, setTheWord] = React.useState('')
  const [valid_word, set_valid_word] = React.useState(true)
  function submit_word(key="Enter", event=null) {
    if (key == "Enter" && theWord != "" && /^[a-zA-Z]+$/.test(theWord)) {
      localStorage.setItem("theWord", theWord)
      navigate('/hangman')
    } else if (key == "Enter") {
      console.log("happened")
      event.target.value = ""
      set_valid_word(false)
    }
  }
  return (
    <main className="word-main">
      <div className="word-box">
      
        <div className="mb-3">
          <h1 className="word-h1">Enter Word: </h1>
          <input autoComplete="off" onKeyDown={e => submit_word(e.key, e)} onChange={e => {setTheWord(e.target.value.trim())}} type="text" className="form-control word-input" id="exampleFormControlInput2" maxLength="30" placeholder={valid_word ? "" : "Not a valid word!"}></input>
          <button onClick={e => submit_word("Enter", e)} type="submit" className="btn btn-success word-button">Confirm</button>
        </div>
      </div>
    </main>
  );
}