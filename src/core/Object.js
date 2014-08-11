/**
 * Class Base
 * Provide almost of methods for apps. All objects have to extends it.
 */

/*jslint nomen: true */
/*global window*/
/*global jQuery*/
/*global Class */

(function ($, gc) {
    "use strict";
    
    /** @namespace */
    gc.core = gc.core || {};
    
    /** @class */
    gc.core.Object = Class.extend({
        
        options: {},
        
        init: function (options) {
            this.setOptions(options);
        },
        
        callback: function (callbackListener) {
            return $.callback(callbackListener, this);
        },
        
        setOptions: function (options) {
            options = options || {};
            this.options = $.extend(true, {}, this.options, options);
        },
        
        get: function (key) {
            if (!this.options[key]) return null;
            return this.options[key];
        },
        
        set: function (key, value) {
            if (undefined !== this.options[key]) {
                this.options[key] = value;
            }
        }
    });
    
}(jQuery, window.gc = window.gc || {}));