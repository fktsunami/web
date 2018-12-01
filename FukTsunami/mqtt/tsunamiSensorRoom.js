function TsunamiSensorRoom(){
	this.tsunamiSensors = [];
}

TsunamiSensorRoom.prototype = {
	addSensor: function(sensor){
		var self = this;
		return new Promise(
      function (resolve, reject) {
        var tsunamiSensor = new TsunamiSensor(sensor);
        self.tsunamiSensors.push(tsunamiSensor);
        resolve(true);
      });
  },
  
	removeDrone: function(datelistID) {
		var self = this;
		this.tsunamiSensors = this.drones.filter( function(drone){return drone.id != datelistID} );
	},

	receiveData: function(dataNewLog) {
    var self = this;
		var sensorExist = _.findWhere(self.tsunamiSensors, {id: dataNewLog.id}); 
		if (sensorExist === undefined) {
			return new Promise(function(resolve, reject){
				self.addSensor({
          id: dataNewLog.id,
          lat: dataNewLog.lat,
          lng: dataNewLog.lng,
          gatewayId: dataNewLog.gatewayId,
          force: dataNewLog.force,
          gyroscope: dataNewLog.gyroscope,
        }).then(status => function(){
						if(status){
							resolve(true);
						}
					});
			});
		} else {
			sensorExist.update(dataNewLog);
		}
  },
  
}