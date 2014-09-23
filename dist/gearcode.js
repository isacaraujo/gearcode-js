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
    
}(jQuery));


/**
 * Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 * Inspired in base2-js and prototype.js
 */

/*global window*/
/*global jQuery*/
/*global Class*/
/*global xyz*/
/*jslint nomen: true */

(function ($) {
    var initializing = false,
        fnTest = /xyz/.test(function () { xyz; }) ? /\b_super\b/ : /.*/;
    // The base Class implementation (does nothing)
    window.Class = function () {};
  
    // Create a new Class that inherits from this class
    Class.extend = function (prop) {
        var _super = this.prototype,
            statics = null,
            prototype = null;
        
        // Instantiate a base class (but only create the instance,
        // don't run the init constructor)
        initializing = true;
        prototype = new this();
        initializing = false;
        
        statics = null;
        if (typeof prop.statics !== undefined) {
            statics = prop.statics;
            delete prop.statics;
        }
        
        // Copy the properties over onto the new prototype
        for (var name in prop) {
            if ('options' === name) {
                prototype[name] = prototype[name] || {};
                prototype[name] = $.extend(null, true, prototype[name], prop[name]);
                continue;
            }
            // Check if we're overwriting an existing function
            prototype[name] = typeof prop[name] == "function" && 
                typeof _super[name] == "function" && fnTest.test(prop[name]) ?
                    (function(name, fn) {
                        return function() {
                            var tmp = this._super;
                            
                            // Add a new ._super() method that is the same method
                            // but on the super-class
                            this._super = _super[name];
                            
                            // The method only need to be bound temporarily, so we
                            // remove it when we're done executing
                            var ret = fn.apply(this, arguments);        
                            this._super = tmp;
                            
                            return ret;
                        };
                    })(name, prop[name]) : prop[name];
        }
        
        // The dummy class constructor
        function Class() {
            // All construction is actually done in the init method
            if (!initializing && this.init) this.init.apply(this, arguments);
        }
        
        // Populate our constructed prototype object
        Class.prototype = prototype;
        
        // Enforce the constructor to be what we expect
        Class.prototype.constructor = Class;
        
        // And make this class extendable
        Class.extend = arguments.callee;
        
        if (null !== statics) {
            for (var key in statics) {
                Class[key] = statics[key];
            }
        }
        
        return Class;
    };
}(jQuery));


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

/**
 * Class EventDispatcher
 */
/*jslint nomen: true */
/*global window*/
/*global document*/
/*global jQuery*/

