/* jshint camelcase:false */
(function(){
  'use strict';
  var project = angular.module('teamstream');

  project.controller('ProjectCtrl', ['$scope', '$stateParams', '$rootScope', '$state', 'Project', 'Room', 'Activity', function($scope, $stateParams, $rootScope, $state, Project, Room, Activity){
    $scope.projectId = $stateParams.pid;
    $scope.project = {};
    $scope.barIsVisible = true;
    $scope.onlineUsers = [];
    $scope.activities = [];
    $scope.moment = moment;


    $scope.getActivities = function(){
      Activity.getActivities($scope.projectId).then(function(res){
        $scope.activities = res.data;
      });
    };

    //initial function calls
    Project.findOne($scope.projectId).then(function(res){
      $scope.project = res.data[0];
    }, function(res){
      alertify.error('You are not a collaborator on this project.');
      $state.go('dashboard');
    });

    $scope.getActivities();

    socket.emit('userStatusChange');
    //end intial function calls



    //add collaborator to a project
    $scope.addCollaborator = function(email){
      Project.addCollaborator({email: email, projectId: $scope.projectId}).then(function(res){
        alertify.success('Added user to: ' + $scope.project.project_name);
      }, function(res){
        alertify.error('Sorry, no user found at that e-mail.');
      });
    };

    //sidebar toggle
    $scope.toggleSidebar = function(){
      if($scope.barIsVisible){
        $('#side-bar').animate({right: '-300px'});
        $('#toggle').animate({right: '-5px'});
      }
      else{
        $('#side-bar').animate({right: '0px'});
        $('#toggle').animate({right: '290px'});
      }
      //toggle
      $scope.barIsVisible = !$scope.barIsVisible;
    };

    //get online users
    $scope.getOnlineUsers = function(){
      Room.getOnlineUsers($scope.projectId).then(function(res){
        $scope.onlineUsers = res.data;
      });
    };

    $scope.getOnlineUsers();

    //go offline if user closes window
    window.onbeforeunload = function(e){
        e = e || window.event; //Did an event happen?
        if(e){
          //Don't need to do anything with returned promise
          Room.goOffline($scope.projectId, $rootScope.rootuser.email);
          socket.emit('userStatusChange');
        }
    };

    //go offline if user has logged out on this page
    window.addEventListener('logout', function(){
      Room.goOffline($scope.projectId, $rootScope.rootuser.email);
      socket.emit('userStatusChange');
    });

    //go offline if user changes the state
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
      //state changes when logging out, don't run this if logging out
      if($rootScope.rootuser){
        Room.goOffline($scope.projectId, $rootScope.rootuser.email);
        socket.emit('userStatusChange');
      }
    });

    //socket event to reflect when a user goes offline
    socket.off('statusChange');
    socket.on('statusChange', function(){
      $scope.getOnlineUsers();
    });

    //socket event for when a new event comes through anytime anything is updated
    socket.off('projectUpdate');
    socket.on('projectUpdate', function(){
      $scope.getActivities();
    });


  }]);
})();
