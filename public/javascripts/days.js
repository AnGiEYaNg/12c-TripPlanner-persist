var days = []
var currentDay
var Day = function() {
  this.dayNum = days.length + 1
  this.drawDayBtn()
  this.drawDayPanel()
  this.hotels = []
  this.restaurants = []
  this.thingsToDo = []
  this.markers = []
}

Day.prototype.clearMarkersFromMap = function() {
  this.markers.forEach(function(marker) {
    marker.setMap(null)
  })
}
Day.prototype.addMarkersToMap = function() {
  this.markers.forEach(function(marker) {
    marker.setMap(map)
  })
}

Day.prototype.drawDayPanel = function() {
  this.$dayPanel = templates.get('day-panel')
  this.$dayPanel.append(this.dayNum)
}

Day.prototype.addActivity = function(type, activity) {
  var $list = $('#itinerary  .' + type + '-group')
  $listItem = templates.get('itinerary-item')
  $listItem.find('.title').text(activity.name)
  $list.append($listItem)
  var marker = drawLocation(activity.place[0].location)
  this.markers.push(marker)
  //find the right ul
  //get a new template
  //populate it
  //put it in the right ul
}

Day.prototype.drawDayBtn = function() {
  var self = this

  var $dayBtn = templates.get('day-btn')//$('<button class="btn btn-circle day-btn">' + this.dayNum + '</button>')
  $dayBtn.text(this.dayNum)
  $('#add-day').before($dayBtn)

  $dayBtn.on('click', function() {
    if(currentDay) currentDay.clearMarkersFromMap()
    currentDay = self
    currentDay.addMarkersToMap()
    $('#itinerary #day-panel').replaceWith(self.$dayPanel)
  })
}

function loadDays() {
  $.ajax({
    type: "GET",
    url: '/days',
    success: function (returnedDays) {
      returnedDays.forEach(function (day) {
          var $dayBtn = templates.get('day-btn')
          $dayBtn.text(day.number)
          $('#add-day').before($dayBtn)
      });
      $('.day-buttons button:last-child').prev().toggleClass( "current-day");
      loadHotels();
      loadRes();
    }
  });
}


function loadHotels() {
  var currentDay = document.getElementsByClassName("current-day");
  console.log(currentDay);

  $.ajax({
    type: "GET",
    url: "/days/" + currentDay[0].innerText,
    success: function (day) {
      if (!day.hotel) {
        $('.hotels-group').append('<div class="itinerary-item"><span class="title" id="'+ day.hotel +'">' + $('[value='+day.hotel+']').text() + '</span><button class="btn btn-xs btn-danger remove btn-circle">x</button></div>');
      } 
    }
  });
}

function loadRes() {
  var currentDay = document.getElementsByClassName("current-day");
  console.log(currentDay);

  $.ajax({
    type: "GET",
    url: "/days/" + currentDay[0].innerText,
    success: function (day) {
      day.restaurants.forEach(function(restaurant){
        console.log(restaurant);
        $('.restaurants-group').append('<div class="itinerary-item"><span class="title" id="'+ restaurant +'">' + $('[value='+restaurant+']').text() + '</span><button class="btn btn-xs btn-danger remove btn-circle">x</button></div>');
      })
      
    }
  });
}

function loadThing() {
  var currentDay = document.getElementsByClassName("current-day");
  console.log(currentDay);

  $.ajax({
    type: "GET",
    url: "/days/" + currentDay[0].innerText,
    success: function (day) {
      day.thingsToDo.forEach(function(thing){
        $('.thingsTodo-group').append('<div class="itinerary-item"><span class="title" id="'+ thing +'">' + $('[value='+thing+']').text() + '</span><button class="btn btn-xs btn-danger remove btn-circle">x</button></div>');
      })
      
    }
  });
}


$('#add-day').on('click', function() {

  $.ajax({
    type: "POST",
    url: '/days',
    success: function (returnedDay) {
      var $dayBtn = templates.get('day-btn')
      $dayBtn.text(returnedDay)
      $('#add-day').before($dayBtn)
     // days.push(new Day());
    }
  });
});

$( ".day-buttons" ).delegate( "button", "click", function() {
      if (!this.id){
          $.ajax({
            type: "GET",
            url: '/days/'+this.innerText,
            success: function (returnedDay) {
              // console.log('current day is',returnedDay);
            }
          });

          $(this).siblings().removeClass("current-day");
          $('.hotels-group').children().remove();
          $('.restaurants-group').children().remove();
          $('.thingsToDo-group').children().remove();

          $(this).toggleClass( "current-day" );
          loadHotels();
          loadRes();
          loadThing();

          var ele = document.getElementById("day-title");
          $(ele).children("span").text( "Day "+ this.innerText);
      }
});

