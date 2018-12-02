function User(userInfo) {
  this.id = userInfo.id
  this.lat = parseFloat(userInfo.lat)
  this.lng = parseFloat(userInfo.lng)

  this.NUM_DELTAS = 100;
  this.DELAY
  this.COUNTER_DELTA = 1
  this.DELTA_LAT
  this.DELTA_LNG
  this.CURRENT_POSITION_LAT
  this.CURRENT_POSITION_LNG

  this.SENSOR_MARKER;

  this.SENSOR_ICON;
  this.DANGER_RIPPLE_RADIUS = 100;
  this.SAFETY_RIPPLE_RADIUS = 100;

  this.IMG_USER = 'https://firebasestorage.googleapis.com/v0/b/a-trung-roi.appspot.com/o/user-ha.png?alt=media&token=9bdc3a87-4694-4826-a85b-db9802b03976';

  this.materialize();
}

User.prototype = {
  materialize: function () {
    var self = this;
    self.drawUserMarker();
  },

  drawUserMarker: function () {
    var self = this;
    this.SENSOR_ICON = {
      url: this.IMG_USER,
      // fillColor: '#'+this.COLOR
      fillOpacity: 1,
      strokeColor: '#fff',
      strokeWeight: 1,
      anchor: new google.maps.Point(10, 10),
      origin: new google.maps.Point(0, 0),
      scaledSize: new google
        .maps
        .Size(20, 20),
      scale: 1,
      rotation: 0,
    };

    var latlng_start = new google.maps.LatLng(this.lat, this.lng);
    this.SENSOR_MARKER = new google.maps.Marker({
      position: latlng_start,
      map: map,
      draggable: false,
      icon: this.SENSOR_ICON,
      zIndex: 4,
      optimized: false
    });
    this.SENSOR_MARKER.setMap(map);

  },

  update: function (newData) {
    var self = this;
    if (this.SENSOR_ICON !== undefined) {
      // Update Sensor Data

    }
  },

  removeDroneMarker: function () {
    var self = this;
    if (this.DRONE_MARKER.getMap() != null)
      this.DRONE_MARKER.setMap(null);
    if (this.DRONE_MARKER.safetyZone.getMap() !== null)
      this.DRONE_MARKER.safetyZone.setMap(null);
    if (this.DRONE_MARKER.dangerousZone.getMap() !== null)
      this.DRONE_MARKER.dangerousZone.setMap(null);
    if (this.DRONE_ELEMENT != undefined) {
      if (typeof this.DRONE_ELEMENT.remove == 'function') {
        this.DRONE_ELEMENT.remove();
      } else {
        this.DRONE_ELEMENT.outerHTML = '';
      }
    }
  },
}