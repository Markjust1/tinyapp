const express = require('express');
const app = express();
const PORT = 8080;
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const urlencoded = require('body-parser/lib/types/urlencoded');
const bcrypt = require('bcryptjs');

// const {
//   generateRandomString,
//   generateId,
//   findUser,
//   findPassword,
//   findEmail,
//   urlsForUser
//   } = require('./helper');

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.set("view engine", "ejs");

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

const urlDatabase = {
  b6UTxQ: {
        longURL: "https://www.tsn.ca",
        userID: "aJ48lW"
    },
  i3BoGr: {
        longURL: "https://www.google.ca",
        userID: "aJ48lW"
    }
};

//////// HOME PAGE //////////

app.get('/urls', (req, res) => {
  const user_id = req.cookies["user_id"];
  const user = users[user_id];
  //console.log(urlsForUser(user_id));
  const templateVars = { 
    user,
    urls: urlsForUser(user_id) };
  res.render("urls_index", templateVars);
});
//////// CREATING NEW URL //////////

app.get("/urls/new", (req, res) => {
  const user_id = req.cookies["user_id"];
  if (!user_id) {
    res.status(403).send('Login or register to shorten the URL');
    //res.redirect('/urls');
  }
  
  const user = users[user_id];
  const templateVars = { user };
  res.render("urls_new", templateVars);
});

//////// REGISTER //////////

app.get('/register', (req, res) => {
  const user_id = req.cookies["user_id"];
  const user = users[user_id];
  const templateVars = { user };
  res.render("urls_register", templateVars);
});
//////// LOGIN //////////

app.get('/login', (req, res) => {
  const user_id = req.cookies["user_id"];
  const user = users[user_id];
  const templateVars = { user };
  res.render("urls_login", templateVars);
});

//////// SHORT URL //////////

app.get("/urls/:someShortURL", (req, res) => {
  const user_id = req.cookies["user_id"];
  const user = users[user_id];
  //console.log('user ID:', user_id)
  const longURL = urlDatabase[req.params.someShortURL].longURL;
  const templateVars = { shortURL: req.params.someShortURL, longURL: longURL, user};
  res.render("urls_show", templateVars);
});

app.get("/u/:myShortURL", (req, res) => {
  const longURL = urlDatabase[req.params.myShortURL].longURL;
  res.redirect(longURL);
});

//////// POST //////////

app.post('/urls', (req, res) => {
  const userRandomID = req.cookies["user_id"];
  let shortUrl = generateRandomString();
  let longURL = req.body.longURL;
  urlDatabase[shortUrl] = {longURL, userID: userRandomID};
  res.redirect(`urls/${shortUrl}`);
});

app.post('/urls/:myShortURL/delete', (req, res) => {
  const userId = req.cookies["user_id"];
  const shortUrl = req.params.myShortURL;
  // console.log('userId', userId);
  // console.log('shortUrl', shortUrl);
  // console.log('urlDatabase', urlDatabase);
  if (userId === urlDatabase[shortUrl].userID) {
    delete urlDatabase[shortUrl];
    res.redirect('/urls');
  } else {
    res.status(403).send('Access denied');
  }
});

app.post('/urls/:id', (req, res) => {
  const userId = req.cookies["user_id"];
  const longURL = req.body.longURL;
  const shortUrl = req.params.id;
  urlDatabase[shortUrl] = {longURL, userID: userId};
  res.redirect('/urls/');
});

//////// LOGIN //////////

app.post('/login', (req, res) => {
  const candidateEmail = req.body.email;
  if (candidateEmail !== findEmail(candidateEmail)) {
    res.redirect('/register');
    return;
  }
  const candidatePassword = req.body.password;  // input password
  const user = findUser(candidateEmail);
  //console.log(user.password);
  if (!user) {
    res.status(403).redirect('/register');
    return;
  }
  if (bcrypt.compareSync(candidatePassword, user.password)) {
    res.cookie('user_id', user.id);
    res.redirect('/urls');
  } else {
    res.status(403).send("Incorrect password");
  }
});

//////// LOGOUT //////////

app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/login');
});
//////// REGISTER //////////

app.post('/register', (req, res) => {
  const userId = {};
  const id = generateId();
  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);
  //console.log(hashedPassword);
  // checking email and password for the empty string
  if (email.length === 0 || password.length === 0) {
    res.status(404).send("Enter a valid email and password");
    return;
  }
  if (findUser(email)) {
    res.status(404).send("User already exists");
    return;
  }
  userId.id = id;
  userId.email = email;
  userId.password = hashedPassword;
  users[id] = userId;
  res.cookie('user_id', id);
  console.log(users)
  res.redirect('/urls');

});

app.listen(PORT, () => {
  console.log(`Example app is listening on port:${PORT}`);
});

//module.exports = { users, urlDatabase };

///////////////////////////////////////////
//////////      FUNCTIONS     /////////////
///////////////////////////////////////////

function generateRandomString() {
  return Math.random().toString(36).substring(2, 8);
} 

function generateId() {
  return Math.random().toString(36).substring(2, 8);
} 

function findUser(email) {
  for (let user in users) {
    if (email === users[user].email) {
      return users[user];
    }
  }
}
function findPassword(password) {
  for (let user in users) {
    if (password === users[user].password) {
      return users[user].password;
    }
  }
}
function findEmail(email) {
  for (let user in users) {
    if (email === users[user].email) {
      return users[user].email;
    }
  }
}
function urlsForUser(id) {
  const urls = {};
  for (let url in urlDatabase) {
    if ( urlDatabase[url].userID === id) {
      urls[url] = urlDatabase[url];
    }
  }
  return urls;
}