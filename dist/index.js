'use strict'

var createHLRU = function createHLRU(max) {
    if (!max) {
        throw Error('hashlru must have a max value, of type number, greater than 0')
    }

    var size = 0
    var cache = Object.create(null)

    var _cache = Object.create(null)

    var update = function update(key, value) {
        cache[key] = value
        size += 1

        if (size >= max) {
            size = 0
            _cache = cache
            cache = Object.create(null)
        }
    }

    return {
        has: function has(key) {
            return cache[key] !== undefined || _cache[key] !== undefined
        },
        remove: function remove(key) {
            if (cache[key] !== undefined) {
                cache[key] = undefined
            }

            if (_cache[key] !== undefined) {
                _cache[key] = undefined
            }
        },
        get: function get(key) {
            var v = cache[key]

            if (v !== undefined) {
                return v
            }

            v = _cache[key]

            if (v !== undefined) {
                update(key, v)
                return v
            }
        },
        set: function set(key, value) {
            if (cache[key] !== undefined) {
                cache[key] = value
            } else {
                update(key, value)
            }
        },
        clear: function clear() {
            cache = Object.create(null)
            _cache = Object.create(null)
        },
        stats: function stats() {
            return {
                size: size,
                keys: Object.keys(cache),
                _keys: Object.keys(_cache)
            }
        }
    }
}

module.exports = {
    createHLRU: createHLRU
}
