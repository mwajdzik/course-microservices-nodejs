const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const {randomBytes} = require("crypto");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
    const postId = req.params.id;
    res.send(commentsByPostId[postId]);
});

app.post('/posts/:id/comments', (req, res) => {
    const postId = req.params.id;
    const id = randomBytes(4).toString('hex');
    const {content} = req.body;
    const comments = commentsByPostId[postId] || [];
    comments.push({id, content});
    commentsByPostId[postId] = comments;
    res.status(201).send(comments);
});

app.listen(4001, () => {
    console.log("Comments Service listening...");
});
