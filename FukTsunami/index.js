var map;

function initMap() {
  map = new google
    .maps
    .Map(document.getElementById('map'), {
      zoom: 11,
      center: new google
        .maps
        .LatLng(15.987012, 108.324270),
      mapTypeId: 'roadmap'
    });

  var iconBase = 'http://maps.google.com/mapfiles/kml/paddle/';
  var icons = {
    statusRed: {
      name: 'statusRed',
      icon: iconBase + 'red-circle.png',
      url: iconBase + 'red-circle.png', // url
      scaledSize: new google
        .maps
        .Size(30, 30), // scaled size
      origin: new google
        .maps
        .Point(0, 0), // origin
      anchor: new google
        .maps
        .Point(0, 0) // anchor
    },
    statusBlue: {
      name: 'statusBlue',
      icon: iconBase + 'blu-circle.png',
      url: iconBase + 'blu-circle.png',
      scaledSize: new google
        .maps
        .Size(30, 30), // scaled size
      origin: new google
        .maps
        .Point(0, 0), // origin
      anchor: new google
        .maps
        .Point(0, 0) // anchor
    },
    statusGreen: {
      name: 'statusGreen',
      icon: iconBase + 'grn-circle.png',
      url: iconBase + 'grn-circle.png',
      scaledSize: new google
        .maps
        .Size(30, 30), // scaled size
      origin: new google
        .maps
        .Point(0, 0), // origin
      anchor: new google
        .maps
        .Point(0, 0) // anchor
    }
  };

  var features = [
    {
      position: new google
        .maps
        .LatLng(16.061281, 108.285432),
      type: 'statusRed'
    }, {
      position: new google
        .maps
        .LatLng(16.102878, 108.318747),
      type: 'statusRed'
    }, {
      position: new google
        .maps
        .LatLng(15.998564, 108.282701),
      type: 'statusBlue'
    }, {
      position: new google
        .maps
        .LatLng(15.945672, 108.349546),
      type: 'statusBlue'
    }, {
      position: new google
        .maps
        .LatLng(15.999849, 108.404272),
      type: 'statusGreen'
    }, {
      position: new google
        .maps
        .LatLng(16.075236, 108.399794),
      type: 'statusGreen'
    }, {
      position: new google
        .maps
        .LatLng(15.991977, 108.466355),
      type: 'statusGreen'
    }
  ];

  // Create polyline
  var flightPlanCoordinates = [
    {
      lat: 16.061281,
      lng: 108.285432
    }, {
      lat: 16.102878,
      lng: 108.318747
    }, {
      lat: 15.945672,
      lng: 108.349546
    }, {
      lat: 15.999849,
      lng: 108.404272
    }
  ];

  console.log("position", features[0].position.lat);
  var flightPath = new google
    .maps
    .Polyline({path: flightPlanCoordinates, geodesic: true, strokeColor: '#FF0000', strokeOpacity: 1.0, strokeWeight: 2});

  flightPath.setMap(map);

  // Create markers.
  features.forEach(function (feature) {
    var marker = new google
      .maps
      .Marker({
        position: feature.position,
        icon: icons[feature.type],
        map: map
      });
  });

  var legend = document.getElementById('legend');
  for (var key in icons) {
    var type = icons[key];
    var name = type.name;
    var icon = type.icon;
    var div = document.createElement('div');
    div.innerHTML = '<img src="' + icon + '"> ' + name;
    legend.appendChild(div);
  }

  map
    .controls[google.maps.ControlPosition.RIGHT_BOTTOM]
    .push(legend);
}