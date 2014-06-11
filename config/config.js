console.log("will you load?");
app.controller('SlackController', ['$scope', function ($scope) {
  console.log("Slackcontroller loaded!");
  $scope.save = function () {
    console.log(this);
    console.log($scope);
//    $scope.pluginConfig('slack', $scope.slackSubdomain
  };
}]);
