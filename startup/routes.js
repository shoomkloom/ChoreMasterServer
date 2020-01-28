const express = require('express');
/*@@
const genres = require('../routes/genres');
const movies = require('../routes/movies');
const customers = require('../routes/customers');
@@*/
const groups = require('../routes/groups');
const users = require('../routes/users');
const auth = require('../routes/auth');
const error = require('../middleware/error');

module.exports = function(app) {
    //Support using json in express
    app.use(express.json());
    app.use(express.static('public'));
/*@@    
    app.use('/api/genres', genres);
    app.use('/api/movies', movies);
    app.use('/api/customers', customers);
@@*/    
    app.use('/api/groups', groups);
    app.use('/api/users', users);
    app.use('/api/auth', auth);

    //Must be last!
    app.use(error);
}