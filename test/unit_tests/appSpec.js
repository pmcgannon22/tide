describe('Unit: Testing App', function() {
    describe("App Module:", function() {
	var hasModule = function(m) {
	    return deps.indexOf(m) >= 0;
	};
	
	var deps;
	var module;

	beforeEach(function() {
	    module = angular.module("Tide");
	    deps = module.value('Tide').requires;
	});

	it('should have tideControllers as a dependency', function() {
	    expect(hasModule('tideControllers')).toBe(true);
	});

	it('should have tideFilters as a dependency', function() {
	    expect(hasModule('tideFilters')).toBe(true);
	});
	
	it('should have tideServices as a dependency', function() {
	    expect(hasModule('tideServices')).toBe(true);
	});
	
	it('should have tideDirectives as a dependency', function() {
	    expect(hasModule('tideDirectives')).toBe(true);
	});
	
	it('should have ngRoute as a dependency', function() {
	    expect(hasModule('ngRoute')).toBe(true);
	});
    });
});