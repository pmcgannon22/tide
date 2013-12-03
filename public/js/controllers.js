var tideControllers = angular.module('tideControllers',[]);

tideControllers.controller('ChatCtrl', ['$scope','$rootScope','$routeParams', '$http', 'socket', 
	
	function($scope, $rootScope, $routeParams, $http, socket) {
		$rootScope.currentChannel = $routeParams.channelName;
		
		if($rootScope.currentChannel) {
			$http.get('data/' + $rootScope.currentChannel).success(function(data) {
				console.log("data/" + $rootScope.currentChannel + " returned: " + data);
				$scope.chats = data.messages;
			});
		}
		
		$scope.filterChannel = function(chat) {
			return chat.channel == $rootScope.currentChannel;
		};
		
		$scope.submitDisabled = function() {
			return ($scope.chatbox == "" || $scope.chatbox == undefined  || $scope.username == "" || $scope.username == undefined);
		}
		
		$scope.onPostChat = function() {
			var d = new Date();
			var currentTime = d.toLocaleTimeString();
			currentTime = currentTime.substr(0, 5);
			var newChat = {
				text: $scope.chatbox,
				user: $scope.username,
				channel: $scope.currentChannel,
				time: currentTime
			};
			$scope.chats.push(newChat);
			$scope.chatbox = "";
			socket.emit('postChat', newChat);
		};
		
		socket.on('onPostChat', function(data){
			$scope.chats.push(data);
		});
		
		
		$scope.active = function(message) {
			$scope.selected = message;
		}
	}
]);


tideControllers.controller('ChannelListCtrl',['$scope','$rootScope','$location', '$http', 'socket', 
	function($scope, $rootScope, $location, $http, socket) {
		$scope.channels = [];
		$scope.activate = function(channel) {
			$location.path("/channel/" + channel);
		}
		
		$scope.setNewChannel = function(channel) {
			$http.get('data/' + channel).success(function(data) {
				console.log(data);
				$scope.channels.push(data);
			});
			$location.path("/channel/" + channel);
		}
}]);