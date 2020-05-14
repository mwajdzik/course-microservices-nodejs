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

app.post('/posts/:id/comments', async (req, res) => {
    const postId = req.params.id;
    const id = randomBytes(4).toString('hex');
    const {comment} = req.body;
    const comments = commentsByPostId[postId] || [];
    comments.push({id, comment});
    commentsByPostId[postId] = comments;

    await axios.post('http://localhost:4005/events', {
        type: 'CommentCreated',
        data: {id, postId, comment}
    })

    res.status(201).send(comments);
});

app.get('/events', (req, res) => {
    console.log('Received Event', req.body.type);
    res.send({});
});

app.listen(4001, () => {
    console.log("Comments Service listening...");
});
