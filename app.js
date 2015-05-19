var express = require('express')
var swig = require('swig')
var nodeSass = require('node-sass-middleware')
var logger = require('morgan')
var bodyParser = require('body-parser')
var app = express()
var path = require('path')
var days = require('./routes/days');
module.exports = app

app.use(logger('dev'))

var sassMiddleware = nodeSass({
  src: __dirname + '/assets',
  dest: __dirname + '/public',
  debug: true
});


app.use(sassMiddleware);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', swig.renderFile);

app.use("/days", days);

//todo 
/*
  - view engine [check]
  - bower components [check]
  - sass middleware [check]
  - logger [check]
  - mongoose model [check]
  - routes 
  - a ton of css
*/
app.use('/bower_components', express.static(path.join(__dirname, 'bower_components')))
app.use(express.static(path.join(__dirname, 'public')))

app.use(require('./routes'))







app.listen(process.env.PORT || 3000, function() {
  console.log('server up')
})