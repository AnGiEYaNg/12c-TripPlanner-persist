var data = {
  restaurants: {},
  hotels: {},
  thingsToDo: {},
  get: function(type, id) {
    return this[type][id]
  }
};



['hotels', 'restaurants', 'thingsToDo']
  .forEach(function(collection) {
    rawData[collection].forEach(function(h) {
      data[collection][h._id] = h
    })
  })
