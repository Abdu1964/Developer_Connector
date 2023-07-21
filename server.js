const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport')

//to call to the server js from the other folder
const users = require('./routes/api/users');
const posts = require('./routes/api/posts');
const profile = require('./routes/api/profile');
const app = express();

// body parser middleware
app.use(passport.initialize());
//passport config
require ('./config/passport')(passport);



app.use(bodyParser.urlencoded(({extended: false})));
app.use(bodyParser.json());
//db config
const db =require('./config/keys').mongoURI;
//connect to mongodb
mongoose
 .connect(db)
 .then(() => console.log('mongodb connected'))
 .catch(err =>console.log(err));
//app.get('/',(req,res) => res.send('Hello world 2022'));
//passport middleware
//for route use
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);
const port =  process.env.PORT || 5001;
app.listen(port, () => console.log('Server running on port '+port));

