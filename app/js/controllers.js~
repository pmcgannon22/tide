var tide = angular.module('Tide', []);

tide.controller('ChatCtrl', function($scope) {
	$scope.selected = null;
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
	
	$scope.active = function(message) {
		$scope.selected = message;
	}
});

/*
function ChatCtrl($scope) {
	$scope.messages = [];
	
	$scope.sendMessage = function() {
		
		$scope.messages.push({"text": $scope.messageText, "user": $scope.username});
		$scope.messageText = "";
	}
	
}*/