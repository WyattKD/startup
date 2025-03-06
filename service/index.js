const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const express = require('express');
const uuid = require('uuid');
const app = express();

const auth_cookie_name = 'token';

let users = [];
let scores = [];

const port = process.argv.length > 2 ? process.argv[2] : 4000;

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

var api_router = express.Router();
app.use(`/api`, api_router);


api_router.post('/auth/sign_up', async (req, res) => {
  if (await find_user('user_name', req.body.user_name)) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const user = await sign_up_user(req.body.user_name, req.body.password);

    set_auth_cookie(res, user.token);
    res.send({ user_name: user.user_name });
  }
});

// LOGIN
api_router.post('/auth/login', async (req, res) => {
  const user = await find_user('user_name', req.body.user_name);
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      user.token = uuid.v4();
      set_auth_cookie(res, user.token);
      res.send({ user_name: user.user_name });
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


app.use(function (err, req, res, next) {
  res.status(500).send({ type: err.name, message: err.message });
});

app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

// SIGN UP
async function sign_up_user(user_name, password) {
  const password_hash = await bcrypt.hash(password, 10);

  const user = {
    user_name: user_name,
    password: password_hash,
    token: uuid.v4(),
  };
  users.push(user);

  return user;
}

async function find_user(field, value) {
  if (!value) return null;

  return users.find((u) => u[field] === value);
}

// set_auth_cookie in the HTTP response
function set_auth_cookie(res, auth_token) {
  res.cookie(auth_cookie_name, auth_token, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});