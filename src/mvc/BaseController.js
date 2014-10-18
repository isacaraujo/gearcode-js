(function ($, gc) {
    "use strict";
    
    /** @namespace */
    gc.mvc = gc.mvc || {};
    
    /** @imports */
    var RemoteLoader = gc.mvc.loaders.RemoteTemplateLoader;
    var LocalLoader  = gc.mvc.loaders.LocalTemplateLoader;
    
    /** @class */
    var BaseController = gc.mvc.BaseController = gc.core.EventDispatcher.extend({
        
        statics: {
            _baseUrl: '',
            
            setBaseURL: function (url) {
                this._baseUrl = url;
            },
            
            baseURL: function () {
                return this._baseUrl;
            }
        },
        
        options: {
            template: {
                type:     'local',
                uri:      '',
                selector: ''
            }
        },
        
        /** @var jQuery */
        $view:   null,
        
        /** @var object */
        $model:  null,
        
        /** @var enum('none', 'loading', 'fail', 'done') */
        _status: null,
        
        init: function (options) {
            this._super();
            this.setOptions(options);
            this._status = 'none';
        },
        
        loadTemplate: function () {
            if (this._status == 'loading') return;
            if (this._status == 'done') return this.onLoad();
            var loader = this.getLoader();
            loader.on('load', this.onTemplateLoad, false, this);
            loader.on('fail', this.onTemplateFail, false, this);
            this._status = 'loading';
            loader.load();
        },
        
        onTemplateLoad: function (evt) {
            var loader = evt.detail.loader;
            loader.off('load', this.onTemplateLoad, false, this);
            loader.off('fail', this.onTemplateFail, false, this);
            this._status = 'done';
            var tpl = loader.node();
            this.setView(tpl);
            this.onLoad();
        },
        
        onTemplateFail: function (evt) {
            var loader = evt.detail.loader;
            loader.off('load', this.onTemplateLoad, false, this);
            loader.off('fail', this.onTemplateFail, false, this);
            this._status = 'fail';
            console.log("Template is unavailable.");
        },
        
        getLoader: function () {
            if ('local' === this.options.template.type) {
                return new LocalLoader({selector: this.options.template.selector});
            }
            return new RemoteLoader({
                uri: BaseController.baseURL() + this.options.template.uri
            });
        },
        
        onLoad: function () {
            //throw "The method onLoad must be implemented in child-class";
            this.dispatch('load', {controller: this});
        },
        
        setView: function (node) {
            this.$view = $(node);
        }
    });
    
}(jQuery, window.gc = window.gc || {}));
