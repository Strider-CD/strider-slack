var schema = require('./schema');
var _ = { each: require('lodash.foreach') };

app.controller('SlackController', ['$scope', '$http', function ($scope, $http) {
  var normalizeConfig = function () {
    $scope.config = $scope.configs[$scope.branch.name].slack.config || {};
    _.each(schema, function(schemaValue,key) {
      var value = $scope.config[key]
      if (! value || value.length === 0 )
        $scope.config[key] = schemaValue.default;
    });
  };
  $scope.normalize = normalizeConfig;
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
