var express = require('express');
var cors = require('cors');
var _ = require('underscore');
var app = express();

var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.send(200);
    } else {
        next();
    }
};

//app.use(allowCrossDomain);

app.use(cors({
    origin: true,
    credentials: true,
    methods: 'GET,PUT,POST,DELETE'
}));

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
});


var users = {
    1: {
        id: 1,
        name: 'Luke'
    },
    2: {
        id: 1,
        name: 'Matt'
    },
    3: {
        id: 3,
        name: 'Tim'
    }
};

var counter = 4;

// Create
app.put('/api/user', function (req, res) {
    var user = req.body;
    user.id = counter;
    users[user.id] = user;
    counter += 1;
    res.json({body: user});
});

// Read
app.get('/api/user/:id', function (req, res) {
    var user = users[req.params.id];
    res.json({body: user});
});

// Index
app.get('/api/user', function (req, res) {
    res.json({body: _.values(users)});
});

// Update
app.post('/api/user', function (req, res) {
    var user = req.body;
    users[user.id] = user;
    res.json({body: true});
});

// Delete
app.delete('/api/user/:id', function (req, res) {
    delete users[req.params.id];
    res.json({body: true});
});


var start = Date.now();
var log = function (message) {
    console.log("[" + (Date.now() - start) + "] " + message);
};

log("Begin server.js");

module.exports = app.listen(app.get('port'), function () {
    log("Express server listening on port " + app.get('port'));
});