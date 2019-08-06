/**
 * @typedef {Object} HLRU
 * @property {Function} has -
 * @property {Function} remove -
 * @property {Function} get -
 * @property {Function} set -
 * @property {Function} clear -
 * @property {Function} stats -
 *
 * @function createHLRU
 * @param {number} max - allowed cache size
 * @return {HLRU} -
 */

const createHLRU = max => {
    if (!max) {
        throw Error('hashlru must have a max value, of type number, greater than 0')
    }

    let size = 0
    let cache = Object.create(null)
    let _cache = Object.create(null)

    const update = (key, value) => {
        cache[key] = value
        size += 1

        if (size >= max) {
            size = 0
            _cache = cache
            cache = Object.create(null)
        }
    }

    return {
        has(key) {
            return cache[key] !== undefined || _cache[key] !== undefined
        },
        remove(key) {
            if (cache[key] !== undefined) {
                cache[key] = undefined
            }

            if (_cache[key] !== undefined) {
                _cache[key] = undefined
            }
        },
        get(key) {
            let v = cache[key]

            if (v !== undefined) {
                return v
            }

            v = _cache[key]

            if (v !== undefined) {
                update(key, v)
                return v
            }
        },
        set(key, value) {
            if (cache[key] !== undefined) {
                cache[key] = value
            } else {
                update(key, value)
            }
        },
        clear: function() {
            cache = Object.create(null)
            _cache = Object.create(null)
        },
        stats() {
            return {
                size,
                keys: Object.keys(cache),
                _keys: Object.keys(_cache)
            }
        }
    }
}

module.exports = {
    createHLRU
}
