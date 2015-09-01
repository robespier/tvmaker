function ctrlChannels($scope, tvmStorage, strings, tvmRules) {
    var ls = tvmStorage;
    var channels = ls.get('channels') || [];
    /**
     * Временная заглушка для LocalStorage
     */
    $scope.channels = (channels.length > 0) ? channels : [
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
            if (angular.isUndefined($scope.channels[current].rules)) {
                $scope.channels[current].rules = guessFromRaw();
            }
        }
    });

    $scope.setActiveChannel = function() {
        $scope.activeChannel = this.$index;
        ls.set('activeChannel', this.$index);
    };

    $scope.setChannelContent = function(channel) {
        ls.set('channels', $scope.channels);
        buildChannel(channel);
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
        ls.set('channels', $scope.channels);
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
     * Разбить содержимое на строки.
     * Разделитель по умолчанию -- перевод строки, может
     * быть переопределен в настройке канала.
     */
    $scope.splitChannel = function(channel) {
        var splitter = channel.lineSplitter || '\n';
        if (angular.isUndefined(channel.content)) {
            return [];
        } else {
            return channel.content.split(splitter);
        }
    };

    function buildChannel(channel) {
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

app.controller('ctrlChannels', ['$scope', 'tvmStorage', 'strings', 'tvmRules', ctrlChannels]);
