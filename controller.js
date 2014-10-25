var schema = require('./schema');
var _ = { each: require('lodash.foreach') };

app.controller('SlackController', ['$scope', '$http', function ($scope, $http) {
  $scope.fillEmptyFields = function() {
    $scope.config = $scope.configs[$scope.branch.name].slack.config || {};
    _.each(schema, function(schemaValue,key) {
      var value = $scope.config[key]
      if (! value || value.length === 0 )
        $scope.config[key] = schemaValue.default;
    });
  }
  $scope.normalizeIconURL = function() {
    var iconURL = $scope.config.icon_url
    if (iconURL && iconURL[0] === '/') {
      var root = window.location.protocol+'//'+window.location.host;
      $scope.config.icon_url = root+$scope.config.icon_url
    }
  }
  $scope.$watch('configs[branch.name].slack.config', function (value) {
    $scope.config = value;
  });
  $scope.saving = false;
  $scope.save = function () {
    $scope.fillEmptyFields();
    $scope.normalizeIconURL()
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
  $scope.test = function() {
    webhookURL = $scope.config.webhookURL
    if (webhookURL && webhookURL.length > 0) {
      $scope.fillEmptyFields()
      $scope.normalizeIconURL()
      $scope.testing = true;
      $http.post('/ext/slack/test', {
        config: $scope.config
      }).success(function(data, status, headers, config) {
        alert('Looks good from here. Check your Slack!')
      }).error(function(data, status, headers, config) {
        alert(data)
      })['finally'](function() {
        $scope.testing = false;
      })
    } else {
      alert('Webhook URL is required')
    }
  }
}]);
