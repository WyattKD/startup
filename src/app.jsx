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
    return (
        <BrowserRouter>
            <div>
                <header>
                    <nav>
                        <menu>
                            <li><NavLink className='nav-link' to=''>Login</NavLink></li>
                            <li><NavLink className='nav-link' to='hangman'>Hangman</NavLink></li>
                            <li><NavLink className='nav-link' to='scores'>High Scores</NavLink></li>
                            <li><NavLink className='nav-link' to='room_settings'>Game Settings</NavLink></li>
                        </menu>
                    </nav>
                </header>
                <Routes>
                    <Route path='/' element={<Login />} exact />
                    <Route path='/hangman' element={<Hangman />} />
                    <Route path='/scores' element={<Scores />} />
                    <Route path='/room_settings' element={<Room_Settings />} />
                    <Route path='/input_word' element={<Input_Word />} />
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