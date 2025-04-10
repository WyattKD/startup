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

async function add_score(newScore) {
  const user = await scoreCollection.findOne({name: newScore.name}) // Check if the user exists
  if (user) {
    // User exists, check if the new score is higher
    const existingScore = await scoreCollection.findOne({ name: newScore.name });
    if (existingScore && existingScore.score >= newScore.score) {
      return { success: false, message: 'New score is not higher than the existing score' };
    }
    await scoreCollection.updateOne(
      { name: newScore.name },
      { $set: { score: newScore.score } }
    );
    return { success: true, message: 'Score updated successfully' };
  } else {
    // User does not exist
    return scoreCollection.insertOne(newScore);
  }
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
