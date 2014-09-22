(function ($, gc, mvc) {
    "use strict";
    
    /** @namespace */
    mvc.loaders = mvc.loaders || {};
    
    /** @class */
    mvc.loaders.BaseTemplateLoader = gc.core.EventDispatcher.extend({
        
        _node: null,
        
        init: function (options) {
            this._super();
            this.setOptions(options);
        },
        
        node: function () {
            return this._node;
        }
        
    });
    
}(jQuery, window.gc = window.gc || {}, gc.mvc = gc.mvc || {}));
