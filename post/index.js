const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');



const app = express();

app.use(bodyParser.json());
app.use(cors());

const posts = { };


app.get('/posts', (req, res) => {
    res.send(posts);

});

app.post('/posts', async(req, res) => { //puerto 4000
    try {
        console.log('port 4000 entering');
        const id = randomBytes(4).toString('hex');
        const { title } = req.body;
     
        posts[id] = {
            id, title
        };
    
        await axios.post('http://localhost:4005/events', {
            type: "PostCreated",
            data: {  
                id, title
            }
        });
    
        res.status(201).send(posts[id]);
        
    } catch (error) {
        console.log('errrorrrr', error.message);
    }
});

app.post('/events', async(req, res) => {
    console.log('received event OK', req.body.type);

    res.send({'Status':'OK'});
});
 

app.listen(4000, () => { 
    console.log("listening on port 4000");
}) 