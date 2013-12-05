var tideControllers = angular.module('tideControllers',[]);


/*
ChatCtrl is the controller for the main chat area, where the current channel's messages go.
It handles:
	- pushing a message to the server after it has been sent. 
	- pushing a message to the screen after the response from the server is received. 
	- loading a channel, including retrieving its former messages. 
*/
tideControllers.controller('ChatCtrl', ['$scope','$rootScope','$routeParams', '$http', 'socket', 
	
	function($scope, $rootScope, $routeParams, $http, socket) {
		if($rootScope.currentChannel) 
			socket.emit('leave-channel', {channel: $rootScope.currentChannel, username: $rootScope.currentUser});
		$rootScope.currentChannel = $routeParams.channelName;
		$scope.chats = [];
		
		if($rootScope.currentChannel) {
			//socket.emit('unsubscribeAll', {});
			//Tell server that I am interested in the messages from this channel.
			socket.emit('subscribe', $rootScope.currentChannel);
			socket.emit('enter-channel', 
				{channel: $rootScope.currentChannel, username: $rootScope.currentUser}
			);	
			
			//Get the channel's chat history from the server
			$http.get('data/' + $rootScope.currentChannel).success(function(data) {
				console.log("data/" + $rootScope.currentChannel + " returned: " + data);
				$scope.chats = data.messages == null ? [] : data.messages;
			});
		}
		
		//Don't allow chat submission if no message entered. 
		$scope.submitDisabled = function() {
			return ($scope.chatbox == "" || $scope.chatbox == undefined);
		}
		
		//Send chat to server. 
		$scope.onPostChat = function() {
            var newChat = {
				content: $scope.chatbox,
				user: $rootScope.currentUser,
				channel: $scope.currentChannel,
			};
			$scope.chatbox = "";
			socket.emit('postChat', newChat);
		};
		
		//Handles a received chat from the server. 
		socket.on('onPostChat', function(data){
			if(data.channel == $rootScope.currentChannel) {
				$scope.chats.push(data.message);
			}
		});
	}
]);

/*
ChannelListCtrl is the controller for the channel list sidebar. 
It handles:
	- click events for changing channel and telling the ChatCtrl controller to reload the channel.
	- processing, updating, and notifying the user of the most recent message in the channel box. 
	- adding/removing channels and loading the added channel. 
*/
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
		
		$scope.removeChannel = function(channel) {
			if($rootScope.currentChannel == channel) {
				alert("You are not allowed to delete the active channel.");
				return;
			}
			if(confirm("Are you sure you want to remove '" + channel + "'?")) {
				socket.emit('unsubscribe', channel);
				for(var i = 0; i < $scope.channels.length; i++){
					if($scope.channels[i].name == channel) {
						$scope.channels.splice(i, 1);
						break;
					}
				}
			}
		}
		
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
		
		socket.on('disconnect', function() {
			console.log('disconnect fired');
			socket.emit('leave-channel', {channel: $rootScope.currentChannel, username: $rootScope.currentUser});
		});
		
		// Initialize username and current channel with the session data of the server. 
		if(!$rootScope.currentUser) {
			$http.get('/session-data/').success(function(data) {
				$rootScope.currentUser = data.username;
				$scope.setNewChannel(data.channel);
			})
		}
}]);

/*
ActiveUserCtrl is the controller that handles the current channel's active user list. 
It handles:
	- notifying the server that the client has entered/left a channel.
	- notifying the server that the client has disconnected from the server.
	- processing the above notifications from other clients and updating the list accordingly. 
*/
tideControllers.controller('ActiveUserCtrl', ['$scope', '$rootScope', 'socket',
	function($scope, $rootScope, socket) {
	
		$scope.activeChannelUsers = [];
	
		socket.on('activeUserList', function(data) {
			$scope.activeChannelUsers = data;	
		});
		
		socket.on('newActiveUser', function(data) {
			if(data.channel == $rootScope.currentChannel) {
				$scope.activeChannelUsers.push(data.username);
			}
		});
		
		socket.on('activeUserLeft', function(data) {
			if(data.channel == $rootScope.currentChannel) {
				var index = $scope.activeChannelUsers.indexOf(data.username);
				if(index >= 0)
					$scope.activeChannelUsers.splice(index, 1);
			}
		});
	}]
);