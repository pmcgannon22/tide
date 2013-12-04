'use strict';

/* jasmine specs for controllers go here */
describe('tide controllers', function() {

  describe('ChatCtrl', function(){

    beforeEach(module('tideControllers'));

      it('should initialize an empty chats array', inject(function($controller, $socket) {
      var scope = {},
          ctrl = $controller('ChatCtrl', {$scope:scope}, {$scope:socket});

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


  });
});
