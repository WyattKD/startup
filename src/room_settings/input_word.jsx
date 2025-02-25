import React from 'react';
import { useNavigate } from 'react-router-dom';
import './input_word.css';

export function Input_Word() {
  const navigate = useNavigate();
  const [theWord, setTheWord] = React.useState('')

  function submit_word() {
    localStorage.setItem("theWord", theWord)
    navigate('/hangman')
  }
  // make it so no word isn't an option and max size is 30
  return (
    <main className="word-main">
      <div className="word-box">
      
        <div className="mb-3">
          <h1 className="word-h1">Enter Word: </h1>
          <input onChange={e => {setTheWord(e.target.value)}} type="text" className="form-control word-input" id="exampleFormControlInput2" maxlength="30"></input>
          <button onClick={() => submit_word()} type="submit" className="btn btn-success word-button">Confirm</button>
        </div>
      </div>
    </main>
  );
}