import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

export default function App() {
    return (
        <div className='app bg-dark text-light'>App will display here
            <header>
                <nav>
                    <menu>
                        <li><a href="login.html">Login</a></li>
                        <li><a href="hangman.html">Hangman</a></li>
                        <li><a href="scores.html">High Scores</a></li>
                        <li><a href="room_settings.html">Game Settings</a></li>
                    </menu>
                </nav>
            </header>
            <footer>
                <div class="text-reset">Wyatt Dunlap</div>
                <a href="https://github.com/WyattKD/startup">GitHub</a>
            </footer>
        </div>
    );
}