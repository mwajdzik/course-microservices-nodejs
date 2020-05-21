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
    console.log('Got a request for comments of ' + postId)
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

    const eventBusUrl = 'http://event-bus:4005/events'
    // const url = 'http://event-bus-clusterip-srv:4005/events'

    await axios.post(eventBusUrl, {
        type: 'CommentCreated',
        data: {...newComment, postId}
    })

    res.status(201).send(comments);
});

app.post('/events', async (req, res) => {
    const {type, data} = req.body;

    if (type === 'CommentModerated') {
        console.log('Received Event', req.body);

        const {id, postId, status} = data;
        const post = commentsByPostId[postId];
        const comment = post.find(c => c.id === id);
        const url = 'http://event-bus:4005/events';
        // const url = 'http://event-bus-clusterip-srv:4005/events';

        comment.status = status;

        await axios.post(url, {
            type: 'CommentUpdated',
            data: {...comment, postId}
        });
    }

    res.send({});
});

app.listen(4001, () => {
    console.log("Comments Service listening...");
});
