import React from 'react';
import './scores.css';

export function Scores() {
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
        <tbody>
          <tr>
            <th scope="row">1</th>
            <td>Mark</td>
            <td>9999</td>
          </tr>
          <tr>
            <th scope="row">2</th>
            <td>Jacob</td>
            <td>1000</td>
          </tr>
          <tr>
            <th scope="row">3</th>
            <td>Larry</td>
            <td>-3</td>
          </tr>
          <tr>
            <th scope="row">4</th>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <th scope="row">5</th>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <th scope="row">6</th>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <th scope="row">7</th>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <th scope="row">8</th>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <th scope="row">9</th>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <th scope="row">10</th>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}