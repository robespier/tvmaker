function tvmStorage(localStorageService) {
    var ls = localStorageService;
    return {
        get: function(key) {
            var data = ls.get(key);
            return JSON.parse(data);
        },
        set: function(key, value) {
            ls.set(key, angular.toJson(value));
        }
    };
}

app.factory('tvmStorage', ['localStorageService', tvmStorage]);
