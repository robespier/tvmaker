function tvmRules(_) {
    var rules = {
        'replace': {
            process: function(source) {
                return source;
            }
        }, 
        'dropEmptyLines': {
            process: function(source) {
                var result = [];
                this.matchesSrc = [];
                _.forEachRight(source, function(value, index) {
                    if (value.length === 0) {
                        this.matchesSrc[index] = [0, -1]; // Строка и диапазон подсветки
                    } else {
                        result.unshift(value);
                    }
                }, this);
                return result;
            }
        }
    };

    return rules;
}

app.factory('tvmRules', ['_', tvmRules]);
