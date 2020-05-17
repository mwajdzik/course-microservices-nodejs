const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const axios = require('axios');
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
    const {content} = req.body;

    console.log('New comment added for:', postId, content);

    const comments = commentsByPostId[postId] || [];
    const newComment = {id, content, status: 'PENDING'};
    comments.push(newComment);
    commentsByPostId[postId] = comments;

    await axios.post('http://event-bus-clusterip-srv:4005/events', {
        type: 'CommentCreated',
        data: {...newComment, postId}
    })

    res.status(201).send(comments);
});

app.post('/events', async (req, res) => {
    console.log('Received Event', req.body);
    const {type, data} = req.body;

    if (type === 'CommentModerated') {
        const {id, postId, status} = data;
        const post = commentsByPostId[postId];
        const comment = post.comments.find(c => c.id === id);

        comment.status = status;

        await axios.post('http://event-bus-clusterip-srv:4005/events', {
            type: 'CommentUpdated',
            data: {...comment}
        });
    }

    res.send({});
});

app.listen(4001, () => {
    console.log("Comments Service listening...");
});
