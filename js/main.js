function ChatCtrl($scope) {
	$scope.messages = [];
	
	$scope.sendMessage = function() {
		
		$scope.messages.push({"text": $scope.messageText, "user": $scope.username});
		$scope.messageText = "";
	}
	
}