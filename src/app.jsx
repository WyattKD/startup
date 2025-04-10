/*
STUFF TO ADD:
revamp score system
comment and organize code
stickman for you and friend?
mute button
*/
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Hangman } from './hangman/hangman';
import { Scores } from './scores/scores';
import { Room_Settings } from './room_settings/room_settings';
import { Input_Word } from './room_settings/input_word';
import { useSound } from 'use-sound';
import { WebSocketProvider } from './WebSocketContext';


export default function App() {

    const [user, set_user] = React.useState(localStorage.getItem('currentUser'))
    const [button_click] = useSound('buttonclick.mp4', { volume: 3 });
    const [info_message, set_info_message] = React.useState("Login or sign up to get started!")
    React.useEffect(() => {
        set_user(localStorage.getItem('currentUser'))
    }, [])


    function log_out() {
        button_click()
        fetch(`/api/auth/logout`, {
          method: 'delete',
        }).finally(() => {
          set_user(null)
          set_info_message("Login or sign up to get started!")
        });
    }

    return (
        <WebSocketProvider>
            <BrowserRouter>
                <div className="app-body">
                    <header>
                        {user != null && (<div className='user'>User: {user}</div>)}
                        <div className='info'>{info_message}</div>
                        {user != null && (<div><button onClick={() => log_out()} type="submit" className="btn btn-danger app-button">Log Out</button></div>)}
                    </header>
                    <Routes>
                        <Route path='/' element={<Login user = {user} set_info_message = {set_info_message}/>} exact />
                        <Route path='/hangman' element={<Hangman user = {user} set_info_message = {set_info_message} />} />
                        <Route path='/scores' element={<Scores user = {user} set_info_message = {set_info_message} />} />
                        <Route path='/room_settings' element={<Room_Settings user = {user} set_user = {set_user} set_info_message = {set_info_message} info_message={info_message}/>} />
                        <Route path='/input_word' element={<Input_Word user = {user} set_info_message = {set_info_message} />} />
                        <Route path='*' element={<NotFound />} />
                    </Routes>
                    <footer>
                        <div className="text-reset">Wyatt Dunlap</div>
                        <a href="https://github.com/WyattKD/startup">GitHub</a>
                    </footer>
                </div>
            </BrowserRouter>
        </WebSocketProvider>
    );
}

function NotFound() {
    return <main className='container-fluid bg-secondary text-center'>404: Return to sender. Address unknown.</main>;
}

