// implement your API here

const express = require('express'); //like importing React
const server = express(); //like instantiating React app
server.use(express.json()); //middleware enabling express to read json from req.body (in PUT and PUT/PATCH)
const port = 5000;

const Database = require('./data/db.js');

server.listen(port, () => {
   console.log('Server running on http://localhost:5000')
});

server.post('/api/users', (req, res) => { //req = request; res = response
    const info = req.body;
    if (!(info.name && info.bio)) { //validation of name & bio
        res.status(400).json({errorMessage: 'Please provide name and bio for the user.'});
    } else {
        Database.insert(info).then(user => {
            res.status(201).json(user);
        }).catch(err => {
            console.log(err);
            res.status(500).json({errorMessage: 'There was an error while saving the user to the database'});
        });
    }
});

server.get('/api/users', (req, res) => {
    Database.find().then(users => {
        res.status(200).json(users);
    }).catch(err => {
        console.log(err);
        res.status(500).json({errorMessage: 'The users information could not be retrieved.'});
    });
});


server.get('/api/users/:id', (req, res) => {
    const {id} = req.params;
    Database.findById(id).then(user => {
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({errorMessage: 'The user with the specified ID does not exist.'});
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json({errorMessage: 'The users information could not be retrieved.'});
    });
});

server.delete('/api/users/:id', (req, res) => {
    const {id} = req.params;
    Database.remove(id).then(removedUser => {
        res.status(200).json(removedUser);
    }).catch(err => {
        console.log(err);
        res.status(500).json({errorMessage: 'The user could not be removed'});
    });
});

server.put('/api/users/:id', (req, res) => {
    const {id} = req.params;
    const info = req.body;
    if (!(info.name && info.bio)) { //validation of name & bio
        res.status(400).json({errorMessage: 'Please provide name and bio for the user.'});
    } else {
        Database.update(id, info).then(user => {
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({errorMessage: 'The user with the specified ID does not exist.'});
            }
        }).catch(err => {
            console.log(err);
            res.status(500).json({errorMessage: 'The user information could not be modified.'});
        });
    }
});