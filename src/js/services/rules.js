function tvmRules(_) {
    var rules = {
        'replace': function(source) {
            return source;
        }, 
        'dropEmptyLines': function(source) {
            var result = _.filter(source, function(l) {
                return l.length > 0;
            });
            return result;
        }
    };

    return rules;
}

app.factory('tvmRules', ['_', tvmRules]);
