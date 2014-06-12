app.controller('SlackController', ['$scope', '$http', function ($scope, $http) {
  var normalizeConfig = function () {
    $scope.config = $scope.configs[$scope.branch.name].slack.config || {};
    _({channel: "#general",
      username: "<%= project.name %>",
      icon_url: "http://media.stridercd.com/img/logo.png",
      test_pass_message: ":white_check_mark: Tests are passing for <%= _.map(ref, function(k,v){ return k+' '+v }).join(', ') %> :: <<%= process.env.strider_server_name %>/<%= project.name %>/job/<%= _id %>|logs>",
      test_fail_message: ":exclamation: Tests are failing for <%= _.map(ref, function(k,v){ return k+' '+v }).join(', ') %> :: <<%= process.env.strider_server_name %>/<%= project.name %>/job/<%= _id %>|logs>"
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
