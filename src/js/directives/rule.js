app.directive('tvmRule', function() {
    var link = function(scope, element, attributes) {
        scope.title = attributes['tvmTitle'];
        scope.descr = attributes['tvmDescr'];
    };
    return {
        templateUrl: 'dir/rule.html',
        link : link
    };
});
