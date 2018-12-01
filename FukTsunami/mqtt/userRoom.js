function UserRoom(){
	this.users = [];
}

UserRoom.prototype = {
	addUser: function(userInfo){
		var self = this;
		return new Promise(
      function (resolve, reject) {
        var userDevice = new User(userInfo);
        self.users.push(userDevice);
        resolve(true);
      });
  },
  
	removeUser: function(userId) {
		var self = this;
		this.users = this.users.filter( function(drone){return drone.id != userId} );
	},

	receiveData: function(dataNewLog) {
    var self = this;
		var userExist = _.findWhere(self.users, {id: dataNewLog.id}); 
		if (userExist === undefined) {
			return new Promise(function(resolve, reject){
				self.addUser({
          id: dataNewLog.id,
          lat: dataNewLog.lat,
          lng: dataNewLog.lng,
        }).then(status => function(){
						if(status){
							resolve(true);
						}
					});
			});
		} else {
			userExist.update(dataNewLog);
		}
  },
  
}