var tideControllers = angular.module('tideControllers',[]);

tideControllers.controller('ChatCtrl', ['$scope','$rootScope','$routeParams', '$http', 'socket', 
	
	function($scope, $rootScope, $routeParams, $http, socket) {
		$rootScope.currentChannel = $routeParams.channelName;
		$scope.chats = [];
		
		if($rootScope.currentChannel) {
			//socket.emit('unsubscribeAll', {});
			//Tell server that I am interested in the messages from this channel.
			socket.emit('subscribe', $rootScope.currentChannel);	
			
			//Get the channel's chat history from the server
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
			if(data.channel == $rootScope.currentChannel) {
				$scope.chats.push(data.message);
			}
		});
	}
]);


tideControllers.controller('ChannelListCtrl',['$scope','$rootScope','$location', '$http', 'socket', 
	function($scope, $rootScope, $location, $http, socket) {
		$scope.showNewChannelForm = false;
		$scope.channels = [];
		
		//used to handle clicking on a channel that is already in the sidebar
		$scope.activate = function(channel) {
			channel.unread = 0;
			$location.path("/channel/" + channel.name);
		}
		
		// adds the channel to channel list, so that it will show up in the sidebar.
		// Changes the location to allow the router to delegate to the ChatCtrl to load in chat frame. 
		$scope.setNewChannel = function(channel) {
			socket.emit('subscribe', channel);
			$scope.newChannel = "";
			$scope.showNewChannelForm = false;
			$http.get('data/' + channel).success(function(data) {
				var newChannel = { 
					name: channel, 
					lastMessage: { content: '', created: '', user: ''},
					unread: 0	
				};
				if(data.messages) {
					newChannel = {
						name: data.name,
						lastMessage: data.messages[data.messages.length - 1],
						unread: 0
					};
				}
				
				
				//TODO: Just don't put in here if it is a duplicate. Or replace to get updated data.
				$scope.channels.push(newChannel);
			});
			$location.path("/channel/" + channel);
		}
		
		//$scope.unreadMessageText = function
		
		
		socket.on('onPostChat', function(data) {
			if(data.channel != $rootScope.currentChannel) {
				for(var i=0; i < $scope.channels.length; i++) {
					if(data.channel == $scope.channels[i].name) {
						$scope.channels[i].unread += 1;
						$scope.channels[i].lastMessage = data.message
					}
				}
			}
		});
}]);