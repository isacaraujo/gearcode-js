(function ($, gc, mvc) {
    "use strict";
    
    /** @namespace */
    mvc.loaders = mvc.loaders || {};
    
    /** @class */
    mvc.loaders.RemoteTemplateLoader = mvc.loaders.BaseTemplateLoader.extend({
        
        options: {
            uri: ''
        },
        
        load: function () {
            $.get(this.options.uri)
             .done(this.callback(this.onLoad))
             .fail(this.callback(this.onFail));
        },
        
        onLoad: function (content) {
            this._node = $(content).get(0);
            this.dispatch('load', {loader: this});
        },
        
        onFail: function () {
            this.dispatch('fail', {loader: this});
        }
        
    });
    
}(jQuery, window.gc = window.gc || {}, gc.mvc = gc.mvc || {}));
