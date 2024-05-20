require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

//URL Shortner
const originalUrls = [];
const shortUrls = [];


app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post("/api/shorturl", (req, res) => {
  const url = req.body.url
  const foundIndex = originalUrls.indexOf(url);

  if (!url.includes("https://") && !url.includes("http://")) {
  return res.json({ error: "Invalid url" })
}

  if (foundIndex < 0) {
      originalUrls.push(url)
      shortUrls.push(shortUrls.length)

      return res.json({
          original_url: url,
          short_url: shortUrls.length - 1
      });
  };

  return res.json({
      original_url: url,
      short_url: shortUrls[foundIndex]
  }); 
});

app.get("/api/shorturl/:shorturl", (req, res) => {
  const shorturl = parseInt(req.params.shorturl)
  const foundIndex = shortUrls.indexOf(shorturl);

  console.log(shortUrls)
  console.log(foundIndex)
  console.log(originalUrls)

  if (foundIndex < 0) {
      return res.json({
          "error": "No short URL found for the given input"
      });
  } else {
  res.redirect(originalUrls[foundIndex])
}
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
