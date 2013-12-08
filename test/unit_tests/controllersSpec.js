'use strict';

/* jasmine specs for controllers go here */
describe('tide controllers', function() {

    
    beforeEach(angular.mock.module('Tide'));
    beforeEach(angular.mock.module('tideServices'));
    it('should make a Chat controller', function() {
	expect(tide.ChatCtrl).not.toBe(null);
    });

    it('should make a Channel List controller', function() {
	expect(tide.ChannelListCtrl).not.toBe(null);
    });

    it('should make an Active User controller', function() {
	expect(tide.ActiveUserCtrl).not.toBe(null);
    });
							      
    /*
    it('should work', inject(function($rootScope, $controller, $httpBackend) {
	var scope = $rootScope.$new();

	var ctrl = $controller('ChatCtrl', {
	    $scope: scope,
	    $rootScope: $rootScope,
	    $routeParams: { channelName: 'dragon' },
	    $http: $httpBackend,
	    $socket: new mSocket()
	});    
    }));
*/
    

/*
    beforeEach(module('ngRoute'));

    beforeEach(angular.mock.module('Tide'));
    
    beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
	$httpBackend = _$httpBackend_;
	$httpBackend.expectGET('data/' + $rootScope.currentChannel).
	    respond([{name: 'Tide'}]);

	scope = $rootScope.$new();
	mock_socket = new mSocket($rootScope);
	
	$controller('ChatCtrl', {$scope: scope, $rootScope: $rootScope, $routeParams: $ngRoute.$routeParams, $http, 
    }*/
/*    
    describe('ChatCtrl', function() {
	var mock_socket;
	beforeEach(function() {
	    mock_socket = new Socket();
	});

	it('should initialize an empty chats array', inject(function($controller) {
	    var scope = {},
	    ctrl = $controller('ChatCtrl', {$scope:scope});
	    
	    expect(scope.chats.length).toBe(0);
	}));

		   
	it('should increment chats array by one', inject(function($controller) {
	    var scope = {},
	    ctrl = $controller('ChatCtrl', {$scope:scope});
	    scope.chatbox = 'Goodbye, world!';
	    scope.username = 'xxFireballerxx77';
	    scope.currentChannel = 'thegaychannel';
            scope.time = '5555'

	    scope.onPostChat();
	    
	    expect(scope.chats.length).toBe(1);
	    expect(scope.chats[0].text).toBe('Goodbye, world!');
	    expect(scope.chats[0].username).toBe('xxFireballerxx77');
	    expect(scope.chats[0].channel).toBe('thegaychannel');
	    expect(scope.chats[0].currentTime).toBe('5555');
	    expect(scope.chatbox).toBe("");
	}));
    });*/
});

var mSocket = function() {
    this.emit = function(string,data) { /* no op */ };
    this.on = function(string,data) { /* no op */ };
};