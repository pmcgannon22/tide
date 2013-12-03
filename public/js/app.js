var tide = angular.module('Tide', [
	'tideControllers',
	'tideFilters',
	'tideServices'
]);

tide.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
			when('/', {
				templateUrl: 'partials/chat.html',
				controller: 'ChatCtrl'
			}).
			when('/channel/:channelName', {
				templateUrl: 'partials/chat.html',
				controller: 'ChatCtrl'
			}).
			otherwise({
				redirectTo: '/'
			});
	}]);

