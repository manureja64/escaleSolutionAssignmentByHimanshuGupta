const express = require('express'); //require express
const path = require('path');
const ejs = require('ejs');
const app = new express();

app.set('view engine', 'ejs');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/escalarAssignment', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.static('public'));
app.use(express.json({ limit: '50mb', extended: true })); //limit attribute is used to deal with error: "PayloadTooLargeError: request entity too large"
app.use(express.urlencoded({ limit: '50mb', extended: true })); //limit attribute is used to deal with error: "PayloadTooLargeError: request entity too large"

const expressSession = require('express-session');
app.use(expressSession({
    secret: 'keyboard cat'
}))

global.loggedIn = null;

app.use("*", (req, res, next) => {
    loggedIn = req.session.userId;
    next();
})

var catalogRouter = require('./routes/catalog');
app.use('/catalog', catalogRouter);
app.get('/', function (req, res, next) {
    res.redirect('/catalog/users');
})
app.use((req, res) => res.render('notfound'));

let port = process.env.PORT;
if (port == null || port == "") {
    port = 4000;
}
app.listen(port, () => {
    console.log(`App listening on port ${port}`);

})

