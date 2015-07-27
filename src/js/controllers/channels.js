function ctrlChannels($scope, localStorageService, strings, tvmRules) {
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
        {title: 'Домашний', lineSplitter: '\n'},
    ];
    $scope.channels = channels;

    $scope.activeChannel = 5;
    /**
     * Обновлять правила при смене канала
     */
    $scope.$watch('activeChannel', function(current) {
        $scope.channels[current - 1].rules = fetchChannelRules(current);
    });

    $scope.setChannelContent = function() {
        ls.set('channels', angular.toJson($scope.channels));
    };

    $scope.strings = strings;

    /**
     * Alga всем каналам
     */
    $scope.build = function() {
        $scope.channels.forEach(buildChannel);
    };

    /**
     * Забрать правила для канала
     * Заглушка, будут подгружаться пользовательские правила
     */
    function fetchChannelRules() {
        return [
            {
                'fn': 'replace',
                'view': {
                    'title': "Удалять дату из строк с именем дня недели",
                    'desc': "Оставлять только слова 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'."
                },
                'params': []
            },
            {
                'fn': 'dropEmptyLines',
                'view': {
                    'title': 'Удаление пустых строк',
                    'desc': 'Будут удалены совершенно пустые строчки. Сохранятся строчки, состоящие только из пробелов или табуляций.'
                },
                'params': []
            },
        ];
    }

    function buildChannel(channel) {
        /**
         * Содержимое левой колонки
         * Может оказаться пустым
         */
        var cc = channel.content;
        if (angular.isUndefined(cc)) {
            return;
        }

        /**
         * Разбить содержимое на строки.
         * Разделитель по умолчанию -- перевод строки, может
         * быть переопределен в настройке канала.
         */
        var splitter = channel.lineSplitter || '\n';
        var sc = cc.split(splitter);

        var userRules = fetchChannelRules(channel);

        userRules.forEach(function(r) {
            sc = tvmRules[r.fn](sc, r.params);
        });

        // Результат работы правил -- содержимое правой колонки
        channel.preview = sc.join('\n');
    }
}

app.controller('ctrlChannels', ['$scope', 'localStorageService', 'strings', 'tvmRules', ctrlChannels]);
