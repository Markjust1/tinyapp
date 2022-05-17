const express = require('express');
const app = express();
const PORT = 8080;

const bodyParser = require("body-parser");
const urlencoded = require('body-parser/lib/types/urlencoded');
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");


const urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xk': 'http://www.google.com'
};

app.get('/', (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get('/urls', (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});


app.get("/urls/:someShortURL", (req, res) => {
  const longURL = urlDatabase[req.params.someShortURL];
  const templateVars = { shortURL: req.params.someShortURL, longURL: longURL};
  res.render("urls_show", templateVars);
});

app.get("/u/:myShortURL", (req, res) => {
  // console.log('This is my urlDatabase', urlDatabase);
  // console.log('This is my shortUrl:', req.params.myShortURL);
  const longURL = urlDatabase[req.params.myShortURL];
  // console.log('This is my longURL',longURL);
  res.redirect(longURL);
});

app.post('/urls', (req, res) => {
  let shortUrl = generateRandomString();
  let longUrl = req.body.longURL;
  urlDatabase[shortUrl] = longUrl;
  console.log(urlDatabase);
  res.redirect(`/urls/`);
});

app.post('/urls/:myShortURL/delete', (req, res) => {
  const shortUrl = req.params.myShortURL;
  delete urlDatabase[shortUrl];
  res.redirect('/urls');
});

app.post('/urls/:id', (req, res) => {
  const longUrl = req.body.longURL;
  const shortUrl = req.params.id;
  //console.log('Database', urlDatabase);
  urlDatabase[shortUrl] = longUrl;
  //console.log('Database', urlDatabase);
  //console.log(req.params.id);
  res.redirect('/');
});



app.listen(PORT, () => {
  console.log(`Example app is listening on port:${PORT}`);
});


function generateRandomString() {
  let randomString = '';
  const charSet =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const setLength = charSet.length;
  for (let i = 0; i < 6; i++) {
    randomString += charSet.charAt(Math.floor(Math.random() * setLength));
  }
  return randomString;
} 
