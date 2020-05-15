const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

function handleEvent(type, data) {
    if (type === 'PostCreated') {
        const {id, title} = data;
        posts[id] = {id, title, comments: []};
    }

    if (type === 'CommentCreated') {
        const {id, postId, content, status} = data;
        posts[postId]['comments'].push({id, content, status});
    }

    if (type === 'CommentUpdated') {
        const {id, postId, content, status} = data;
        const post = posts[postId];
        const comment = post.comments.find(c => c.id === id);

        comment.status = status;
        comment.content = content;
    }
}

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/events', (req, res) => {
    console.log('Received Event', req.body);

    const {type, data} = req.body;
    handleEvent(type, data)

    res.send({});
});

app.listen(4002, async () => {
    console.log('Query Service listening...');

    const res = await axios.get('http://localhost:4005/events');

    for (let event of res.data) {
        const {type, data} = event;
        console.log('Processing event:', type)
        handleEvent(type, data);
    }
});
