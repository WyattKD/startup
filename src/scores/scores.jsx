import React from 'react';
import { useNavigate } from 'react-router-dom';
import './scores.css';

export function Scores() {
  const navigate = useNavigate();
  function log_out() {
    localStorage.removeItem("currentUser")
    localStorage.removeItem("currentRoomNumber")
    navigate('/')
  }

  return (
    <div className='scores'>
      <h1 className="scores-h1">HIGH SCORES</h1>
      <button onClick={() => navigate('/room_settings')} type="submit" className="btn btn-info sc-button">Play Again</button>
      <button onClick={() => log_out()} type="submit" className="btn btn-info sc-button">Log Out</button>
      <table className="table table-striped">
        <thead>
          <tr className="table-primary">
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Score</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">1</th>
            <td>{localStorage.getItem("scores").split(",")[0]}</td>
            <td>{localStorage.getItem("scores").split(",")[1]}</td>
          </tr>
          <tr>
            <th scope="row">2</th>
            <td>{localStorage.getItem("scores").split(",")[2]}</td>
            <td>{localStorage.getItem("scores").split(",")[3]}</td>
          </tr>
          <tr>
            <th scope="row">3</th>
            <td>{localStorage.getItem("scores").split(",")[4]}</td>
            <td>{localStorage.getItem("scores").split(",")[5]}</td>
          </tr>
          <tr>
            <th scope="row">4</th>
            <td>{localStorage.getItem("scores").split(",")[6]}</td>
            <td>{localStorage.getItem("scores").split(",")[7]}</td>
          </tr>
          <tr>
            <th scope="row">5</th>
            <td>{localStorage.getItem("scores").split(",")[8]}</td>
            <td>{localStorage.getItem("scores").split(",")[9]}</td>
          </tr>
          <tr>
            <th scope="row">6</th>
            <td>{localStorage.getItem("scores").split(",")[10]}</td>
            <td>{localStorage.getItem("scores").split(",")[11]}</td>
          </tr>
          <tr>
            <th scope="row">7</th>
            <td>{localStorage.getItem("scores").split(",")[12]}</td>
            <td>{localStorage.getItem("scores").split(",")[13]}</td>
          </tr>
          <tr>
            <th scope="row">8</th>
            <td>{localStorage.getItem("scores").split(",")[14]}</td>
            <td>{localStorage.getItem("scores").split(",")[15]}</td>
          </tr>
          <tr>
            <th scope="row">9</th>
            <td>{localStorage.getItem("scores").split(",")[16]}</td>
            <td>{localStorage.getItem("scores").split(",")[17]}</td>
          </tr>
          <tr>
            <th scope="row">10</th>
            <td>{localStorage.getItem("scores").split(",")[18]}</td>
            <td>{localStorage.getItem("scores").split(",")[19]}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}