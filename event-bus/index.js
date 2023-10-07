const express = require('express')
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const events = [];

app.post('/events', async(req, res) => {
    const event = req.body;

    events.push(event);
    try {
        const event = req.body;
        console.log(event);
        await axios.post('http://localhost:4000/events', event).catch(err => console.error('port 4000', err.message));
        await axios.post('http://localhost:4001/events', event).catch(err => console.error('port 4001', err.message));
        await axios.post('http://localhost:4002/events', event).catch(err => console.error('port 4002', err.message));
        await axios.post('http://localhost:4003/events', event).catch(err => console.error('port 4003', err.message));

        res.send({status: 'OK'} ); 
         
    } catch (error) { 
        console.error('Error event-bus', error);
    }
});

app.get('/events', (req, res) => {
    res.send(events);
})

app.listen(4005, () => { 
    console.log('Listening on 4005'); 
}); 