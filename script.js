$(document).ready(function () {
  $("#scroll-list").niceScroll();
});

let markers = [];
let myMap;
let activeItem = false;
let hoveredItem = false;

const country = [
  ['Germany', 51.079815, 9.785579 ],
  ['Latvia', 56.588891, 24.772286],
  ['Czech Republic', 50.074108, 14.436347],
  ['Italy', 41.959209, 12.903636]
];

const centerDefault = {lat:  country[0][1], lng:  country[0][2]};

const renderMap = function(center, zoom ) {
  const element = document.getElementById('map');
  const options = {
    center: center,
    zoom: zoom
  };
  return new google.maps.Map(element, options);
};

const renderMarkers = function (list) {
  const markers = [];
  for(let i = 0; i < list.length; i++ ) {
    const position = new google.maps.LatLng(list[i][1], list[i][2]);
    markers.push(new google.maps.Marker({
      position: position,
      map: myMap,
      title: list[i][0]
    }))
  }
  for(let i = 0; i < list.length; i++ ) {
    const infoWindow = new google.maps.InfoWindow({
      content: '<span>' + list[i][0] + '</span>'
    });
    markers[i].addListener('click', function () {
      infoWindow.open(myMap, markers[i]);
    })
  }
  return markers;
};

$( ".items" ).on( "mouseenter", "a", function(e) {
  const id = $(this).closest('li').data('id');
  hoveredItem = id + 1;
  if (hoveredItem !== activeItem) {
    for(let i = 0; i < markers.length; i++ ) {
      markers[i].setMap(null);
    }
    markers = renderMarkers([country[id]]);
    myMap.setCenter(markers[0].getPosition());
    myMap.setZoom(7);
  }
});

$( ".items" ).on( "mouseout", "a", function() {
  if (hoveredItem !== activeItem) {
    if (activeItem) {
      for(let i = 0; i < markers.length; i++ ) {
        markers[i].setMap(null);
      }
      markers = renderMarkers([country[activeItem - 1]]);
    } else {
      for(let i = 0; i < markers.length; i++ ) {
        markers[i].setMap(null);
      }
      markers = renderMarkers(country);
    }
    myMap.setCenter(markers[0].getPosition());
    myMap.setZoom(6);
  }
});

$( ".items" ).on( "click", "a", function(e) {
  e.preventDefault();
  const id = $(this).closest('li').data('id');
  activeItem = id + 1;

  $('.items a').removeClass('active');
  $(this).addClass('active');

  if (hoveredItem !== activeItem) {
    for(let i = 0; i < markers.length; i++ ) {
      markers[i].setMap(null);
    }
    markers = renderMarkers([country[id]]);
    myMap.setCenter(markers[0].getPosition());
    myMap.setZoom(6);
  }
});

function initMap() {
  myMap = renderMap(centerDefault, 6);
  markers = renderMarkers(country);
}