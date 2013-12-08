describe('Unit: Testing Filters', function() {
    describe("Filter Module:", function() {

	beforeEach(angular.mock.module('Tide'));

	it('should have a capitalized filter', inject(function($filter) {
	    expect($filter('capitalized')).not.toBe(null);
	}));

	it('should have a working capitalized filter on well-formed input', 
	   inject(function($filter) {
	       var scope = {};
	       var filter = $filter('capitalized')('c',scope);
	       expect(filter.length).toBe(1);
	       expect(filter[0]).toBe('C');
	}));

	it('should have a working capitalized filter on already capitalized input', 
	   inject(function($filter) {
	       var scope = {};
	       var filter = $filter('capitalized')('C',scope);
	       expect(filter.length).toBe(1);
	       expect(filter[0]).toBe('C');
	}));

	it('should have a working capitalized filter on well-formed string input', 
	   inject(function($filter) {
	       var scope = {};
	       var filter = $filter('capitalized')('char',scope);
	       expect(filter.length).toBe(1);
	       expect(filter[0]).toBe('C');
	}));

	it('should have a working capitalized filter on already capitalized string input', 
	   inject(function($filter) {
	       var scope = {};
	       var filter = $filter('capitalized')('Char',scope);
	       expect(filter.length).toBe(1);
	       expect(filter[0]).toBe('C');
	}));

	it('should have a working capitalized filter on null input', 
	   inject(function($filter) {
	       var scope = {};
	       var filter = $filter('capitalized')('',scope);
	       expect(filter.length).toBe(0);
	}));

	it('should have a formatIsoTime filter', inject(function($filter) {
	    expect($filter.formatIsoTime).not.toBe(null);
	}));
	
	it('should have a working formatIsoTime filter on well-formed input AM', 
	   inject(function($filter) {
	       var scope = {};
	       var filter = $filter('formatIsoTime')("October 13, 1975 11:13:00",scope);
	       expect(filter).toBe('11:13am');
	}));

	it('should have a working formatIsoTime filter on well-formed input PM', 
	   inject(function($filter) {
	       var scope = {};
	       var filter = $filter('formatIsoTime')("October 13, 1975 14:13:00",scope);
	       expect(filter).toBe('2:13pm');
	}));
	
	it('should have a working formatIsoTime filter on well-formed input Noon', 
	   inject(function($filter) {
	       var scope = {};
	       var filter = $filter('formatIsoTime')("October 13, 1975 12:00:00",scope);
	       expect(filter).toBe('12:00pm');
	}));

	it('should have a working formatIsoTime filter on well-formed input Midnight', 
	   inject(function($filter) {
	       var scope = {};
	       var filter = $filter('formatIsoTime')("October 13, 1975 00:00:00",scope);
	       expect(filter).toBe('12:00am');
	}));

	it('should have a truncate filter', inject(function($filter) {
	    expect($filter.truncate).not.toBe(null);
	}));

	it('should have a working truncate filter on well-formed input', 
	   inject(function($filter) {
	       var scope = {};
	       var filter = $filter('truncate')("Nolan Smith", 3, "ah");
	       expect(filter).toBe('Nah');
	}));

	it('should have a working truncate filter on invalid input', 
	   inject(function($filter) {
	       var scope = {};
	       var filter = $filter('truncate')("Nolan", 3, "ah");
	       expect(filter).toBe('Nolan');
	}));

	it('should have a working truncate filter on empty input', 
	   inject(function($filter) {
	       var scope = {};
	       var filter = $filter('truncate')("", 3, "ah");
	       expect(filter).toBe('');
	}));

	it('should have a working truncate filter on not a number input', 
	   inject(function($filter) {
	       var scope = {};
	       var filter = $filter('truncate')("Nolan", "No", "ah");
	       expect(filter).toBe('Nolan');
	}));

	it('should have a working truncate filter on undefined input', 
	   inject(function($filter) {
	       var scope = {};
	       var filter = $filter('truncate')("Nolan", "No");
	       expect(filter).toBe('Nolan');
	}));

	it('should have a unique filter', inject(function($filter) {
	    expect($filter.unique).not.toBe(null);
	}));	
    });
});