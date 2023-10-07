const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');


const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};


app.get('/posts/:id/comments', (req, res) => {
    if(commentsByPostId[req.params.id] === undefined) {
        return res.send([]);
    }
    res.send(commentsByPostId[req.params.id]);
});

app.post('/posts/:id/comments', async(req, res) => { // not events

    try {
        const commentId = randomBytes(4).toString('hex');
        const { content } = req.body;
    
        const comments = commentsByPostId[req.params.id] || [];
    
        comments.push({ id:commentId, content, status:'pending' });
    
        commentsByPostId[req.params.id] = comments;
    
        await axios.post('http://localhost:4005/events', { 
            type:'CommentCreated', 
            data: {
                id: commentId,
                content,
                postId: req.params.id,
                status:'pending'
            }
        });
        res.status(201).send(comments);
        
    } catch (error) {
        console.log('error', error);
        res.status(404).json(comments);
    }
});

app.post('/events', async(req, res) => {

    const { type, data } = req.body;

    if(type === "CommentModerated") {
        const {postId, id, status, content } = data;

        const comments = commentsByPostId[postId];
        const comment = comments.find(comment => {
            return comment.id === id;
        });
        comment.status = status;

        await axios.post('http://localhost:4005/events', {
            type: "CommentUpdate",
            data: {
                id,
                status,
                postId,
                content
            }
        })
    }

    res.send({});
})

app.listen(4001, () => {
    console.log('listening on port 4001');
})
