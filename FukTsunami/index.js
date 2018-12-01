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
        .Point(radius / 2, radius / 2)
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
        .Point(radius / 2, radius / 2)
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
        .Point(radius / 2, radius / 2)
    }
  };

  return iconRipples;
}


/**
 * Func create new marker in map with position
 * @param {Position} position 
 * @param {Icon} icon 
 * @param {Map} map 
 * @param {String} title 
 */

function createMarker(position, icon, map, title, message) {
  var marker = new google
  .maps
  .Marker({
    position: position,
    icon: icon,
    map: map,
    title: title,
    optimized: false
  });

  var infoWindow_1 = new google.maps.InfoWindow({
    content: '<i class="fas fa-file-signature" style="color:blue"></i>&nbsp&nbsp'+ message.gatewayId + '<br><br><i class="fas fa-map-marked-alt" style="color:red"></i>&nbsp&nbsp'
    + message.lat + '&nbsp&nbsp(lat)<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp'  + message.lng +
    '&nbsp&nbsp(lng)<br><br><i class="fas fa-fist-raised" style="color:green"></i>&nbsp&nbsp&nbsp&nbsp' +message.force 
  });

  google.maps.event.addListener(marker, 'click', function() { 
    infoWindow_1.open(map, marker);
  }); 

  return marker;  
}


var mapCenter = {
  lat: 15.987012,
  lng: 108.324270
};

function initMap() {
  map = new google
    .maps
    .Map(document.getElementById('map'), {
      zoom: 11,
      center: new google
        .maps
        .LatLng(15.987012, 108.324270),
        mapTypeId: 'hybrid',
        // scrollwheel: true,
        // mapTypeControl: true,
        // mapTypeControlOptions: {
        //     style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        //     position: google.maps.ControlPosition.LEFT_TOP
        // },
        zoomControl: true,
        zoomControlOptions: {
          style: google.maps.ZoomControlStyle.SMALL,
          position: google.maps.ControlPosition.LEFT_CENTER
        }
    });

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

  var arrNodeLifeBuoy = [];
  // List data from server
  // var arrNodeLifeBuoy = [
  //   {
  //     lat: 16.061281,
  //     lng: 108.285432,
  //     gatewayId: 'gateway001',
  //     force: 10, // Newton unit
  //     gyroscope: {
  //       x: 200,
  //       y: 400,
  //       z: 500
  //     }
  //   },
  //   {
  //     lat: 16.102878,
  //     lng: 108.318747,
  //     gatewayId: 'gateway002',
  //     force: 20,
  //     gyroscope: {
  //       x: 200,
  //       y: 400,
  //       z: 500
  //     }
  //   },
  //   {
  //     lat: 15.998564,
  //     lng: 108.282701,
  //     gatewayId: 'gateway003',
  //     force: 30,
  //     gyroscope: {
  //       x: 200,
  //       y: 400,
  //       z: 500
  //     }
  //   },
  //   {
  //     lat: 15.945672,
  //     lng: 108.349546,
  //     gatewayId: 'gateway004',
  //     force: 40,
  //     gyroscope: {
  //       x: 200,
  //       y: 400,
  //       z: 500
  //     }
  //   },
  //   {
  //     lat: 15.999849,
  //     lng: 108.404272,
  //     gatewayId: 'gateway005',
  //     force: 50,
  //     gyroscope: {
  //       x: 200,
  //       y: 400,
  //       z: 500
  //     }
  //   },
  //   {
  //     lat: 16.075236,
  //     lng: 108.399794,
  //     gatewayId: 'gateway006',
  //     force: 60,
  //     gyroscope: {
  //       x: 200,
  //       y: 400,
  //       z: 500
  //     }
  //   },
  //   {
  //     lat: 15.991977,
  //     lng: 108.466355,
  //     gatewayId: 'gateway007',
  //     force: 70,
  //     gyroscope: {
  //       x: 200,
  //       y: 400,
  //       z: 500
  //     }
  //   },
  // ]

  // // Handle update status with force
  // arrNodeLifeBuoy.forEach(function(item) {
  //   item.position = new google.maps.LatLng(item.lat, item.lng);
  //   if (item.force > 0 && item.force < 30) {
  //     item.type = 'statusGreen';
  //   } else if (item.force < 50) {
  //     item.type = 'statusYellow';
  //   } else {
  //     item.type = 'statusRed';
  //   }
  // });

  // // Define the LatLng coordinates for the polygon's path.
  // var triangleCoords = [
  //   {
  //     lat: 16.061281,
  //     lng: 108.285432
  //   }, {
  //     lat: 15.998564,
  //     lng: 108.282701
  //   }, {
  //     lat: 15.999849,
  //     lng: 108.404272
  //   }, {
  //     lat: 15.991977,
  //     lng: 108.466355
  //   }
  // ];

  // // Construct the polygon.
  // var bermudaTriangle = new google
  //   .maps
  //   .Polygon({
  //     paths: triangleCoords,
  //     strokeColor: '#FF0000',
  //     strokeOpacity: 0.8,
  //     strokeWeight: 2,
  //     fillColor: '#FF0000',
  //     fillOpacity: 0.35
  //   });
  // bermudaTriangle.setMap(map);

  // // Create polyline
  // var flightPlanCoordinates = [
  //   {
  //     lat: 16.061281,
  //     lng: 108.285432
  //   }, {
  //     lat: 16.102878,
  //     lng: 108.318747
  //   }, {
  //     lat: 16.102878,
  //     lng: 108.349546
  //   }, {
  //     lat: 15.999849,
  //     lng: 108.404272
  //   }
  // ];

  // var flightPath = new google
  //   .maps
  //   .Polyline({path: flightPlanCoordinates, geodesic: true, strokeColor: '#FF0000', strokeOpacity: 1.0, strokeWeight: 2});

  // flightPath.setMap(map); Create markers.

  var result = arrNodeLifeBuoy;
  result.forEach(function (feature) {
    this.createMarker(feature.position, icons[feature.type], map, 'marker', feature);
    this.createMarker(feature.position, rippleEffect('alert', 60)[feature.type], map, 'markerEffect', feature);
  });

}