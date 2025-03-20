import React from 'react';
import { useNavigate } from 'react-router-dom';
import './scores.css';

export function Scores({user}) {
  const [scores, set_scores] = React.useState([]);
  

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
    fetch('/api/scores')
      .then((response) => response.json())
      .then((scores) => {
        set_scores(scores);
        console.log();
    });
    
  })
  }, [user])

  const score_rows = [];
  if (scores.length) {
    for (const [i, score] of scores.entries()) {
      score_rows.push(
        <tr key={i}>
          <td>{i+1}</td>
          <td>{score.name}</td>
          <td>{score.score}</td>
        </tr>
      );
    }
  } else {
    score_rows.push(
      <tr key='0'>
        <td colSpan='3'>No High Scores Yet!</td>
      </tr>
    );
  }


  return (
    <div className='scores'>
      <h1 className="scores-h1">HIGH SCORES</h1>
      
      <table className="table table-striped">
        <thead>
          <tr className="table-primary">
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Score</th>
          </tr>
        </thead>
        <tbody>{score_rows}</tbody>
      </table>
      <button onClick={() => navigate('/room_settings')} type="submit" className="btn btn-info sc-button">Play Again</button>
    </div>
  );
}