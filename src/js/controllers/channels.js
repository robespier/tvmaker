function ctrlChannels($scope, localStorageService, strings) {
    var ls = localStorageService;
    var channels = ls.get('channels') || [];
    /**
     * Временная заглушка для LocalStorage
     */
    channels = [
        {title: 'Первый канал'},
        {title: 'Россия'},
        {title: 'CTC'},
        {title: 'Вариант'},
        {title: 'Домашний'},
    ];
    $scope.channels = channels;

    $scope.activeChannel = 5;

    $scope.setChannelContent = function() {
        ls.set('channels', angular.toJson($scope.channels));
    };

    $scope.strings = strings;

    $scope.build = function() {
    };
}

app.controller('ctrlChannels', ['$scope', 'localStorageService', 'strings', ctrlChannels]);
