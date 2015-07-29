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
                    'title': strings.rules.replace.title,
                    'desc': strings.rules.replace.desc
                },
                'params': []
            },
            {
                'fn': 'dropEmptyLines',
                'view': {
                    'title': strings.rules.dropEmptyLines.title,
                    'desc': strings.rules.dropEmptyLines.desc
                },
                'params': []
            },
        ];
    }

    /**
     * Разбить содержимое на строки.
     * Разделитель по умолчанию -- перевод строки, может
     * быть переопределен в настройке канала.
     */
    $scope.splitChannel = function(channel) {
        var splitter = channel.lineSplitter || '\n';
        return channel.content.split(splitter);
    };

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
         * Правил может не быть совсем
         */
        if (angular.isUndefined(channel.rules) || channel.rules.length === 0) {
            return;
        }

        var sc = $scope.splitChannel(channel);

        channel.rules.forEach(function(r) {
            if (r.active) {
                var baseRule = tvmRules[r.fn];
                sc = baseRule.process(sc, r.params);
                r.matchesSrc = baseRule.matchesSrc;
            }
        });

        // Результат работы правил -- содержимое правой колонки
        channel.preview = sc.join('\n');
    }
}

app.controller('ctrlChannels', ['$scope', 'localStorageService', 'strings', 'tvmRules', ctrlChannels]);
