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
        console.log('Received Event', data);

        const {id, title} = data;
        posts[id] = {id, title, comments: []};
    }

    if (type === 'CommentCreated') {
        console.log('Received Event', data);

        const {id, postId, content, status} = data;
        posts[postId]['comments'].push({id, content, status});
    }

    if (type === 'CommentUpdated') {
        console.log('Received Event', data);

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
    const {type, data} = req.body;
    handleEvent(type, data)

    res.send({});
});

app.listen(4002, async () => {
    console.log('Query Service listening...');

    // const res = await axios.get('http://event-bus-clusterip-srv:4005/events');
    const res = await axios.get('http://event-bus:4005/events');

    for (let event of res.data) {
        const {type, data} = event;
        console.log('Processing event:', type)
        handleEvent(type, data);
    }

    console.log('Loading of the past events is done');
});
