const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const express = require('express');
const uuid = require('uuid');
const app = express();
const DB = require('./database.js');
const { room_handler } = require('./websocket.js');

const auth_cookie_name = 'token';

const port = process.argv.length > 2 ? process.argv[2] : 4000;

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

var api_router = express.Router();
app.use(`/api`, api_router);

// SIGN UP
api_router.post('/auth/sign_up', async (req, res) => {
  if (await find_user('username', req.body.username)) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const user = await sign_up_user(req.body.username, req.body.password);
    set_auth_cookie(res, user.token);
    res.send({ username: user.username });
  }
});

// LOGIN
api_router.post('/auth/login', async (req, res) => {
  const user = await find_user('username', req.body.username);
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      user.token = uuid.v4();
      await DB.update_user(user);
      set_auth_cookie(res, user.token);
      res.send({ username: user.username });
      return;
    }
  }
  res.status(401).send({ msg: 'Unauthorized' });
});

// LOGOUT
api_router.delete('/auth/logout', async (req, res) => {
  const user = await find_user('token', req.cookies[auth_cookie_name]);
  if (user) {
    delete user.token;
    DB.update_user(user);
  }
  res.clearCookie(auth_cookie_name);
  res.status(204).end();
});

// Check cookie
const verify_auth = async (req, res, next) => {
  const user = await find_user('token', req.cookies[auth_cookie_name]);
  if (user) {
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
};

// Send validity
api_router.get('/auth/verify', verify_auth, (_req, res) => {
  res.status(200).send({ msg: 'Authorized' })
});

// Get the scores
api_router.get('/scores', verify_auth, async (req, res) => {
  const scores = await DB.get_high_scores();
  res.send(scores);
});

// Upload scores
api_router.post('/score', verify_auth, async (req, res) => {
  const scores = update_scores(req.body);
  res.send(scores);
});

app.use(function (err, req, res, next) {
  res.status(500).send({ type: err.name, message: err.message });
});

app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

// ADD SCORES
async function update_scores(newScore) {
  await DB.add_score(newScore);
  return DB.get_high_scores();
}

// SIGN UP
async function sign_up_user(username, password) {
  const password_hash = await bcrypt.hash(password, 10);

  const user = {
    username: username,
    password: password_hash,
    token: uuid.v4(),
  };
  await DB.add_user(user);

  return user;
}

// FIND A USER
async function find_user(field, value) {
  if (!value) return null;

  if (field === 'token') {
    return DB.get_user_by_token(value);
  }
  return DB.get_user(value);
}

// set_auth_cookie in the HTTP response
function set_auth_cookie(res, auth_token) {
  res.cookie(auth_cookie_name, auth_token, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

const http_service = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

room_handler(http_service);