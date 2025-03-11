import React from 'react';
import { useNavigate } from 'react-router-dom';
import './input_word.css';

export function Input_Word() {
  const navigate = useNavigate();
  const [the_word, set_the_word] = React.useState('')
  const [valid_word, set_valid_word] = React.useState(true)

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

  async function verify_word(word) {
    const word_from_dict = await (await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)).json()
    try {
      if (word_from_dict[0]["word"] == word) {
        return true
      } else {
        return false
      }
    } catch(error) {
      return false
    }
  }

  async function submit_real_word(key="Enter", event=null) {
    if (key == "Enter") {
      await verify_word(the_word).then((valid) => {if(valid){submit_word("Enter", event)}else{submit_word("", event, true)}})
    }
  }

  function submit_word(key="Enter", event=null, invalid_word=false) {
    if (key == "Enter" && the_word != "" && /^[a-zA-Z]+$/.test(the_word)) {
      localStorage.setItem("the_word", the_word)
      navigate('/hangman')
    } else if (key == "Enter" || invalid_word) {
      event.target.value = ""
      set_valid_word(false)
    }
  }
  return (
    <main className="word-main">
      <div className="word-box">
      
        <div className="mb-3">
          <h1 className="word-h1">Enter Word: </h1>
          <input autoComplete="off" onKeyDown={e => submit_real_word(e.key, e)} onChange={e => {set_the_word(e.target.value.trim())}} type="text" className="form-control word-input" id="exampleFormControlInput2" maxLength="30" placeholder={valid_word ? "" : "Not a valid word!"}></input>
          <button onClick={e => submit_real_word("Enter", e)} type="submit" className="btn btn-success word-button">Confirm</button>
        </div>
      </div>
    </main>
  );
}