(function ($, gc) {
    "use strict";
    
    var htmlEvents = { // list of real events
        // <body> and <frameset> Events
        onload: 1,
        onunload: 1,
        onscroll: 1,
        onresize: 1,
        // Form Events
        onblur: 1,
        onchange: 1,
        onfocus: 1,
        onreset: 1,
        onselect: 1,
        onsubmit: 1,
        // Image Events
        onabort: 1,
        // Keyboard Events
        onkeydown: 1,
        onkeypress: 1,
        onkeyup: 1,
        // Mouse Events
        onclick: 1,
        ondblclick: 1,
        onmousedown: 1,
        onmousemove: 1,
        onmouseout: 1,
        onmouseover: 1,
        onmouseup: 1
    };
    
    /** @namespace */
    gc.core = gc.core || {};
    
    /** @class */
    gc.core.EventDispatcher = gc.core.Object.extend({
        
        _dispatcher: null,
        _listeners:  null,
        
        init: function (dispatcher) {
            this._dispatcher = dispatcher || document.createElement('div');
            this._listeners = [];
        },
        
        one: function (type, callback, useCapture, scope) {
            var listener = {
                type: type,
                callback: callback,
                useCapture: useCapture,
                scope: scope,
                one: true
            };
            this.addEventListener(listener);
        },
        
        on: function (type, callback, useCapture, scope) {
            var listener = {
                type: type,
                callback: callback,
                useCapture: useCapture,
                scope: scope
            };
            this.addEventListener(listener);
        },
        
        off: function (type, callback, useCapture, scope) {
            var i = 0;
            while (i < this._listeners.length) {
                var listener = this._listeners[i];
                if (type == listener.type && 
                    callback == listener.callback && 
                    useCapture == listener.useCapture && 
                    scope == listener.scope) {
                    this.removeEventListener(listener);
                    this._listeners.splice(i, 1);
                    continue;
                }
                i++;
            }
        },
        
        addEventListener: function (listener) {
            var self = this;
            function handleEvent (evt) {
                return self.handleEvent_(evt, listener);
            }
            listener.handleEvent = handleEvent;
            this._listeners.push(listener);
            
            if ("addEventListener" in this._dispatcher) {
                this._dispatcher.addEventListener(listener.type, listener.handleEvent, listener.useCapture);
            } else if ("attachEvent" in this._dispatcher && htmlEvents["on" + listener.type]) {
                this._dispatcher.attachEvent("on" + listener.type, listener.handleEvent);
            } else {
                if (typeof this._dispatcher["on" + listener.type] !== "function") {
                    this._dispatcher["on" + listener.type] = function (evt) {
                        return self.triggerDomEvents(evt);
                    };
                }
            }
        },
        
        removeEventListener: function (listener) {
            if ("removeEventListener" in this._dispatcher) {
                this._dispatcher.removeEventListener(listener.type, listener.handleEvent, listener.useCapture);
            } else if ("detachEvent" in this._dispatcher) {
                this._dispatcher.detachEvent("on" + listener.type, listener.handleEvent);
            } else {
                // this._dispatcher["on" + listener.type] = null;
            }
        },
        
        /**
         * Compliance para controle de eventos em navegadores baseados em
         * IE < 9 */
        triggerDomEvents: function (evt) {
            var i = 0;
            while (i < this._listeners.length) {
                var listener = this._listeners[i],
                    len = this._listeners.length;
                if (listener.type.toLowerCase() == evt.eventType.toLowerCase()) {
                    this.handleEvent(evt, listener);
                }
                if (len == this._listeners.length) {
                    i++;
                }
            }
        },
        
        handleEvent_: function (evt, listener) {
            var i = 0;
            while (i < this._listeners.length) {
                if (this._listeners[i] == listener) {
                    var retVal = listener.callback.call(listener.scope, evt);
                    if (listener.one) {
                        this.off(listener.type, listener.callback, listener.useCapture, listener.scope);
                    }
                    if (false === retVal) {
                        evt.preventDefault && evt.preventDefault();
                    }
                    return retVal;
                }
                i++;
            }
        },
        
        dispatch: function (type, data) {
            data = data || {};
            
            var event;
            if (document.createEvent) {
                event = document.createEvent('CustomEvent');
                event.initCustomEvent(type, true, true, data);
            } else if (document.createEventObject) { // IE < 9
                event = document.createEventObject();
                event.eventType = type;
                event.detail = data;
            }
            
            event.eventName = type;
            
            if (this._dispatcher.dispatchEvent) {
                this._dispatcher.dispatchEvent(event);
            } else if (this._dispatcher.fireEvent && htmlEvents["on" + type]) {
                // IE < 9 and valid Event
                this._dispatcher.fireEvent('on' + event.eventType, event);    
            } else if (this._dispatcher[type]) {
                this._dispatcher[type](event);
            } else if (this._dispatcher['on' + type]) {
                this._dispatcher['on' + type](event);
            }
        }
    });
    
}(jQuery, window.gc = window.gc || {}));


