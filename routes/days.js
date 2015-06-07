var express = require('express')

var body = require('body-parser')

var dayRouter = module.exports = express.Router()
var attractionRouter = express.Router()

var models = require('../models')

var Promise = require('bluebird')

var Day = models.Day;


// GET /days
dayRouter.get('/', function (req, res, next) {
    // serves up all days as json
    Day
    	.find()
    	.then(function (allDays) {
    		res.json(allDays);
    	})
});

// POST /days
dayRouter.post('/', function (req, res, next) {
    // creates a new day and serves it as json
    Day
    	.find()
    	.then(function (allDays) {

    		var newDay = new Day ({
    			number: allDays.length + 1,
    			hotel: null,
    			restaurants: [],
    			thingsTodo: []
    		})
    		newDay.save()
    		.then(function (savedDay) {
    			res.json(savedDay.number);
    		})
    	});
});

// GET /days/:id
dayRouter.get('/:id', function (req, res, next) {
    // serves a particular day as json
    Day.findOne({'number': req.params.id})
        .then(function (day) {
            // console.log('nn', day);
            res.json(day)
        });  
});

// DELETE /days/:id
dayRouter.delete('/:id', function (req, res, next) {
    // deletes a particular day
        Day.findOneAndRemove({'number': req.params.id})
        .then(function (day) {
            Day.update({ number: { $gte: day.number }}, {$inc: {number:-1}} ,{multi:true} ).exec()
            res.send("yo");
        });
});

 dayRouter.use('/:id', attractionRouter);

// POST /days/:id/hotel
attractionRouter.post('/hotel', function (req, res, next) {
    // creates a reference to the hotel
    var thisDay=req.body.day;
    // console.log('day', thisDay);
    // console.log(req.body.hotel_id);

    Day
        .findOne({'number': thisDay})
        .then(function (day){
            // console.log("day is ", day);
            day.update({hotel: req.body.hotel_id}).exec();
            res.send({
                hotel_name: req.body.hotel_name,
                hotel_id: req.body.hotel_id
            });
        })
});


// DELETE /days/:id/hotel
attractionRouter.delete('/hotel', function (req, res, next) {
    // deletes the reference of the hotel
    var thisDay=req.body.day;
    var thisId = req.body.hotel_id;
    // console.log('day', thisDay);
    // console.log('id', req.body.hotel_id);

    Day
        .findOne({'number': thisDay})
        .then(function (day){
            // console.log("day is ", day);
            // day.update({ $set: { hotel: null } })
            // day.update({ _id: thisId },
            //     { $set: { "hotel": "null" } 
            // }).exec();
            var removedHotel = day.hotel;
            day.hotel = null;
            day.save(function (err) {
                if (err) return handleError(err);
                res.send(removedHotel);
            });
        })
});

// // POST /days/:id/restaurants
attractionRouter.post('/restaurants', function (req, res, next) {
    // creates a reference to a restaurant
    var thisDay=req.body.day;
    // console.log('day', thisDay);
    // console.log(req.body.hotel_id);

    Day
        .findOne({'number': thisDay})
        .then(function (day){
            // console.log("day is ", day);
            day.update({$push:{restaurants: req.body.restaurant_id}}).exec();
            res.send({
                restaurant_name: req.body.restaurant_name,
                restaurant_id: req.body.restaurant_id
            });
        })
});
// // DELETE /days/:dayId/restaurants/:restId
attractionRouter.delete('/restaurant/:id', function (req, res, next) {
    // deletes a reference to a restaurant
});
// POST /days/:id/thingsToDo
attractionRouter.post('/thingsToDo', function (req, res, next) {
    // creates a reference to a thing to do
    var thisDay=req.body.day;
    // console.log('day', thisDay);
    // console.log(req.body.hotel_id);

    Day
        .findOne({'number': thisDay})
        .then(function (day){
            // console.log("day is ", day);
            day.update({$push:{thingsToDo: req.body.thing_id}}).exec();
            res.send({
                thing_name: req.body.thing_name,
                thing_id: req.body.thing_id
            });
        })

});
// DELETE /days/:dayId/thingsToDo/:thingId
attractionRouter.delete('/thingsToDo/:id', function (req, res, next) {
    // deletes a reference to a thing to do
});

router.param('id', function(req, res, next, id) {
  mongoose.model('Day')
    .findOne({ dayNum: Number(id) })
    .exec()
    .then(function(day) {
      if(!day) throw new Error('not found')
      req.day = day
      next()
    })
    .then(null, next)
})

//Answer:
// var express = require('express')
// var router = express.Router()
// var mongoose = require('mongoose')
// module.exports = router

// // // list all days
// router.get('/', function (req, res, next) {
//   mongoose.model('Day')
//     .find()
//     // .populate('thingsToDo restaurants hotels')
//     .exec()
//     .then(function(days) {
//       res.json(days)
//     })
//     .then(null, next)
// })

// // //get one day
// // router.get('/:dayId')

// // //update a day
// // router.put('/:dayId')

// router.use('/:id/activities', require('./activities'))

// // delete a day
// router.delete('/:id')

// // add day
// router.post('/', function(req, res, next) {
//   mongoose
//     .model('Day')
//     .create(req.body)
//     .then(function(day) {
//       res.json(day)
//     })
//     .then(null, next)
// })



// router.param('id', function(req, res, next, id) {
//   mongoose.model('Day')
//     .findOne({ dayNum: Number(id) })
//     .exec()
//     .then(function(day) {
//       if(!day) throw new Error('not found')
//       req.day = day
//       next()
//     })
//     .then(null, next)
// })

// adding an activity to a day
// body { type: 'hotels', id: 'asdlkfjsadflkjadfslkj' }


// router.post('/', function(req, res, next) {
//   console.log('req body', req.body)
//   console.log('req day', req.day)
//   req.day[req.body.type].addToSet(req.body.id)
//   req.day.save()
//     .then(function(day) {
//       res.sendStatus(201)
//     })
//     .then(null, next)
//   // push the activity id into the correct field in the document
//   // save the day
//   // send a response
// })

// router.delete('/:activityId')