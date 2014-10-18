/**
 * Lib extends JS extensions
 * @plugin $.isMobile
 * @plugin $.Events
 */
/*global window*/
/*global jQuery*/
(function ($) {
    "use strict";
    /**
     * @plugin $.isMobile
     * @static
     * Check if this is a Mobile device.
     */
    $.isMobile = (function () {
        return (/ipad|android|ipod|iphone/i).test(window.navigator.userAgent);
    }());
    
    /**
     * @plugin $.Events
     * Facade for Mobile Events.
     */
    $.Events = (function () {
        return {
            touchstart: $.isMobile ? 'touchstart' : 'mousedown',
            touchmove:  $.isMobile ? 'touchmove'  : 'mousemove',
            touchend:   $.isMobile ? 'touchend'   : 'mouseup'
        };
    }());
    
    /**
     * @plugin $.callback
     * Create a generic callback constructor.
     */
    $.callback = function (callbackListener, scope) {
        return function () {
            var args = $.makeArray(arguments);
            return callbackListener.apply(scope, args);
        };
    };

    /**
     * @plugin $.ucfirst
     * Capitalize a word
     */
    $.ucfirst = function (text) {
        return text.charAt(0).toUpperCase() + text.substr(1);
    };

    /**
     * @plugin $.ucfirst
     * Capitalize all words in text
     */
    $.ucwords = function (text) {
        return $.map(text.split(' '), $.ucfirst).join(' ');
    };

    $.regexp = function (text) {
        text = text.replace(/\//g, "\\/")
                   .replace(/\./g, "\\.")
                   .replace(/\+/g, "\\+")
                   .replace(/\*/g, "\\*");
        return text;
    };
    
}(jQuery));
