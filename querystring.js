/*globals module, define */
;(function (name, encode, decode, separator, equals) {
    'use strict';
    /**
     * String trimming utility
     *
     * @private
     * @param   {String}    string
     */
    function trim (string) {
        return string.replace(/^\s+|\s+$/g, '');
    }
    /**
     * Most compatible means of checking if object is an array
     *
     * @private
     * @param   {Mixed} object
     */
    function isArray (object) {
        return Object.prototype.toString.call(object) == '[object Array]';
    }
    /**
     * Given a set of options, include the most appropriate defaults
     *
     * @private
     * @param   {Object}    options
     * @return  {Object}
     */
    function defaults (options) {
        options = options || {};
        if (!options.encode) {
            options.encode = encode;
        }
        if (!options.decode) {
            options.decode = decode;
        }
        if (!options.separator) {
            options.separator = separator;
        }
        if (!options.equals) {
            options.equals = equals;
        }
        if (!options.maxKeys) {
            options.maxKeys = 1000;
        }
        return options;
    }
    var QueryString = {};
    /**
     * Encode a query object into a query string
     *
     * @public
     * @param   {Object}    query
     * @param   {Object}    options
     * @return  {String}
     */
    QueryString.encode = function (query, options) {
        options = defaults(options);
        var segments = [];
        for (var key in query) {
            if (query.hasOwnProperty(key)) {
                var value = query[key];
                if (isArray(value)) {
                    for (var i = 0; i < value.length; i++) {
                        segments.push([
                            options.encode(key),
                            options.equals,
                            options.encode(value[i])
                        ].join(''));
                    }
                } else {
                    segments.push([
                        options.encode(key),
                        options.equals,
                        options.encode(value)
                    ].join(''));
                }
            }
        }
        return segments.join(options.separator);
    };
    /**
     * Decode a query string into a query object
     *
     * @public
     * @param   {String}    query
     * @param   {Object}    options
     * @return  {Object}
     */
    QueryString.decode = function (query, options) {
        options = defaults(options);
        query = trim(query.replace(/^\?+/g, ''));
        var hash = {};
        if (typeof query != 'string' || query.length === 0) {
            return hash;
        }
        var regexp = /\+/g;
        query = query.split(options.separator);
        var maxKeys = options.maxKeys;
        var len = query.length;
        // maxKeys <= 0 means that we should not limit keys count
        if (maxKeys > 0 && len > maxKeys) {
            len = maxKeys;
        }
        for (var i = 0; i < len; ++i) {
            var x = query[i].replace(regexp, '%20');
            var idx = x.indexOf(options.equals);
            var kstr, vstr, k, v;
            if (idx >= 0) {
                kstr = x.substr(0, idx);
                vstr = x.substr(idx + 1);
            } else {
                kstr = x;
                vstr = '';
            }
            k = options.decode(kstr);
            v = options.decode(vstr);
            if (!hash.hasOwnProperty(k)) {
                hash[k] = v;
            } else if (isArray(hash[k])) {
                hash[k].push(v);
            } else {
                hash[k] = [hash[k], v];
            }
        }
        return hash;
    };
    /**
     * Alias for decode
     */
    QueryString.parse = QueryString.decode;
    /**
     * Alias for encode
     */
    QueryString.stringify = QueryString.encode;
    // UMD bullshit
    if (typeof define == 'function' && define.amd) {
        define(name, [], QueryString);
    } else if (typeof module == 'object') {
        module.exports = QueryString;
    } else {
        this[name] = QueryString;
    }
}).call(this, 'querystring', 'encodeURIComponent', 'decodeURIComponent', '&', '=');