$( "#day-title" ).delegate( "button", "click", function() {

    var currentDay = document.getElementsByClassName("current-day");

      $.ajax({
        type: "DELETE",
        url: '/days/'+currentDay[0].innerText,
        success: function (day) {
          var lenOfArray = $(currentDay).nextAll().length - 1;
          for (var i = 0; i < lenOfArray; i++) {
            $(currentDay).nextAll()[i].innerText = parseInt($(currentDay).nextAll()[i].innerText) - 1;
          }
          $(currentDay).remove();
        }
      });
});

$('#hotel-adder button').on('click', function() {
  var currentDay = document.getElementsByClassName("current-day");
  var hotel_name = $("#hotel-adder select option:selected")[0].innerText;
  var hotel_id= $("#hotel-adder select option:selected")[0].value;

  
  $.ajax({
    type: "POST",
    url: "/days/" + currentDay[0].innerText + '/hotel',
    data: {
      day: currentDay[0].innerText,
      hotel_name: hotel_name,
      hotel_id: hotel_id
    },
    success: function (obj) {
      $('.hotels-group').append('<div class="itinerary-item"><span class="title" id="'+ obj.hotel_id +'">' + obj.hotel_name + '</span><button class="btn btn-xs btn-danger remove btn-circle">x</button></div>');
    }
  });
});

$('.hotels-group').delegate('button', 'click',function () {
  
  // console.log($(this).siblings()[0].id);
  var currentDay = document.getElementsByClassName("current-day");
  var id = $(this).siblings()[0].id;
  var self = this;

  $.ajax({
    type: "DELETE",
    url: "/days/" + currentDay[0].innerText + '/hotel',
    data: {
      day: currentDay[0].innerText,
      hotel_id: id
    },
    success: function (removedHotel) {
      $(self).parent().remove();
    }
  });
})

$('#restaurant-adder button').on('click', function() {
  var currentDay = document.getElementsByClassName("current-day");
  var restaurant_name = $("#restaurant-adder select option:selected")[0].innerText;
  var restaurant_id= $("#restaurant-adder select option:selected")[0].value;

  
  $.ajax({
    type: "POST",
    url: "/days/" + currentDay[0].innerText + '/restaurants',
    data: {
      day: currentDay[0].innerText,
      restaurant_name: restaurant_name,
      restaurant_id: restaurant_id
    },
    success: function (obj) {
      $('.restaurants-group').append('<div class="itinerary-item"><span class="title" id="'+ obj.restaurant_id +'">' + obj.restaurant_name + '</span><button class="btn btn-xs btn-danger remove btn-circle">x</button></div>');
    }
  });
});

$('.restaurants-group').delegate('button', 'click',function () {
  
  // console.log($(this).siblings()[0].id);
  var currentDay = document.getElementsByClassName("current-day");
  var id = $(this).siblings()[0].id;
  var self = this;

  $.ajax({
    type: "DELETE",
    url: "/days/" + currentDay[0].innerText + '/restaurants',
    data: {
      day: currentDay[0].innerText,
      hotel_id: id
    },
    success: function (removedHotel) {
      $(self).parent().remove();
    }
  });
})

$('#thingsToDo-adder button').on('click', function() {
  var currentDay = document.getElementsByClassName("current-day");
  var thing_name = $("#thingsToDo-adder select option:selected")[0].innerText;
  var thing_id= $("#thingsToDo-adder select option:selected")[0].value;

  
  $.ajax({
    type: "POST",
    url: "/days/" + currentDay[0].innerText + '/thingsToDo',
    data: {
      day: currentDay[0].innerText,
      thing_name: thing_name,
      thing_id: thing_id
    },
    success: function (obj) {
      $('.thingsTodo-group').append('<div class="itinerary-item"><span class="title" id="'+ obj.thing_id +'">' + obj.thing_name + '</span><button class="btn btn-xs btn-danger remove btn-circle">x</button></div>');
    }
  });
});

$('.thingsTodo-group').delegate('button', 'click',function () {
  
  // console.log($(this).siblings()[0].id);
  var currentDay = document.getElementsByClassName("current-day");
  var id = $(this).siblings()[0].id;
  var self = this;

  $.ajax({
    type: "DELETE",
    url: "/days/" + currentDay[0].innerText + '/thingsToDo',
    data: {
      day: currentDay[0].innerText,
      hotel_id: id
    },
    success: function (removedHotel) {
      $(self).parent().remove();
    }
  });
})

