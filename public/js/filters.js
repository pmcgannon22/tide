var tideFilters = angular.module('tideFilters',[]);

tideFilters.filter('capitalized', function() {
	return function(input, scope) {
		if(input != null){
			console.log(input);
			return input.substring(0,1).toUpperCase();
		}
	}
});