/*global window*/
/*global jQuery*/
(function ($, gc) {
    "use strict";
    
    /** @namespace */
    var graph = gc.graph = gc.graph || {};
    
    /** @function */
    graph.RectMake = function (x, y, width, height) {
        var point = graph.PointMake(x, y);
        var size  = graph.SizeMake(width, height);
        return {
            size:  graph.SizeMake(width, height),
            point: graph.PointMake(x, y)
        };
    };
    
    /** @function */
    graph.RectMakeZero = function () {
        return graph.RectMake(0, 0, 0, 0);
    };
    
    /** @function */
    graph.PointMake = function (x, y) {
        return {
            x: parseFloat(x),
            y: parseFloat(y)
        };
    };
    
    /** @function */
    graph.PointMakeZero = function () {
        return graph.PointMake(0, 0);
    };
    
    /** @function */
    graph.Point3dMake = function (x, y, z) {
        return {
            x: parseFloat(x),
            y: parseFloat(y),
            z: parseFloat(z)
        };
    };
    
    /** @function */
    graph.Point3dMakeZero = function () {
        return graph.Point3dMake(0, 0, 0);
    };
    
    /** @function */
    graph.SizeMake = function (width, height) {
        return {
            width:  parseFloat(width),
            height: parseFloat(height)
        };
    };
    
    /** @function */
    graph.SizeMakeZero = function () {
        return graph.SizeMake(0, 0);
    };
    
    /** @function */
    graph.WindowSize = function () {
        return graph.SizeMake($(window).width(), $(window).height());
    };
    
    /** @function */
    graph.RectAlignCenter = function () {
        var p1, p2;
        if (arguments.length === 1) {
            p1 = graph.WindowSize();
            p2 = graph.SizeFromRect(arguments[0]);
        }
        else if (arguments.length > 1) {
            p1 = graph.SizeFromRect(arguments[0]);
            p2 = graph.SizeFromRect(arguments[1]);
        }
        else {
            throw new Error('Argument 1 is required');
        }
        var x, y;
        x = (p1.width - p2.width) / 2;
        y = (p1.height - p2.height) / 2;
        return graph.RectMake(x, y, p2.width, p2.height);
    };
    
    /** @function */
    graph.RectAlignLeft = function () {
        var x, y;
        if (arguments.length == 1) {
            x = 0;
            y = arguments[0].point.y;
        }
        else if (arguments.length > 1) {
            x = arguments[1].point.x;
            y = arguments[1].point.y;
        }
        else {
            throw new Error('Argument 1 is required');
        }
        return graph.RectMake(x, y, p2.size.width, p2.size.height);
    };
    
    /** @function */
    graph.RectAlignRight = function () {
        var p1, p2, x, y;
        if (arguments.length == 1) {
            p1 = graph.WindowSize();
            p2 = graph.SizeFromRect(arguments[0]);
            y  = arguments[0].point.y;
        }
        else if (arguments.length > 1) {
            p1 = graph.SizeFromRect(arguments[0]);
            p2 = graph.SizeFromRect(arguments[1]);
            y  = arguments[1].point.y;
        }
        else {
            throw new Error('Argument 1 is required');
        }
        
        x = p1.width - p2.width;
        
        return graph.RectMake(x, y, p2.width, p2.height);
    };
    
    /** @function */
    graph.SizeFromRect = function (rect) {
        if (rect.size) {
            return rect.size;
        }
        else if (rect.width && rect.height) {
            return rect;
        }
        return graph.SizeMakeZero();
    };
    
    /** @function */
    graph.PointFromRect = function (rect) {
        if (rect.point) {
            return rect.point;
        }
        else if (rect.x && rect.y) {
            return rect;
        }
        return graph.PointMakeZero();
    };
    
    /** @function */
    graph.TransformMake = function (scaleX, rotateX, rotateY, scaleY, translateX, translateY) {
        return {
            scaleX:     parseFloat(scaleX),
            rotateX:    parseFloat(rotateX),
            rotateY:    parseFloat(rotateY),
            scaleY:     parseFloat(scaleY),
            translateX: parseFloat(translateX),
            translateY: parseFloat(translateY)
        };
    };
    
    /** @function */
    graph.TransformMakeZero = function () {
        return graph.TransformMake(1, 0, 0, 1, 0, 0);
    };
    
    /** @function */
    graph.Transform3dMake = function (scaleX, a0, b0, c0, d0, scaleY, a1, b1, c1, d1, scaleZ, a2, translateX, translateY, translateZ, b2) {
        return {
            scaleX:      parseFloat(scaleX),
            a0:          parseFloat(a0),
            b0:          parseFloat(b0),
            c0:          parseFloat(c0),
            d0:          parseFloat(d0),
            scaleY:      parseFloat(scaleY),
            a1:          parseFloat(a1),
            b1:          parseFloat(b1),
            c1:          parseFloat(c1),
            d1:          parseFloat(d1),
            scaleZ:      parseFloat(scaleZ),
            a2:          parseFloat(a2),
            translateX:  parseFloat(translateX),
            translateY:  parseFloat(translateY),
            translateZ:  parseFloat(translateZ),
            b2:          parseFloat(b2)
        };
    };
    
    /** @function */
    graph.Transform3dMakeZero = function () {
        return graph.Transform3dMake(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    };
    
}(jQuery, window.gc = window.gc || {}));


(function ($, gc) {
    "use strict";
    
    /**
     * @main gc
     * @module gc
     **/
    gc.display = gc.display || {};
    
    var PointMake = gc.graph.PointMake,
        PointMake3d = gc.graph.PointMake3d,
        PointMakeZero = gc.graph.PointMakeZero,
        TransformMake = gc.graph.TransformMake,
        TransformMakeZero = gc.graph.TransformMakeZero,
        Transform3dMake = gc.graph.Transform3dMake,
        Transform3dMakeZero = gc.graph.Transform3dMakeZero;
    
    /**
     * Classe representativa de um objeto visual DOM.
     * @class gc.display.DisplayObject
     * @extends gc.core.EventDispatcher
     * @uses gc.display.ScrollView
     * @constructor
     * @param {Object} [options]* Zero or more optional configuration objects.
     **/
    gc.display.DisplayObject = gc.core.EventDispatcher.extend({
        
        options: {
            selector: null
        },
        
        /**
         * Objeto nativo visual.
         * @property _element
         * @private
         * @type Node
         * @default `div`
         */
        _element: null,
        
        
        /**
         * Construtor
         * @method init
         * @param {Object} [options] Configuração inicial do objeto
         *  @param {String} [options.selector] Seletor jQuery. Default `div`.
         **/
        init: function (options) {
            this.setupElementOrOptions(options);
            this._super(this._element);
        },
        
        
        /**
         * Construtor da classe
         * @method setupElementOrOptions
         * @private
         * @param {Object} [options] Objeto ou string indicando a configuração inicial
         *  @param {String} [options.selector] Seletor jQuery. Default `div`.
         **/
        setupElementOrOptions: function (options) {
            if (!options) options = {};
            
            if (options instanceof jQuery) {
                options = options.get(0);
            }
            if (typeof options['getAttribute'] !== "undefined" || 
                -1 !== $.inArray(options, [document, window, document.body]) || 
                typeof options === "string") {
                options = { selector: options };
            }
            
            this.setOptions(options);
            var selector = this.get('selector');
            if (!selector) {
                this._element = document.createElement('div');
                return;
            }
            this._element = $(selector).get(0);
        },
        
        
        /**
         * Captura o seletor do objeto.
         * @method sel
         * @public
         * @return {jQuery} Retorna uma instancia jQuery 
         **/
        sel: function () {
            return $(this._element);
        },
        
        
        /**
         * Retorna o elemento.
         * @method e
         * @public
         * @return {Node} Instacia de um objeto DOM.
         **/
        e: function () {
            return this._element;
        },
        
        
        /**
         * Retorna a posição espacial do objeto. Este objeto pode conter 6 ou 16 propriedades.
         * @method getTransform
         * @public
         * @return {Object} Retorna um objeto com as coordenadas espaciais do elemento.
         **/
        getTransform: function () {
            var matrix = this.sel().css('transform');
            if ('' == matrix || null == matrix || 'none' == matrix || undefined == matrix) return TransformMakeZero();
            var parts = matrix.replace(/matrix(3d)?\(/, '').replace(')', '').split(', ');
            if (parts.length == 6) {
                return TransformMake.apply(null, parts);
            }
            if (parts.length == 16) {
                return Transform3dMake.apply(null, parts);
            }
            return TransformMakeZero();
        },
        
        
        /**
         * Define coordenadas espaciais do objeto.
         * @method setTransform
         * @public
         * @param {Object} [params] Objeto gerado pela function TransformMake
         **/
        setTransform: function (params) {
            var matrix = TransformMakeZero();
            matrix = $.extend(matrix, params);
            var matrixParams = [matrix.scaleX, matrix.rotateX, matrix.rotateY, matrix.scaleY, matrix.translateX, matrix.translateY].join(', ');
            this.sel().css('transform', 'matrix(' + matrixParams + ')');
        },
        
        
        /**
         * Define coordenadas espaciais 3d do objeto.
         * @method setTransform3d
         * @public
         * @param {Object} [params] Objeto gerado pela function TransformMake3d
         **/
        setTransform3d: function (params) {
            var matrix = Transform3dMakeZero();
            matrix = $.extend(matrix, params);
            var matrixParams = [matrix.scaleX, matrix.a0, matrix.b0, matrix.c0, matrix.d0, 
                                matrix.scaleY, matrix.a1, matrix.b1, matrix.c1, matrix.d1,
                                matrix.scaleZ, matrix.a2, matrix.translateX, matrix.translateY, matrix.translateZ, 
                                matrix.b2].join(', ');
            this.sel().css('transform', 'matrix3d(' + matrixParams + ')');
        },
        
        
        /**
         * Retorna a posição espacial x e y do objeto.
         * @method getTranslate
         * @public
         * @return {Object} Coordenadas x e y
         **/
        getTranslate: function () {
            var supportTransform = $('html').hasClass('csstransforms');
            if (supportTransform) {
                var transform = this.getTransform();
                return PointMake(transform.translateX, transform.translateY);
            }
            var left = this.sel().css('left'),
                top  = this.sel().css('top');
            left = left == '' ? 0 : left;
            top  = top == '' ? 0 : top;
            return PointMake(left, top);
        }
    });
    
    $.document = (function () {
        return new gc.display.DisplayObject(document);
    }());
    
    $.window = (function () {
        return new gc.display.DisplayObject(window);
    }());
    
}(jQuery, window.gc = window.gc || {}));


(function ($, gc) {
    "use strict";
    
    
    /**
     * @main gc
     * @module gc
     **/
    gc.display = gc.display || {};
    
    
    /**
     * Interface visual botão, extende o comportamento de um botão nativo, 
     * com comportamentos e métodos intuitivos e uma interface amigável.
     * @class gc.display.Button
     * @extends gc.display.DisplayObject
     * @constructor
     * @param {Object} [options]* Zero or more optional configuration objects.
     **/
    gc.display.Button = gc.display.DisplayObject.extend({
        
        statics: {
            /**
             Garante que o evento de clique seja unico.
             @static
             @property handlerInUse
             @type Bollean
             @default false
             **/
            handlerInUse: false
        },
        
        
        /**
         Representa o timestamp do clique.
         @private
         @property _touchstartTime
         @type Number
         @default null
         **/
        _touchstartTime: null,
        
        
        init: function (options) {
            this._super(options);
            this.setupEvents();
        },
        
        
        /**
         Inicializa os eventos de um botão.
         @method setupEvents 
         **/
        setupEvents: function () {
            if (!$.isMobile) { return; }
            this.on($.Events.touchstart, this.onTouchstart, false, this);
        },
        
        
        /**
         Recebe o evento de interação do usuário.
         @method onTouchstart
         @private
         @param {MouseEvent} evt Evento do botão
         **/
        onTouchstart: function (evt) {
            if (gc.display.Button.handlerInUse) { return; }
            if (evt.preventDefault) { evt.preventDefault(); }
            gc.display.Button.handlerInUse = true;
            var self = this;
            function handleTouchend(evt) {
                $(document).off($.Events.touchend, handleTouchend);
                if (evt.originalEvent.target === self.e()) {
                    self.dispatch('click');
                }
                gc.display.Button.handlerInUse = false;
            }
            $(document).on($.Events.touchend, handleTouchend);
        }
    });
    
}(jQuery, window.gc = window.gc || {}));


/*jslint nomen: true */
/*global window*/
/*global document*/
/*global jQuery*/
/*global TweenMax*/
(function ($, gc) {
    "use strict";
    
    /** @namespace */
    gc.display = gc.display || {};
    gc.events = gc.events || {};
    
    /** @import */
    var graphSizeMake = gc.graph.SizeMake,
        graphPointMake = gc.graph.PointMake,
        graphPointMakeZero = gc.graph.PointMakeZero,
        graphRectMake = gc.graph.RectMake;
    
    gc.events.ScrollEvent = {
        SCROLL: "scrollDidScroll"
    };
    
    /** @class */
    gc.display.ScrollView = gc.display.DisplayObject.extend({
        
        options: {
            size: null,
            contentSize: null,
            scrollX: true,
            scrollY: true,
            pagination: false,
            pageSize: null,
            bounce: true,
            bouncePad: 40,
            useTranslate: true,
            useGpu: false
        },
        
        _window:   null,
        _document: null,
        _viewport: null,
        _content:  null,
        _bounds:   null,
        _bounceBounds: null,
        _lastMousePosition: null,
        _translate: null,
        _startPoint: null,
        _startTime: null,
        _hasChildren: null,
        
        init: function (options) {
            this._super(options);
            this.setupUI();
        },
        
        setupUI: function () {
            this._super();
            this._window   = new gc.display.DisplayObject(window);
            this._document = new gc.display.DisplayObject(document);
            this.sel().addClass('scrollview').css(this.options.size);
            var children = $(this._element).children();
            this._hasChildren = children.length > 0;
            children.remove();
            this.setupViewport();
            this.setupContent();
            this._content.sel().append(children);
            this.setupEvents();
            this.setupBounds();
        },
        
        destroy: function () {
            var children = null;
            if (this._hasChildren) {
                children = this.getContent().sel().children();
                children.remove();
            }
            TweenMax.killTweensOf(this._content.e());
            this.removeEvents();
            this._content.sel().remove(),  this._content  = null;
            this._viewport.sel().remove(), this._viewport = null;
            this.sel().removeClass('scrollview');
            this.sel().removeAttr('style');
            if (children) {
                this.sel().append(children);
            }
        },
        
        setupViewport: function () {
            this._viewport = new gc.display.DisplayObject();
            this._viewport.sel()
                .addClass('scrollview-viewport')
                .css(this.options.size)
                .appendTo(this._element);
        },
        
        setupContent: function () {
            this._content = new gc.display.DisplayObject();
            this._content.sel()
                .addClass('scrollview-content')
                .css(this.options.contentSize)
                .appendTo(this._viewport.e());
        },
        
        setupEvents: function () {
            this._viewport.on($.Events.touchstart, this.onHandleDown, false, this);
        },
        
        removeEvents: function () {
            this._viewport.off($.Events.touchstart, this.onHandleDown, false, this);
        },
        
        setupBounds: function () {
            var width  = this.options.contentSize.width - this.options.size.width,
                height = this.options.contentSize.height - this.options.size.height,
                x = 0,
                y = 0,
                padX = this.options.bouncePad,
                padY = this.options.bouncePad;
            if (width < 0) {
                x = width = padX = 0;
            }
            if (height < 0) {
                x = height = padY = 0;
            }
            this._bounds = graphRectMake(x, y, width, height);
            if (this.options.bounce) {
                this._bounceBounds = graphRectMake(x + padX, y + padY, width + padX, height + padY);
            } else {
                this._bounceBounds = null;
            }
        },
        
        setSize: function (size) {
            this.set('size', size);
            this.sel().css(size);
            this._viewport.sel().css(size);
            this.setupBounds();
        },
        
        setContentSize: function (size) {
            this.set('contentSize', size);
            this._content.sel().css(size);
            this.setupBounds();
        },
        
        fitPointToBounds: function (point, addBounce) {
            var bounds = this._bounds;
            if (addBounce && this.options.bounce) {
                bounds = this._bounceBounds;
            }
            if (this.options.scrollX) {
                if (point.x > bounds.point.x) {
                    point.x = bounds.point.x;
                }
                if (point.x < -bounds.size.width) {
                    point.x = -bounds.size.width;
                }
            } else {
                point.x = 0;
            }
            if (this.options.scrollY) {
                if (point.y > bounds.point.y) {
                    point.y = bounds.point.y;
                }
                if (point.y < -bounds.size.height) {
                    point.y = -bounds.size.height;
                }
            } else {
                point.y = 0;
            }
        },
        
        onHandleDown: function (evt) {
            TweenMax.killTweensOf(this._content.e());
            this.setupBounds();
            this._lastMousePosition = this.getMouseCoordinates(evt);
            this._translate = this._content.getTranslate();
            this._startPoint = graphPointMake(this._translate.x, this._translate.y);
            this._startTime = (new Date()).getTime();
            this._document.on($.Events.touchmove, this.onHandleMove, false, this);
            this._document.on($.Events.touchend, this.onHandleUp, false, this);
        },
        
        onHandleMove: function (evt) {
            var pos = this.getMouseCoordinates(evt);
            this._translate.x += pos.x - this._lastMousePosition.x;
            this._translate.y += pos.y - this._lastMousePosition.y;
            this._lastMousePosition = pos;
            this.fitPointToBounds(this._translate, true);
            this.tryPreventDefault(evt);
            this.scrollToTranslate(this._translate, false);
        },
        
        onHandleUp: function (evt) {
            this._document.off($.Events.touchmove, this.onHandleMove, false, this);
            this._document.off($.Events.touchend,   this.onHandleUp, false, this);
            var endPoint, accelerateTime, currentPoint, desllocPoint, deceleratePoint;
            if (this.options.pagination) {
                endPoint = this.getAppropriatePageTranslate();
                this.fitPointToBounds(endPoint);
                this.scrollToTranslate(endPoint, true);
                return;
            }
            accelerateTime = (new Date()).getTime() - this._startTime;
            currentPoint = this._content.getTranslate();
            desllocPoint = graphPointMake(currentPoint.x - this._startPoint.x, currentPoint.y - this._startPoint.y);
            deceleratePoint = this.getDecelerateDistancePoint(accelerateTime, desllocPoint);
            endPoint = graphPointMake(currentPoint.x + (deceleratePoint.x * 3), currentPoint.y + (deceleratePoint.y * 3));
            this.fitPointToBounds(endPoint);
            this.scrollToTranslate(endPoint, true);
        },
        
        tryPreventDefault: function (evt) {
            var x = false, y = false;
            if (this.options.scrollX && this._translate.x > 0) x = true;
            if (this.options.scrollY && this._translate.y > 0) x = true;
            if ((x || y) && evt.stopPropagation) evt.stopPropagation();
        },
        
        getMouseCoordinates: function (evt) {
            if (undefined !== evt.clientX && undefined !== evt.clientY) {
                return graphPointMake(evt.clientX, evt.clientY);
            }
            if (undefined !== evt.targetTouches[0]) {
                return graphPointMake(evt.targetTouches[0].clientX, evt.targetTouches[0].clientY);
            }
            return graphPointMakeZero();
        },
        
        getDecelerateDistancePoint: function (accelerateTime, desllocPoint) {
            return graphPointMake(
                desllocPoint.x === 0 ? 0 : desllocPoint.x / (accelerateTime * accelerateTime) * 10000,
                desllocPoint.y === 0 ? 0 : desllocPoint.y / (accelerateTime * accelerateTime) * 10000
            );
        },
        
        getCurrentPage: function () {
            var page = this.options.pageSize,
                translate = this._content.getTranslate(),
                _x = -translate.x / page.width,
                _y = -translate.y / page.height,
                mathAction = { x: "round", y: "round" };
            
            if (translate.x > this._startPoint.x) {
                if ((translate.x - this._startPoint.x) > 80) { mathAction.x = "floor"; }
            } else {
                if ((this._startPoint.x - translate.x) > 80) { mathAction.x = "ceil"; }
            }
            
            if (translate.y > this._startPoint.y) {
                if ((translate.y - this._startPoint.y) > 80) { mathAction.y = "floor"; }
            } else {
                if ((this._startPoint.y - translate.y) > 80) { mathAction.y = "ceil"; }
            }
            
            return graphPointMake(Math[mathAction.x](_x), Math[mathAction.y](_y));
        },
        
        getAppropriatePageTranslate: function () {
            var page = this.options.pageSize,
                curPage = this.getCurrentPage();
            
            return graphPointMake(
                page.width * curPage.x  * -1,
                page.height * curPage.y * -1
            );
        },
        
        scrollToTranslate: function (endPoint, animated) {
            this._translate = endPoint;
            var supportTransform = $('html').hasClass('csstransforms');
            if (animated) {
                var temp;
                if (supportTransform) {
                    temp = { x: this._translate.x, y: this._translate.y };
                    if (this.options.useGpu) temp['z'] = 1;
                } else {
                    temp = { left: this._translate.x, top: this._translate.y };
                }
                TweenMax.killTweensOf(this._content.e());
                TweenMax.to(this._content.e(), 0.3, $.extend({
                    onUpdate: this.callback(function () {
                        if (supportTransform) {
                            this._translate = graphPointMake(this._content.e()._gsTransform.x, this._content.e()._gsTransform.y);
                        } else {
                            this._translate = graphPointMake(this._content.sel().css('left'), this._content.sel().css('top'));
                        }
                        this.dispatch(gc.events.ScrollEvent.SCROLL);
                    }),
                    onComplete: this.callback(function () {
                        if (supportTransform) {
                            this._translate = graphPointMake(this._content.e()._gsTransform.x, this._content.e()._gsTransform.y);
                        } else {
                            this._translate = graphPointMake(this._content.sel().css('left'), this._content.sel().css('top'));
                        }
                        this.dispatch(gc.events.ScrollEvent.SCROLL);
                    }),
                    ease: 'Quad.easeOut'
                }, temp));
                return;
            }
            if (supportTransform) {
                var methodType = this.options.useGpu ? 
                                'setTransform3d' : 
                                'setTransform';
                this._content[methodType]({
                    translateX: this._translate.x,
                    translateY: this._translate.y
                });
            } else {
                this._content.sel().css({
                    left: this._translate.x,
                    top: this._translate.y
                });
            }
            this.dispatch(gc.events.ScrollEvent.SCROLL);
        },
        
        getContent: function () {
            return this._content;
        },
        
        getTranslate: function () {
            return this._translate;
        }
    });
    
}(jQuery, window.gc = window.gc || {}));


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
        
        init: function () {
            this._super();
            this.mapDocumentBody();
        },
        
        mapDocumentBody: function () {
            this._elements = {};
            this._templates = {};
            $('body').children().each(this.callback(function (i, item) {
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

(function ($, gc) {
    
    gc.components = gc.components || {};
    
    gc.components.TemplateEngine = gc.core.EventDispatcher.extend({
        
        statics: {
            
            compile: function (ui, params) {
                if (!params) return;
                for (var key in params) {
                    if (params.hasOwnProperty(key)) {
                        var search = "{{ " + key + " }}";
                        ui = this.replace(ui, search, params[key]);
                    }
                }
                return $(ui).get(0);
            },
            
            replace: function (ui, from, to) {
                var lines = ui.split("\n");
                var len = lines.length;
                for (var i = 0; i < len; i++) {
                    while (lines[i].indexOf(from) > -1) {
                        lines[i] = lines[i].replace(from, to);
                    }
                }
                return lines.join("\n");
            }
        }
    });
    
}(jQuery, window.gc = window.gc || {}));


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
                this._baserl = url;
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


(function ($, gc) {
    "use strict";
    
    /** @namespace */
    gc.mvc = gc.mvc || {};
    
    /** @class */
    gc.mvc.ModalController = gc.mvc.BaseController.extend({
        
        options: {
            overlayColor: '#000000',
            dismissOnClickOverlay: true,
            contentTop: '24px',
            contentWidth: '66%',
            contentBg: 'white'
        },
        
        $content: null,
        
        show: function () {
            this.loadTemplate();
        },
        
        setView: function (node) {
            var $lay = this.getOverlay();
            this.$content = $lay.children('.gc-modal-content');
            this.$content.append(node);
            this._super($lay.get(0));
        },
        
        onLoad: function () {
            this.$view
                .hide()
                .appendTo($.document.e().body)
                .fadeIn('fast', this.callback(this.onFadeIn));
            this.onWindowResize();
        },
        
        onFadeIn: function () {
            this.options.dismissOnClickOverlay && 
                this.$view
                    .children('.gc-modal-overlay')
                    .on('click', this.callback(this.hide));
            $.window.on('resize', this.onWindowResize, false, this);
            this.onWindowResize();
            this.dispatch('show', { controller: this });
        },
        
        onWindowResize: function (evt) {
            var w = this.$content.width();
            var bodyW = $($.document.e().body).width();
            this.$content.css('left', Math.max((bodyW - w) / 2, 0));
        },
        
        hide: function () {
            $.window.off('resize', this.onWindowResize, false, this);
            this.$view
                .children('.gc-modal-overlay')
                .off('click');
            this.$view
                .fadeOut('fast', this.callback(this.onFadeOut));
        },
        
        onFadeOut: function () {
            this.$view.remove();
            this.$view = null;
            this.dispatch('hide', { controller: this });
        },
        
        getOverlay: function () {
            var $overlay = $('<div class="gc-modal">' + 
                '<div class="gc-modal-overlay"></div>' + 
                '<div class="gc-modal-content"></div>' + 
            '</div>');
            $overlay.css({
                position: 'absolute',
                width: '100%',
                height: '100%',
                top: 0,
                left: 0
            });
            $overlay.children('.gc-modal-overlay').css({
                position: 'absolute',
                width: '100%',
                height: '100%',
                top:  0,
                left: 0,
                backgroundColor: this.options.overlayColor,
                opacity: 0.8
            });
            $overlay.children('.gc-modal-content').css({
                position:   'absolute',
                width:      this.options.contentWidth,
                height:     'auto',
                top:        this.options.contentTop,
                left:       '20%',
                backgroundColor: this.options.contentBg
            });
            return $overlay;
        }
    });
    
}(jQuery, window.gc = window.gc || {}));
