function addInfoWindow(marker, message) {
    var infoWindow = new google.maps.InfoWindow({
        content: message
    });

    google.maps.event.addListener(marker, 'click', function () {
        infoWindow.open(map, marker);
    });
};

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

  this.SENSOR_MARKER_INFO = new google.maps.InfoWindow({
    content: '<div id="google-popup"><p><i class="fas fa-file-signature" style="color:blue; font-weight:both;"></i>&nbsp&nbsp'+ this.gatewayId + '</p><p><i class="fas fa-map-marked-alt" style="color:red"></i>&nbsp&nbsp'
    + this.lat + '&nbsp&nbsp(lat)&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp'  + this.lng +
    '&nbsp&nbsp(lng)</p><p><br><i class="fas fa-fist-raised" style="color:green"></i>&nbsp&nbsp&nbsp&nbsp' +this.force + '</p></div>',
  });

  this.SENSOR_ICON;
  this.DANGER_RIPPLE_RADIUS = 100;
  this.SAFETY_RIPPLE_RADIUS = 100;

  this.isDisplayedNotification = false;

//   this.IMG_SENSOR_RED = './assets/icons/lifebuoy-red.svg';
//   this.IMG_SENSOR_YELLOW = './assets/icons/lifebuoy-yellow.svg';
//   this.IMG_SENSOR_GREEN = './assets/icons/lifebuoy-green.svg';
  this.IMG_SENSOR_RED = 'https://firebasestorage.googleapis.com/v0/b/a-trung-roi.appspot.com/o/lifebuoy-red.svg?alt=media&token=c5631c81-1bb8-4943-a0e8-7efc0c365180';
  this.IMG_SENSOR_YELLOW = 'https://firebasestorage.googleapis.com/v0/b/a-trung-roi.appspot.com/o/lifebuoy-blue.svg?alt=media&token=25693eb4-4474-488d-a57f-783bc303da81';
  this.IMG_SENSOR_GREEN = 'https://firebasestorage.googleapis.com/v0/b/a-trung-roi.appspot.com/o/lifebuoy-green.svg?alt=media&token=3fd33d87-a2ab-42d7-bb4f-799294363711';

  this.DANGER_ZONE = {
    radius: this.DANGER_RIPPLE_RADIUS,
    name: 'redZone',
    // url: './assets/icons/ripple-red.svg',
    url: 'https://firebasestorage.googleapis.com/v0/b/a-trung-roi.appspot.com/o/ripple-red.svg?alt=media&token=975d2965-1b59-407e-8881-fdea6ca13990',
    scaledSize: new google
      .maps
      .Size(this.DANGER_RIPPLE_RADIUS, this.DANGER_RIPPLE_RADIUS),
    origin: new google
      .maps
      .Point(0, 0),
    anchor: new google
      .maps
      .Point(this.DANGER_RIPPLE_RADIUS / 2, this.DANGER_RIPPLE_RADIUS / 2)
  }

  this.SAFETY_ZONE = {
    radius: this.SAFETY_RIPPLE_RADIUS,
    name: 'redZone',
    // url: './assets/icons/ripple.svg',
    url: 'https://firebasestorage.googleapis.com/v0/b/a-trung-roi.appspot.com/o/ripple.svg?alt=media&token=28bc4292-60a9-45d3-8c3b-93a1d1ca72e9',
    scaledSize: new google
      .maps
      .Size(this.SAFETY_RIPPLE_RADIUS, this.SAFETY_RIPPLE_RADIUS),
    origin: new google
      .maps
      .Point(0, 0),
    anchor: new google
      .maps
      .Point(this.SAFETY_RIPPLE_RADIUS / 2, this.SAFETY_RIPPLE_RADIUS / 2)
}

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
    self.drawTsunamiMarker();
  },

  drawTsunamiMarker: function(){
      var self = this;
      this.SENSOR_ICON = {
          url: this.IMG_SENSOR_GREEN,
          // fillColor: '#'+this.COLOR
          fillOpacity: 1,
          strokeColor: '#fff',
          strokeWeight: 1,
          anchor: new google.maps.Point(10,10),
          origin: new google.maps.Point(0,0),
          scaledSize: new google
            .maps
            .Size(20, 20),
          // size: new google.maps.Size(36, 36),
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

      this.SENSOR_MARKER.addListener('click', function() {
        self.SENSOR_MARKER_INFO.open(map, self.SENSOR_MARKER);
      });

      var circleZone = new google.maps.Marker({
          position: latlng_start,
          map: map,
          draggable:false,
          icon: this.SAFETY_ZONE,
          zIndex: 3,
          optimized: false
      });
      circleZone.bindTo('center', this.SENSOR_MARKER, 'position');

      this.SENSOR_MARKER.circleZone = circleZone;

  },

  update: function (newData) {
      var self = this;
      if (this.SENSOR_ICON !== undefined) {
          // Update Sensor Data
          // Test demo foce > 10 => tsunami
          if (newData.force >= 0 && newData.force <= 5) {
            this.SENSOR_MARKER.setMap(null);
            this.SENSOR_ICON.url = this.IMG_SENSOR_GREEN;
            var latlng_start = new google.maps.LatLng(this.lat,this.lng);

            var circleZone = new google.maps.Marker({
                position: latlng_start,
                map: map,
                draggable: false,
                icon: this.SAFETY_ZONE,
                zIndex: 3,
                optimized: false
            });

            circleZone.bindTo('center', this.SENSOR_MARKER, 'position');

            this.SENSOR_MARKER.circleZone = circleZone;

            this.SENSOR_MARKER.icon = this.SENSOR_ICON;
            this.SENSOR_MARKER.setMap(map);

          }

          if (newData.force > 5 && newData.force < 10) {
            this.SENSOR_MARKER.setMap(null);
            this.SENSOR_ICON.url = this.IMG_SENSOR_YELLOW;
            var latlng_start = new google.maps.LatLng(this.lat,this.lng);

            var circleZone = new google.maps.Marker({
                position: latlng_start,
                map: map,
                draggable: false,
                icon: this.SAFETY_ZONE,
                zIndex: 3,
                optimized: false
            });

            circleZone.bindTo('center', this.SENSOR_MARKER, 'position');

            this.SENSOR_MARKER.circleZone = circleZone;

            this.SENSOR_MARKER.icon = this.SENSOR_ICON;
            this.SENSOR_MARKER.setMap(map);

          }

          if (newData.force >= 10) {
            //   Update change icon red lifeboud
            this.SENSOR_MARKER.setMap(null);
              this.SENSOR_ICON.url = this.IMG_SENSOR_RED;
              var latlng_start = new google.maps.LatLng(this.lat,this.lng);

              var circleZone = new google.maps.Marker({
                  position: latlng_start,
                  map: map,
                  draggable: false,
                  icon: this.DANGER_ZONE,
                  zIndex: 3,
                  optimized: false
              });

              circleZone.bindTo('center', this.SENSOR_MARKER, 'position');

              this.SENSOR_MARKER.circleZone = circleZone;

              this.SENSOR_MARKER.icon = this.SENSOR_ICON;

              this.SENSOR_MARKER.setMap(map);

                if (!this.isDisplayedNotification) {
                    var toast = toastr["error"]("Tsunami").css("margin-top", "80vh");
                    toast.options = {
                        "closeButton": false,
                        "debug": false,
                        "newestOnTop": false,
                        "progressBar": false,
                        "positionClass": "toast-bottom-right",
                        "preventDuplicates": false,
                        "onclick": null,
                        "showDuration": "0",
                        "hideDuration": "10000",
                        "timeOut": "0",
                        "extendedTimeOut": "1000",
                        "showEasing": "swing",
                        "hideEasing": "linear",
                        "showMethod": "fadeIn",
                        "hideMethod": "fadeOut"
                    }
                    toastr.remove(toast);
                    this.isDisplayedNotification = true;
                }
          }
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
