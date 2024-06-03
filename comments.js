//Creat web server
const express = require('express');
const app = express();
const PORT = 3000;
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.get('/comments', (req, res) => {
  fs.readFile(path.join(__dirname, 'comments.json'), 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading comments.json');
    } else {
      res.send(data);
    }
  });
});

app.post('/comments', (req, res) => {
  fs.readFile(path.join(__dirname, 'comments.json'), 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading comments.json');
    } else {
      const comments = JSON.parse(data);
      comments.push(req.body);
      fs.writeFile(path.join(__dirname, 'comments.json'), JSON.stringify(comments), (err) => {
        if (err) {
          res.status(500).send('Error writing comments.json');
        } else {
          res.send('Comment added');
        }
      });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
// Path: public/index.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Comments</title>
  </head>
  <body>
    <h1>Comments</h1>
    <div id="comments"></div>
    <form id="commentForm">
      <input type="text" name="name" placeholder="Name" required /><br />
      <textarea name="comment" placeholder="Comment" required></textarea><br />
      <button type="submit">Submit</button>
    </form>
    <script src="comments.js"></script>
  </body>
</html>
// Path: public/comments.js
document.addEventListener('DOMContentLoaded', () => {
  const comments = document.getElementById('comments');
  const commentForm = document.getElementById('commentForm');

  fetch('/comments')
    .then((response) => response.json())
    .then((data)