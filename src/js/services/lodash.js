/**
 * Wrap lodash into angular service `_`
 *
 * Register service
 */
app.factory('_', ['$window', function($window) { return $window._; } ]);
