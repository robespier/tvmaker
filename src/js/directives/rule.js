app.directive('tvmRule', function() {
    var link = function(scope, element, attributes) {
        scope.title = attributes['tvmTitle'];
        scope.descr = attributes['tvmDescr'];
        scope.$watch('active', function(current, old, scope) {
            if (angular.isUndefined(current)) {
                return;
            }
            scope.rule.active = current; 
        });
    };
    return {
        templateUrl: 'dir/rule.html',
        link : link
    };
});
