function tvmRules(_, strings) {
    var rules = {
        'replace': {
            process: function(source) {
                return source;
            }
        },
        'daySplitter': {
            process: function(source) {
                /**
                 * Оптимистическая проверка
                 * Проход по исходнику и поиск дней недели в календарном порядке
                 *
                 * Могут быть фальш-позитивы, например:
                 * - "Понедельник начинается в субботу"
                 * - "Среда обитания"
                 * - "Пятница, 13"
                 *
                 * Если "Пятницу, 13" покажут в субботу, то ничего. А если в четверг, то фигово.
                 * Поэтому поиск как в жадном квантификаторе -- берется последнее совпадение.
                 */
                var days = strings.days;
                var nextMatch = new RegExp(days[0], 'i');
                var prevMatch;
                var matchCount = 0;
                this.matchesSrc = [];

                _.forEach(source, function(value, index) {
                    if (nextMatch.exec(value)) {
                        this.matchesSrc[index] = [0, -1];
                        matchCount++;
                        if (matchCount < days.length) {
                            prevMatch = new RegExp(days[matchCount - 1], 'i');
                            nextMatch = new RegExp(days[matchCount], 'i');
                        }
                    } else {
                        if (_.isRegExp(prevMatch) && prevMatch.exec(value)) {
                            this.matchesSrc.pop();
                            this.matchesSrc[index] = [0, -1];
                        }
                    }
                }, this);

                // Повезло?
                this.hits = matchCount;
                if (matchCount === 7) {
                    this.success = true;
                } else {
                    this.success = false;
                    var sm = strings.rules.daySplitter;
                    if (matchCount > 7) {
                        this.statusMessage = sm.tooMany;
                    } else {
                        this.statusMessage = sm.notEnough + _.slice(days, matchCount).join(', ');
                    }
                }
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

app.factory('tvmRules', ['_', 'strings', tvmRules]);
