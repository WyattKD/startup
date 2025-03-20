import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Hangman } from './hangman/hangman';
import { Scores } from './scores/scores';
import { Room_Settings } from './room_settings/room_settings';
import { Input_Word } from './room_settings/input_word';


export default function App() {

    const [user, set_user] = React.useState(localStorage.getItem('currentUser'))

    React.useEffect(() => {
        set_user(localStorage.getItem('currentUser'))
    }, [])


    function log_out() {
        fetch(`/api/auth/logout`, {
          method: 'delete',
        }).finally(() => {
          set_user(null)
          localStorage.removeItem("currentUser")
          localStorage.removeItem("currentRoomNumber")
        });
    }

    return (
        <BrowserRouter>
            <div className="app-body">
                <header>
                    {user != null && (<div>User: {user}</div>)}
                    {user != null && (<button onClick={() => log_out()} type="submit" className="btn btn-danger app-button">Log Out</button>)}
                </header>
                <Routes>
                    <Route path='/' element={<Login />} exact />
                    <Route path='/hangman' element={<Hangman user = {user} />} />
                    <Route path='/scores' element={<Scores user = {user} />} />
                    <Route path='/room_settings' element={<Room_Settings user = {user} set_user = {set_user}/>} />
                    <Route path='/input_word' element={<Input_Word user = {user} />} />
                    <Route path='*' element={<NotFound />} />
                </Routes>
                <footer>
                    <div className="text-reset">Wyatt Dunlap</div>
                    <a href="https://github.com/WyattKD/startup">GitHub</a>
                </footer>
            </div>
        </BrowserRouter>
    );
}

function NotFound() {
    return <main className='container-fluid bg-secondary text-center'>404: Return to sender. Address unknown.</main>;
}

