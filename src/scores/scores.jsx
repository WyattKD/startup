import React from 'react';
import { useNavigate } from 'react-router-dom';
import './scores.css';
import {useSound} from 'use-sound'
import { useWebSocket } from '../WebSocketContext.jsx';

export function Scores({user, set_info_message}) {
  const [scores, set_scores] = React.useState([]);
  const [button_click] = useSound('buttonclick.mp4', { volume: 3 });

  const navigate = useNavigate();

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
    fetch('/api/scores')
      .then((response) => response.json())
      .then((scores) => {
        set_scores(scores);
        console.log();
    });
    
  })
  if (ws) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'get_players',  
        room: localStorage.getItem('currentRoomNumber'),
      }));
    }
    ws.onopen = () => {
      navigate('/')
    };
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'players' && data.message < 2) {
        set_info_message("A player left the room!")
        navigate('/room_settings')
      }
      if (data.type === 'playing_again') {
        set_info_message(`${data.message} wants to play again!`)
        navigate('/room_settings')
      }
      if (data.type === 'player_left') {
        set_info_message("A player left the room!")
        navigate('/room_settings')
      }
    };
    ws.onclose = () => {
      navigate('/')
    };
  }
  }, [ws, user])

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
  function button_navigate() {
    button_click()
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'play_again',
        room: localStorage.getItem('currentRoomNumber'),
        player: localStorage.getItem('currentUser'),
      }));
    }
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
      <button onClick={() => button_navigate()} type="submit" className="btn btn-info sc-button">Play Again</button>
    </div>
  );
}