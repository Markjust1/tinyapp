/////// FUNCTIONS FOR THE PROJECT  ///////

const { users, urlDatabase } = require('./express_server');

const generateRandomString = () => {
  let randomString = '';
  const charSet =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const setLength = charSet.length;
  for (let i = 0; i < 6; i++) {
    randomString += charSet.charAt(Math.floor(Math.random() * setLength));
  }
  return randomString;
} 

const generateId = () => {
  let randomString = 'user-';
  const charSet =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const setLength = charSet.length;
  for (let i = 0; i < 6; i++) {
    randomString += charSet.charAt(Math.floor(Math.random() * setLength));
  }
  return randomString;
} 

const findUser = (email) => {
  for (let user in users) {
    if (email === users[user].email) {
      return users[user];
    }
  }
}

const findPassword =(password) => {
  for (let user in users) {
    if (password === users[user].password) {
      return users[user].password;
    }
  }
}

const findEmail = (email) => {
  for (let user in users) {
    if (email === users[user].email) {
      return users[user].email;
    }
  }
}

const urlsForUser = (id) => {
  const urls = {};
  for (let url in urlDatabase) {
    if ( urlDatabase[url].userID === id) {
      urls[url] = urlDatabase[url];
    }
  }
  return urls;
}

module.exports = {
   generateRandomString,
   generateId,
   findUser,
   findPassword,
   findEmail,
   urlsForUser
   };