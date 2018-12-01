function TsunamiSensor(sensorInfo){
  this.id             = sensorInfo.id
  this.lat            = parseFloat(sensorInfo.lat)
  this.lng            = parseFloat(sensorInfo.lng)
  this.gatewayId      = sensorInfo.gatewayId
  this.force          = sensorInfo.force
  this.gyroscope      = sensorInfo.gyroscope

  this.NUM_DELTAS = 100;
  this.DELAY
  this.COUNTER_DELTA = 1
  this.DELTA_LAT
  this.DELTA_LNG
  this.CURRENT_POSITION_LAT
  this.CURRENT_POSITION_LNG

  this.SENSOR_MARKER;

  this.SENSOR_ICON;

  this.CIRCLE_ZONE = {
      // fillColor: '#3bac40',
      // fillOpacity: 0.2,
      // strokeWeight: 0,
      // map: map,
      // radius: SAFETY_RADIUS,
      // zIndex: 1,
      // optimized: false
  }

  this.materialize();
}

TsunamiSensor.prototype = {
  materialize: function(){
    var self = this;
    self.drawDroneMarker();
  },

  drawDroneMarker: function(){
      var self = this;
      this.SENSOR_ICON = {
        path: "M19,21.9L19,21.9l11,6.7L18,2L6,28.6l11-6.7l0,0C17.6,21.5,18.4,21.5,19,21.9z",
            // fillColor: '#'+this.COLOR,
            fillOpacity: 1,
            strokeColor: '#fff',
            strokeWeight: 1,
            anchor: new google.maps.Point(18,18),
            origin: new google.maps.Point(0,0),
            size: new google.maps.Size(36, 36),
            scale: 1,
            rotation: 0,
      };

      var latlng_start = new google.maps.LatLng(this.lat,this.lng);
      this.SENSOR_MARKER = new google.maps.Marker({
          position: latlng_start,
          map: map,
          draggable:false,
          icon: this.SENSOR_ICON,
          zIndex: 4,
          optimized: false
      });
      this.SENSOR_MARKER.setMap(map);
      var circleZone = new google.maps.Circle(this.SAFETY_ZONE);
      circleZone.bindTo('center', this.SENSOR_MARKER, 'position');

      this.SENSOR_MARKER.circleZone = circleZone;
  },

  update: function(newData){
      var self = this;
      if(this.SENSOR_ICON !== undefined){
        // Update Sensor Data
      }
  },

  removeDroneMarker: function(){
      var self = this;
      if(this.DRONE_MARKER.getMap() != null)
          this.DRONE_MARKER.setMap(null);
      if(this.DRONE_MARKER.safetyZone.getMap() !== null)
          this.DRONE_MARKER.safetyZone.setMap(null);
      if(this.DRONE_MARKER.dangerousZone.getMap() !== null)
          this.DRONE_MARKER.dangerousZone.setMap(null);
      if(this.DRONE_ELEMENT != undefined){
          if(typeof this.DRONE_ELEMENT.remove == 'function'){
              this.DRONE_ELEMENT.remove();
          }else{
             this.DRONE_ELEMENT.outerHTML='';
          }
      }
  },
}
