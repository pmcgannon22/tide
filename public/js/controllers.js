var tideControllers = angular.module('tideControllers',[]);

tideControllers.controller('ChatCtrl', ['$scope','$rootScope','$routeParams', '$http', 'socket', 
	
	function($scope, $rootScope, $routeParams, $http, socket) {
		$rootScope.currentChannel = $routeParams.channelName;
		
		if($rootScope.currentChannel) {
			$http.get('data/' + $rootScope.currentChannel).success(function(data) {
				console.log("data/" + $rootScope.currentChannel + " returned: " + data);
				$scope.chats = data.messages == null ? [] : data.messages;
			});
		}
		
        //delete?
		$scope.filterChannel = function(chat) {
			return chat.channel == $rootScope.currentChannel;
		};
		
		$scope.submitDisabled = function() {
			return ($scope.chatbox == "" || $scope.chatbox == undefined  || $scope.username == "" || $scope.username == undefined);
		}
		
		$scope.onPostChat = function() {
            var newChat = {
				content: $scope.chatbox,
				user: $scope.username,
				channel: $scope.currentChannel,
			};
			$scope.chatbox = "";
			socket.emit('postChat', newChat);
		};
		
		socket.on('onPostChat', function(data){
			$scope.chats.push(data);
			var objDiv = document.getElementById("chatarea");
			objDiv.scrollTop = objDiv.scrollHeight;
		});
		
		//delete?
		$scope.active = function(message) {
			$scope.selected = message;
		}
	}
]);


tideControllers.controller('ChannelListCtrl',['$scope','$rootScope','$location', '$http', 'socket', 
	function($scope, $rootScope, $location, $http, socket) {
		$scope.showNewChannelForm = false;
		$scope.channels = [];
		
		//used to handle clicking on a channel that is already in the sidebar
		$scope.activate = function(channel) {
			$location.path("/channel/" + channel);
		}
		
		// adds the channel to channel list, so that it will show up in the sidebar.
		// Changes the location to allow the router to delegate to the ChatCtrl to load in chat frame. 
		$scope.setNewChannel = function(channel) {
			$scope.newChannel = "";
			$scope.showNewChannelForm = false;
			$http.get('data/' + channel).success(function(data) {
				var newChannel = { name: channel, lastMessage: { content: '', created: '', user: ''} };
				if(data.messages) {
					newChannel = {
						name: data.name,
						lastMessage: data.messages[data.messages.length - 1]
					};
				}
				
				$scope.channels.push(newChannel);
			});
			$location.path("/channel/" + channel);
		}
}]);