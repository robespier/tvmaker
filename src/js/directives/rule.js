app.directive('tvmRule', function() {
    var link = function(scope, element, attributes) {
        scope.title = attributes['tvmTitle'];
        scope.descr = attributes['tvmDescr'];
        scope.$watch('active', function(current, old, scope) {
            if (angular.isUndefined(current)) {
                return;
            }
            scope.rule.active = current;
            /**
             * Подсветим результаты (если есть)
             */
            var thisRule = scope.channel.rules[scope.$index];
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
