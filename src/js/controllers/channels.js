function ctrlChannels($scope, localStorageService, strings, tvmRules) {
    var ls = localStorageService;
    var channels = ls.get('channels') || '[]';
    /**
     * Временная заглушка для LocalStorage
     */
    $scope.channels = (channels !== '[]') ? JSON.parse(channels) : [ 
        {title: 'Первый канал'},
        {title: 'Россия'},
        {title: 'CTC'},
        {title: 'Вариант'},
        {title: 'Домашний', lineSplitter: '\n'},
    ];

    $scope.activeChannel = ls.get('activeChannel') || 0;
    
    /**
     * Смена канала
     */
    $scope.$watch('activeChannel', function(current) {
        if (!angular.isUndefined(current)) {
            ls.set('activeChannel', current);
            $scope.channels[current].rules = fetchChannelRules(current);
        }
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
     * Применить правила к активному каналу
     */
    $scope.buildActive = function() {
        var active = $scope.channels[$scope.activeChannel];
        buildChannel(active);
    };

    /**
     * Амбициозная затея -- если правил нет, то попытаться 
     * подобрать оптимальные. Но это потом, сейчас просто что есть.
     */
    function guessFromRaw() {
        return [
            {
                'fn': 'daySplitter',
                'view': {
                    'title': strings.rules.daySplitter.title,
                    'desc': strings.rules.daySplitter.desc
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
     * Забрать правила для канала
     */
    function fetchChannelRules(channelIndex) {
        var lsRules = ls.get('rules');
        if (lsRules && lsRules[channelIndex]) {
            return lsRules[channelIndex];
        } else {
            return guessFromRaw();
        }
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
