const express = require('express');
const app = express();
const PORT = 8080;
const cookieSession = require('cookie-session');
const bodyParser = require("body-parser");
const urlencoded = require('body-parser/lib/types/urlencoded');
const bcrypt = require('bcryptjs');

const { generateRandomString, findUser, urlsForUser } = require('./helpers');

////// MIDDLEWARE ///////

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(cookieSession({
  name: 'user',
  keys: [ 'hello', 'world' ],
}));

//////// DATABASES //////////

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
};

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
  const user_id = req.session.user_id;
  const user = users[user_id];
  const templateVars = {
    user,
    urls: urlsForUser(user_id, urlDatabase) };
  res.render("urls_index", templateVars);
});

//////// CREATING NEW URL //////////

app.get("/urls/new", (req, res) => {
  const user_id = req.session.user_id;
  if (!user_id) {
    return res.status(403).send('Login or register to shorten the URL');
  }
  const user = users[user_id];
  const templateVars = { user };
  res.render("urls_new", templateVars);
});

//////// REGISTER GET REQUEST //////////

app.get('/register', (req, res) => {
  const user_id = req.session.user_id;
  const user = users[user_id];
  const templateVars = { user };
  res.render("urls_register", templateVars);
});
//////// LOGIN GET REQUEST //////////

app.get('/login', (req, res) => {
  const user_id = req.session.user_id;
  const user = users[user_id];
  const templateVars = { user };
  res.render("urls_login", templateVars);
});

//////// SHORT URL GET REQUEST //////////
/////////////////////////////////////////

app.get("/urls/:someShortURL", (req, res) => {
  const user_id = req.session.user_id;
  const user = users[user_id];
  const longURL = urlDatabase[req.params.someShortURL].longURL;
  const templateVars = { shortURL: req.params.someShortURL, longURL: longURL, user};
  res.render("urls_show", templateVars);
});

app.get("/u/:myShortURL", (req, res) => {
  const longURL = urlDatabase[req.params.myShortURL].longURL;
  res.redirect(longURL);
});

/////////////////////////////////////////
//////////    POST REQUESTS    //////////
/////////////////////////////////////////


app.post('/urls', (req, res) => {
  const userRandomID = req.session.user_id;
  let shortUrl = generateRandomString();
  let longURL = req.body.longURL;
  urlDatabase[shortUrl] = {longURL, userID: userRandomID};
  res.redirect(`urls/${shortUrl}`);
});

//////// DELETE URL //////////

app.post('/urls/:myShortURL/delete', (req, res) => {
  const userId = req.session.user_id;
  const shortUrl = req.params.myShortURL;
  if (userId === urlDatabase[shortUrl].userID) {
    delete urlDatabase[shortUrl];
    res.redirect('/urls');
  } else {
    res.status(403).send('Access denied');
  }
});

app.post('/urls/:id', (req, res) => {
  const userId = req.session.user_id;
  const longURL = req.body.longURL;
  const shortUrl = req.params.id;
  urlDatabase[shortUrl] = {longURL, userID: userId};
  res.redirect('/urls/');
});

//////// LOGIN //////////

app.post('/login', (req, res) => {
  const candidateEmail = req.body.email;
  const candidatePassword = req.body.password;
  const user = findUser(candidateEmail, users);
  if (candidateEmail !== user.email) {
    res.redirect('/register');
    return;
  }
  if (!user) {
    res.status(403).redirect('/register');
    return;
  }
  if (bcrypt.compareSync(candidatePassword, user.password)) {

    req.session.user_id = user.id;
    res.redirect('/urls');
  } else {
    res.status(403).send("Incorrect password");
  }
});

//////// LOGOUT //////////

app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/login');
});
//////// REGISTER //////////

app.post('/register', (req, res) => {
  let userId = {};
  const id = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);
  if (email.length === 0 || password.length === 0) {
    res.status(404).send("Enter a valid email and password");
    return;
  }
  if (findUser(email, users)) {
    res.status(404).send("User already exists");
    return;
  }
  userId = {
    id,
    email,
    password: hashedPassword
  };
  users[id] = userId;
  req.session.user_id = id;
  console.log(users);
  res.redirect('/urls');

});

app.listen(PORT, () => {
  console.log(`Example app is listening on port:${PORT}`);
});