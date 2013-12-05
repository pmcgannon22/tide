var tideDirectives = angular.module('tideDirectives',[]);

tideDirectives.directive('xngScroll', function() {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			scope.$watch('chats.length', function(old, updated) {
				var chats = document.getElementsByClassName('message-bubble');
				var last = chats[chats.length-1];
				if(last) {
					document.getElementById('chatarea').scrollTop = last.offsetTop;
				}
			});		
		}
	}
});

tideDirectives.directive('xngUploader', function() {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			console.log(element);
			element.bind('click', function(e) {
				document.getElementById('image-upload').click();
			});
		}
	}
});