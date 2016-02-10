//Utilities

var utils = {

    deltaPatch: function(actual, initial) {

        var cleanResult = [],
            inline = [],
            result = deepDiffMapper.map(actual, initial);

        angular.forEach(result, function(value, key) {
            if (value.length) {
                inline = inline.concat(value);
            } else {
                inline.push(value);
            }
        });

        angular.forEach(inline, function(value, key) {
            if (value.op !== 'unchanged' && Object.prototype.toString.call(value) !== '[object Array]') {
                cleanResult.push(value);
            }
        });

        return cleanResult;
    }
};

var deepDiffMapper = function() {
    return {
        VALUE_CREATED: 'add',
        VALUE_UPDATED: 'replace',
        VALUE_DELETED: 'remove',
        VALUE_UNCHANGED: 'unchanged',
        map: function(obj1, obj2, patch, old) {
            if (this.isFunction(obj1) || this.isFunction(obj2)) {
                throw 'Invalid argument. Function given, object expected.';
            }
            if (this.isValue(obj1) || this.isValue(obj2)) {
                if (old && (old != patch)) {
                    patch = '/' + old + '/' + patch;
                } else {
                    patch = '/' + patch;
                }
                return {
                    op: this.compareValues(obj1, obj2),
                    value: obj1 || obj2,
                    path: patch
                };
            }

            var diff = {};

            for (var key in obj1) {
                if (this.isFunction(obj1[key])) {
                    continue;
                }
                var value2 = undefined;
                if ('undefined' != typeof(obj2[key])) {
                    value2 = obj2[key];
                }
                diff[key] = this.map(obj1[key], value2, key, patch);
            }
            for (var key in obj2) {
                if (this.isFunction(obj2[key]) || ('undefined' != typeof(diff[key]))) {
                    continue;
                }
                diff[key] = this.map(undefined, obj2[key], key, patch);
            }
            var diffArray = $.map(diff, function(value, index) {
                return [value];
            });
            return diffArray;
        },
        compareValues: function(value1, value2) {
            if (value1 === value2) {
                return this.VALUE_UNCHANGED;
            }
            if ('undefined' == typeof(value1)) {
                return this.VALUE_CREATED;
            }
            if ('undefined' == typeof(value2)) {
                return this.VALUE_DELETED;
            }
            return this.VALUE_UPDATED;
        },
        isFunction: function(obj) {
            return {}.toString.apply(obj) === '[object Function]';
        },
        isArray: function(obj) {
            return {}.toString.apply(obj) === '[object Array]';
        },
        isObject: function(obj) {
            return {}.toString.apply(obj) === '[object Object]';
        },
        isValue: function(obj) {
            return !this.isObject(obj) && !this.isArray(obj);
        }
    };
}();
