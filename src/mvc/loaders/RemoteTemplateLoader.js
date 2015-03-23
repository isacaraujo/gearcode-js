(function ($, gc, mvc) {
    "use strict";
    
    var TemplateCache = {};
    
    /** @namespace */
    mvc.loaders = mvc.loaders || {};
    
    /** @class */
    mvc.loaders.RemoteTemplateLoader = mvc.loaders.BaseTemplateLoader.extend({
        
        options: {
            uri: '',
            useCache: true
        },
        
        load: function () {
            if (this.options.useCache && 
                typeof(TemplateCache[this.options.uri]) !== 'undefined') {
                this.onLoad(TemplateCache[this.options.uri]);
                return;
            }
            $.get(this.options.uri)
             .done(this.callback(this.onLoad))
             .fail(this.callback(this.onFail));
        },
        
        onLoad: function (content) {
            if (this.options.useCache) {
                TemplateCache[this.options.uri] = content;
            }
            this._node = $(content).get(0);
            this.dispatch('load', { loader: this });
        },
        
        onFail: function () {
            this.dispatch('fail', { loader: this });
        }
    });
    
}(jQuery, window.gc = window.gc || {}, gc.mvc = gc.mvc || {}));
