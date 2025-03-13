const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('projectw');
const userCollection = db.collection('users');
const scoreCollection = db.collection('scores');

// This will asynchronously test the connection and exit the process if it fails
(async function test_connection() {
  try {
    await db.command({ ping: 1 });
    console.log(`Connect to database`);
  } catch (ex) {
    console.log(`Unable to connect to database with ${url} because ${ex.message}`);
    process.exit(1);
  }
})();

function get_user(username) {
  return userCollection.findOne({ username: username });
}

function get_user_by_token(token) {
  return userCollection.findOne({ token: token });
}

async function add_user(user) {
  await userCollection.insertOne(user);
}

async function update_user(user) {
  await userCollection.updateOne({ username: user.username }, { $set: user });
}

async function add_score(score) {
  return scoreCollection.insertOne(score);
}

function get_high_scores() {
  const query = { score: { $gt: 0 } };
  const options = {
    sort: { score: -1 },
    limit: 10,
  };
  const cursor = scoreCollection.find(query, options);
  return cursor.toArray();
}

module.exports = {
  get_user,
  get_user_by_token,
  add_user,
  update_user,
  add_score,
  get_high_scores,
};
