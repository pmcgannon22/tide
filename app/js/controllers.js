var tide = angular.module('Tide', []);

tide.filter('capitalized', function() {
	return function(input, scope) {
		if(input != null){
			console.log(input);
			return input.substring(0,1).toUpperCase();
		}
	}
});

tide.factory('socket', function($rootScope){
	var socket = io.connect();
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

tide.controller('ChatCtrl', function($scope, socket) {
	$scope.selected = null;
	/*
	$scope.messages = [
		{
			"name" : "Tilo Mitra",
			"subject" : "Hello from Toronto",
			"text" : "Hey, I just wanted to check in with you from Toronto. I got here earlier today."
		},
		{
			"name" : "ERIC FERRAIUOLO",
			"subject" : "Re: Pull Requests",
			"text" : "Hey, I had some feedback for pull request #51. We should center the menu so it looks better on mobile."
		},
		{
			"name" : "YUI LIBRARY",
			"subject" : "You have 5 bugs assigned to you",
			"text" : "Duis aute irure dolor in reprehenderit in voluptate velit essecillum dolore eu fugiat nulla."
			
		},
		{
			"name" : "REID BURKE",
			"subject" : "Re: Design Language",
			"text" : "Excepteur sint occaecat cupidatat non proident, sunt in culpa."
		}
	];
	
	$scope.chats = [
		{
			"name" : "Pat",
			"time" : "12:20pm",
			"text" : "That was an awesome party last night!"
		},
		{
			"name" : "John",
			"time" : "3:20am",
			"text" : "I agree. I had the best time :)"
		}
	];
	*/
	$scope.chats = []
	
	$scope.filterChannel = function(chat) {
		return (chat.channel == $scope.currentChannel  && chat.channel != '');
	};
	
	$scope.submitDisabled = function() {
		return ($scope.chatbox == "" || $scope.chatbox == undefined || $scope.currentChannel == "" || $scope.currentChannel == undefined || $scope.username == "" || $scope.username == undefined);
	}
	
	
	$scope.onPostChat = function() {
		console.log('New chat.');
		var newChat = {
			text: $scope.chatbox,
			user: $scope.username,
			channel: $scope.currentChannel,
			time: "2:40am"
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
});