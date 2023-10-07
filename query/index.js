const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

app.use(bodyParser.json());
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {
    if(type === 'PostCreated') {
        const {id, title} = data;
        posts[id] = { id, title, comments:[] };
    }

    if(type === 'CommentCreated') {
        const { id, content, postId, status } = data;

        const post = posts[postId];
        post.comments.push( {id, content, status });
    }

    if(type === "CommentUpdated") {
        const { id, content, postId, status } = data;

        const post = posts[postId];
        const comment = post.comments.find(comment => {
            return comment.id === id;
        });

        comment.status = status;
        comment.content = content;
    }
}

app.get('/posts', (req, res) => { 
    res.send(posts);
});

app.post('/events', (req, res) => {  
    try {
        const { type, data } = req.body;
    
        handleEvent(type, data);
        res.send({})
        
    } catch (error) {
        console.error('Error', error);
    }
});

app.listen(4002, async () => { 
    try {
        console.log('Listening on 4002');
    
        const res = await axios.get('http://localhost:4005/events');
    
        for(let event of res.data) {
            console.log('processing event:', event.type);
    
            handleEvent(event.type, event.data);
        }
        
    } catch (error) {
        console.log('error:', error.message);
    }
})