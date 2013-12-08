describe("Unit: Testing Services", function() {
    describe("Services Module", function() {
	beforeEach(angular.mock.module('Tide'));
	beforeEach(angular.mock.module('tideServices'));
	beforeEach(angular.mock.inject(function($rootScope) {
	    socket = new mSocket($rootScope)
	}));
	it("should send and receive messages with the callback listener", 
	   inject(function($rootScope) {
	   
	       var recd = false;
	       socket.on("test",function(data) {
		   recd = true;
	       });
	       
	       socket.emit("test", { info: "test" });
	       expect(recd).toBe(false);
	   }));

    });
});

var mSocket = function($rootScope) {
    this.events = {};
    this.emits = {};

  // intercept 'on' calls and capture the callbacks
    this.on = function(eventName, callback){
	if(!this.events[eventName]) this.events[eventName] = [];
	this.events[eventName].push(callback);
    };

  // intercept 'emit' calls from the client and record them to assert against in the test
    this.emit = function(eventName){
	var args = Array.prototype.slice.call(arguments, 1);

	if(!this.emits[eventName])
	    this.emits[eventName] = [];
	this.emits[eventName].push(args);
    };
};
