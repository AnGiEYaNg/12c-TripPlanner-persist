var express = require('express')

var router = module.exports = express.Router()

var models = require('../models')

var Promise = require('bluebird')

/*
// method 1: callback hell
Hotels
--------
        Restarants
        -------
               thingsTodo
               ----


*/



router.get('/slowCb', function(req, res, next) {
  models.Hotel.find(function(err, hotels) {
    models.Restaurant.find(function(err, restaurants) {
      models.ThingToDo.find(function(err, thingsToDo) {
        res.json({
          hotels: hotels,
          restaurants: restaurants,
          thingsToDo: thingsToDo
        })
      })
    })
  })
})





// method 2: async
/*
Hotels
--------
Restarants
-------
thingsTodo
-----
               */
var async = require('async')
router.get('/fastCb', function(req, res, next) {
  async.parallel({
    hotels: function(done) {
      models.Hotel.find(done)
    },
    restaurants: function(done) {
      models.Restaurant.find(done)
    },
    thingsToDo: function(done) {
      models.ThingToDo.find(done)
    },
  }, function(err, resultsHash) {
    res.json(resultsHash)
  })
})


//method 3: promises (sequence, slow)
/*
Hotels
--------
        Restarants
        -------
               thingsTodo
               ----
*/
router.get('/slowPromises', function(req, res, next) {
  models.Hotel
    .find()
    .exec()
    .then(function(hotels) {
      res.locals.hotels = hotels
      return models.Restaurant.find().exec()
    })
    .then(function(restaurants) {
      res.locals.restaurants = restaurants
      return models.ThingToDo.find().exec()
    })
    .then(function(thingsToDo) {
      res.locals.thingsToDo = thingsToDo
      res.json(res.locals)
    })
})

router.get('/', function(req, res, next) {
  Promise.join(
    models.Restaurant.find().exec(),
    models.ThingToDo.find().exec(),
    models.Hotel.find().exec()
  )
  .spread(function(restaurants, thingsToDo, hotels) {
    res.render('index', {
      hotels: hotels,
      restaurants: restaurants,
      thingsToDo: thingsToDo
    })
  })
})









