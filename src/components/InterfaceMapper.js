/*jslint nomen: true */
/*global window*/
/*global jQuery*/

(function ($, gc) {
    "use strict";
    
    /** @namespace */
    gc.components = gc.components || {};
    
    /** @class */
    gc.components.InterfaceMapper = gc.core.EventDispatcher.extend({
        
        _elements:  null,
        _templates: null,
        _rootNode: null,
        
        init: function (rootNode) {
            this._super();
            this.setRootNode(rootNode);
            this.mapDocumentBody();
        },

        setRootNode: function (node) {
            node = node || 'body';
            var $node = $(node);
            if (!$node.length) $node = $('body');
            this._rootNode = $node.get(0);
        },
        
        mapDocumentBody: function () {
            this._elements = {};
            this._templates = {};
            $(this._rootNode).children().each(this.callback(function (i, item) {
                if ($(item).attr('data-role') == 'main') return;
                if ($(item).attr('id')) {
                    var className = $(item).attr('data-class'),
                        id = null;
                    if (className) {
                        var id = $(item).attr('id');
                        this._templates[className] = item;
                        $(item).remove();
                        this._elements[id] = className;
                        return;
                    }
                    id = $(item).attr('id');
                    this._elements[id] = item;
                    $(item).remove();
                    return;
                }
                if ($(item).attr('data-class')) {
                    var className = $(item).attr('data-class');
                    this._templates[className] = item;
                    $(item).remove();
                }
            }));
            this.dispatch('complete');
        },
        
        instanciateClass: function (absoluteClassName, options) {
            var Cls = this.resolveClassByName(absoluteClassName);
            var template = this.getTemplateByClassName(absoluteClassName);
            if (template) {
                options = options || {};
                $.extend(options, { selector: template });
            }
            return new Cls(options);
        },
        
        getElementById: function (id) {
            if (typeof this._elements[id] == "string") {
                this._elements[id] = this.instanciateClass(this._elements[id]);
            }
            return this._elements[id];
        },
        
        getTemplateByClassName: function (className) {
            var template = this._templates[className];
            if (template) {
                template = $(template).clone().get(0);
            }
            return template;
        },
        
        resolveClassByName: function (className) {
            var classParts = className.split('.');
            var Cls = window;
            for (var i = 0; i < classParts.length; i++) {
                Cls = Cls[classParts[i]];
            }
            return Cls;
        }
    });
    
}(jQuery, window.gc = window.gc || {}));