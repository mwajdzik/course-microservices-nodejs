const express = require("express");
const bodyParser = require("body-parser");
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

app.post('/events', async (req, res) => {
    const {type, data} = req.body;

    if (type === 'CommentCreated') {
        console.log('Received Event', req.body);

        const {content} = data;
        const status = content.includes('orange') ? 'REJECTED' : 'APPROVED';
        const url = 'http://event-bus:4005/events';
        // const url = 'http://event-bus-clusterip-srv:4005/events';

        await axios.post(url, {
            type: 'CommentModerated',
            data: {...data, status}
        });
    }

    res.send({});
});

app.listen(4003, () => {
    console.log("Moderation Service listening...");
});
