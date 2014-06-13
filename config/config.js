(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var schema = require('./schema');

app.controller('SlackController', ['$scope', '$http', function ($scope, $http) {
  var normalizeConfig = function () {
    $scope.config = $scope.configs[$scope.branch.name].slack.config || {};
    _(schema).each(function(val,key) {
      if (! $scope.config[key]) $scope.config[key] = val.default;
    });
  };
  normalizeConfig();
  $scope.$watch('configs[branch.name].slack.config', function (value) {
    $scope.config = value;
  });
  $scope.saving = false;
  $scope.save = function () {
    normalizeConfig();
    $scope.saving = true;
    $scope.pluginConfig('slack', $scope.config, function() {
      $scope.saving = false;
    });
  };
  $scope.hintsLoaded = {};
  $scope.help = function () {
    $('#ejs_hint').modal().on('shown', function () {
      _.each(['bitbucket_hook', 'manual_retest'], function (kind) {
        if ($scope.hintsLoaded[kind]) return false;
        $.get('/ext/slack/ejs_hint/'+kind, function(data) {
          $('#'+kind+'_hint').html($('<pre>').text(data));
          $scope.hintsLoaded[kind] = true;
        });
      });
    });
  };
}]);

},{"./schema":2}],2:[function(require,module,exports){
var basicTemplate = function(icon, keyword) {
  return icon+" (<%= ref.branch %>) Tests are passing :: <<%= process.env.strider_server_name %>/<%= project.name %>/job/<%= _id %>|logs><% if (trigger.url) { %>\n<<%= trigger.url %>|<%= trigger.message.trim() %>><% } %>"
}

module.exports = {
    token: {
      type: String,
      default: ''
    },
    subdomain: {
      type: String,
      default: ''
    },
    channel: {
      type: String,
      default: '#general'
    },
    username: {
      type: String,
      default: '<%= project.name %>'
    },
    icon_url: {
      type: String,
      default: 'http://media.stridercd.com/img/logo.png'
    },
    test_pass_message: {
      type: String,
      default: basicTemplate(":white_check_mark:", "passing")
    },
    test_fail_message: {
      type: String,
      default: basicTemplate(":exclamation:", "failing")
    }
}

},{}]},{},[1])