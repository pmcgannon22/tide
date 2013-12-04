/*
 * Defines custom functions that can be used as filters to variables in angularjs directives.
 *
 */
var tideFilters = angular.module('tideFilters', []);
/*
 * Gets first letter of a string and returns it in capitalized form.
 *
 */
tideFilters.filter('capitalized', function() {
	return function(input, scope) {
		if (input != null) {
			console.log(input);
			return input.substring(0, 1).toUpperCase();
		}
	}
});
/*
 * Formats time to HH:MM
 *
 */
tideFilters.filter('formatIsoTime', function() {
	return function(input, scope) {
		if (input != null) {
			var d = new Date(input);
			var hr = d.getHours();
			var time = hr < 12 ? "am" : "pm";
			if (hr == 0) hr = 12;
			if (hr > 12) hr = hr - 12;
			var min = d.getMinutes();
			min = min + "";
			if (min.length == 1) min = "0" + min;
			return hr + ":" + min + time;
		}
	}
});
/*
 * Truncates text to a certain length.
 *
 */
tideFilters.filter('truncate', function() {
	return function(text, length, end) {
		if (isNaN(length)) length = 10;
		if (end === undefined) end = "...";
		if (text.length <= length || text.length - end.length <= length) {
			return text;
		} else {
			return String(text).substring(0, length - end.length) + end;
		}
	};
});

/*
* Removes duplicates from list. 
* 
*/
tideFilters.filter('unique', function() {
   return function(collection, keyname) {
      var output = [], 
          keys = [];

      angular.forEach(collection, function(item) {
          var key = item[keyname];
          if(keys.indexOf(key) === -1) {
              keys.push(key);
              output.push(item);
          }
      });

      return output;
   };
});