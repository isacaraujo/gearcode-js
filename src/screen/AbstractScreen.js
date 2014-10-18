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
            this.loadAccessors();
        },

        loadAccessors: function () {
            this.sel().find('[data-accessor]').each(this.callback(this.onWalkAccessor));
        },

        onWalkAccessor: function (i, el) {
            var accessor = $(el).data('accessor');
            var options  = $(el).data('options') || {};
            var ClassBase = gc.display.DisplayObject;
            if ($(el).data('class')) {
                var classFragments = $(el).data('class').split('.');
                var len = classFragments.length;
                ClassBase = window;
                for (var i = 0; i < len; i++) {
                    var key = classFragments[i];
                    ClassBase = ClassBase[key];
                }
            }
            this[accessor] = new ClassBase(el);
        }
    });
    
}(jQuery, window.gc = window.gc || {}));
