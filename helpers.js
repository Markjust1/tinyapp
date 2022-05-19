/////// FUNCTIONS FOR THE PROJECT  ///////

const generateRandomString = () => {
  return Math.random().toString(36).substring(2, 8);
};

const findUser = (email, users) => {
  for (let user in users) {
    if (email === users[user].email) {
      return users[user];
    }
  }
};

const urlsForUser = (id, database) => {
  const urls = {};
  for (let url in database) {
    if ( database[url].userID === id) {
      urls[url] = database[url];
    }
  }
  return urls;
};

module.exports = {
   generateRandomString,
   findUser,
   urlsForUser
   };