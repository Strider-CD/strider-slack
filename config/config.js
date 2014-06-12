app.controller('SlackController', ['$scope', '$http', function ($scope, $http) {
  var normalizeConfig = function () {
    $scope.config = $scope.configs[$scope.branch.name].slack.config || {};
    _({channel: "#general",
      username: "<%= project.name %>",
      icon_url: "http://media.stridercd.com/img/logo.png",
      test_pass_message: ":white_check_mark: Tests are passing",
      test_fail_message: ":exclamation: Tests are failing"
    }).each(function(val,key) {
      console.log(key, val);
      console.log($scope.config[key]);
      if (! $scope.config[key]) $scope.config[key] = val;
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
}]);
