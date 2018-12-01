var map;

/**
 * @param {String} status Include: normal and alert
 * @param {Integer} radius Radius ripple 
 */
function rippleEffect(status, radius) {
  let url = './assets/icons/ripple.svg';
  
  if (status === 'alert') {
    url = './assets/icons/ripple-red.svg';
  }

  var iconRipples = {
    statusRed: {
      name: 'statusRed',
      url: url,
      scaledSize: new google
        .maps
        .Size(radius, radius),
      origin: new google
        .maps
        .Point(0, 0),
      anchor: new google
        .maps
        .Point(radius /2, radius/2)
    },
    statusYellow: {
      name: 'statusYellow',
      url: url,
      scaledSize: new google
        .maps
        .Size(radius, radius),
      origin: new google
        .maps
        .Point(0, 0),
      anchor: new google
        .maps
        .Point(radius/2, radius/2)
    },
    statusGreen: {
      name: 'statusGreen',
      url: url,
      scaledSize: new google
        .maps
        .Size(radius, radius),
      origin: new google
        .maps
        .Point(0, 0),
      anchor: new google
        .maps
        .Point(radius/2, radius/2)
    }
  };

  return iconRipples;
}

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
      url: './assets/icons/lifebuoy-red.svg', // url
      scaledSize: new google
        .maps
        .Size(20, 20), // scaled size
      origin: new google
        .maps
        .Point(0, 0), // origin
      anchor: new google
        .maps
        .Point(10, 10) // anchor
    },
    statusYellow: {
      name: 'statusYellow',
      url: './assets/icons/lifebuoy-yellow.svg',
      scaledSize: new google
        .maps
        .Size(20, 20),
      origin: new google
        .maps
        .Point(0, 0),
      anchor: new google
        .maps
        .Point(10, 10)
    },
    statusGreen: {
      name: 'statusGreen',
      url: './assets/icons/lifebuoy-green.svg',
      scaledSize: new google
        .maps
        .Size(20, 20),
      origin: new google
        .maps
        .Point(0, 0),
      anchor: new google
        .maps
        .Point(10, 10)
    }
  };

  var iconRipples = {
    statusRed: {
      name: 'statusRed',
      url: './assets/icons/ripple.svg',
      scaledSize: new google
        .maps
        .Size(100, 100),
      origin: new google
        .maps
        .Point(0, 0),
      anchor: new google
        .maps
        .Point(50, 50)
    },
    statusYellow: {
      name: 'statusYellow',
      url: './assets/icons/ripple.svg',
      scaledSize: new google
        .maps
        .Size(100, 100),
      origin: new google
        .maps
        .Point(0, 0),
      anchor: new google
        .maps
        .Point(50, 50)
    },
    statusGreen: {
      name: 'statusGreen',
      url: './assets/icons/ripple.svg',
      scaledSize: new google
        .maps
        .Size(100, 100),
      origin: new google
        .maps
        .Point(0, 0),
      anchor: new google
        .maps
        .Point(50, 50)
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
      type: 'statusYellow'
    }, {
      position: new google
        .maps
        .LatLng(15.945672, 108.349546),
      type: 'statusYellow'
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

  // Define the LatLng coordinates for the polygon's path.
  var triangleCoords = [
    {
      lat: 16.061281,
      lng: 108.285432
    }, {
      lat: 15.998564,
      lng: 108.282701
    }, {
      lat: 15.999849,
      lng: 108.404272
    }, {
      lat: 15.991977,
      lng: 108.466355
    }
  ];

  // Construct the polygon.
  var bermudaTriangle = new google
    .maps
    .Polygon({
      paths: triangleCoords,
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35
    });
  bermudaTriangle.setMap(map);

  // Create polyline
  var flightPlanCoordinates = [
    {
      lat: 16.061281,
      lng: 108.285432
    }, {
      lat: 16.102878,
      lng: 108.318747
    }, {
      lat: 16.102878,
      lng: 108.349546
    }, {
      lat: 15.999849,
      lng: 108.404272
    }
  ];

  var flightPath = new google
    .maps
    .Polyline({path: flightPlanCoordinates, geodesic: true, strokeColor: '#FF0000', strokeOpacity: 1.0, strokeWeight: 2});

  // flightPath.setMap(map); Create markers.
  features.forEach(function (feature) {
    var marker = new google
      .maps
      .Marker({
        position: feature.position,
        icon: icons[feature.type],
        map: map,
        optimized: false
      });

    var markerRipple = new google
      .maps
      .Marker({
        position: feature.position,
        icon: rippleEffect('alert', 100)[feature.type],
        map: map,
        optimized: false
      });
  });

  var myoverlay = new google
    .maps
    .OverlayView();
  myoverlay.draw = function () {
    this
      .getPanes()
      .markerLayer
      .id = 'markerLayer';
  };
  myoverlay.setMap(map);
}