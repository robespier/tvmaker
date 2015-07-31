function ctrlDays($scope, tvmStorage, strings) {
    var ls = tvmStorage;

    $scope.activeDay = ls.get('activeDay') || 4; // Пятница :)

    /**
     * Подгрузка дней в контроллер
     */
    function loadDays() {
        var lsDays = ls.get('days') || [];
        $scope.days = [];
        angular.forEach(strings.days, function(name, index) {
            $scope.days.push({
                title: name,
                text: lsDays[index] || ''
            });
        });
    }

    loadDays();
}

app.controller('ctrlDays', ['$scope', 'tvmStorage', 'strings', ctrlDays]);
