var tideServices = angular.module('tideServices',[]);

tideServices.factory('socket', function($rootScope){
	var socket = io.connect('http://ec2-50-17-79-69.compute-1.amazonaws.com:1337/',, {
		'sync disconnect on unload' : true
	});
	return {
		on: function(eventName, callback) {
			socket.on(eventName, function() {
				var args = arguments;
				$rootScope.$apply(function() {
					callback.apply(socket, args);
				});
			});
		},
		emit: function(eventName, data, callback) {
			socket.emit(eventName, data, function() {
				var args = arguments;
				$rootScope.$apply(function() {
					if(callback) {
						callback.apply(socket, args);
					}
				});
			});
		}
	};
});