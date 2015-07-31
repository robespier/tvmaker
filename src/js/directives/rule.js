app.directive('tvmRule', function() {
    var link = function(scope, element, attributes) {
        scope.title = attributes['tvmTitle'];
        scope.descr = attributes['tvmDescr'];

        scope.active = scope.rule.active;
        scope.$watch('active', function(current, old, scope) {
            if (angular.isUndefined(current)) {
                return;
            }
            scope.rule.active = current;

            var thisRule = scope.channel.rules[scope.$index];

            /**
             * Применить правило к активному каналу
             */
            scope.buildActive(thisRule);

            /**
             * Подсветим результаты (если есть)
             */
            if (angular.isArray(thisRule.matchesSrc) || angular.isArray(thisRule.matchesPre)) {
                scope.renderRule(thisRule, current);
            }
        });
    };
    return {
        templateUrl: 'dir/rule.html',
        link : link
    };
});
