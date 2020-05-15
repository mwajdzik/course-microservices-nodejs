const express = require("express");
const bodyParser = require("body-parser");
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

app.post('/events', async (req, res) => {
    console.log('Received Event', req.body);

    const {type, data} = req.body;

    if (type === 'CommentCreated') {
        const {content} = data;
        const status = content.includes('orange') ? 'REJECTED' : 'APPROVED';
        
        await axios.post('http://localhost:4005/events', {
            type: 'CommentModerated',
            data: {...data, status}
        });
    }

    res.send({});
});

app.listen(4003, () => {
    console.log("Moderation Service listening...");
});
