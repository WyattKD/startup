import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Hangman } from './hangman/hangman';
import { Scores } from './scores/scores';
import { Room_Settings } from './room_settings/room_settings';


export default function App() {
    return (
        <BrowserRouter>
            <div>
                <header>
                    <nav>
                        <menu>
                            <li><NavLink className='nav-link' to='login'>Login</NavLink></li>
                            <li><NavLink className='nav-link' to='hangman'>Hangman</NavLink></li>
                            <li><NavLink className='nav-link' to='scores'>High Scores</NavLink></li>
                            <li><NavLink className='nav-link' to='room_settings'>Game Settings</NavLink></li>
                        </menu>
                    </nav>
                </header>
                <footer>
                    <div class="text-reset">Wyatt Dunlap</div>
                    <a href="https://github.com/WyattKD/startup">GitHub</a>
                </footer>
            </div>
        </BrowserRouter>
    );
}