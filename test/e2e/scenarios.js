describe("E2E: Testing Controllers", function() {
    describe("Controllers Module", function() {
	
	beforeEach(function() {
	    browser().navigateTo('../'); 
	});

	it('should have working page', function() {
	    expect(repeater('.activeChannelUsers li').count()).toBe(0);
	});
    });
});
