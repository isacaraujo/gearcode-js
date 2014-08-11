/*jslint nomen: true */
/*global window*/
/*global jQuery*/

(function ($, gc) {
    "use strict";
    
    /** @namespace */
    gc.screen = gc.screen || {};
    
    /** @class */
    gc.screen.AbstractScreen = gc.display.DisplayObject.extend({
        
        init: function (options) {
            this._super(options);
        }
    });
    
}(jQuery, window.gc = window.gc || {}));
