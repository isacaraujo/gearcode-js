(function ($, gc, mvc) {
    "use strict";
    
    /** @namespace */
    mvc.loaders = mvc.loaders || {};
    
    /** @class */
    mvc.loaders.LocalTemplateLoader = mvc.loaders.BaseTemplateLoader.extend({
        
        options: {
            selector: ''
        },
        
        load: function () {
            var node = $(this.options.selector).get(0);
            if (node.nodeName.toLowerCase() == 'script') {
                var temp = $(node).html();
                temp = temp.replace(/\n+/g, " ")
                           .replace(/\r+/g, " ")
                           .replace(/\t+/g, " ")
                           .replace(/\s+/g, " ").trim();
                node = $(temp).get(0);
            }
            this._node = node;
            setTimeout(this.callback(this.onLoad), 10);
        },
        
        onLoad: function () {
            this.dispatch('load', { loader: this });
        }
    });
    
}(jQuery, window.gc = window.gc || {}, gc.mvc = gc.mvc || {}));
