require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 * Inspired in base2-js and prototype.js
 */

var $ = require('jquery');

var initializing = false,
    fnTest = /xyz/.test(function () { xyz; }) ? /\b_super\b/ : /.*/;

// The base Class implementation (does nothing)
var Class = function () {};

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

module.exports = Class;

},{"jquery":"jquery"}],2:[function(require,module,exports){
"use strict";

var GCObject = require('./Object');

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

var EventDispatcher = module.exports = GCObject.extend({
    
  _dispatcher: null,
  _listeners:  null,
  
  init: function (dispatcher) {
    this._dispatcher = dispatcher || document.createElement('div');
    this._listeners = [];
  },
  
  one: function (type, callback, useCapture, scope) {
    useCapture = useCapture || false;
    scope = scope || null;
    var listener = {
      type: type,
      callback: callback,
      useCapture: useCapture,
      scope: scope,
      one: true
    };
    this.addEventListener(listener);
    return this;
  },
  
  on: function (type, callback, useCapture, scope) {
    useCapture = useCapture || false;
    scope = scope || null;
    var listener = {
      type: type,
      callback: callback,
      useCapture: useCapture,
      scope: scope
    };
    this.addEventListener(listener);
    return this;
  },
  
  off: function (type, callback, useCapture, scope) {
    var i = 0;
    useCapture = useCapture || false;
    scope = scope || null;
    while (i < this._listeners.length) {
      var listener = this._listeners[i];
      if (type == listener.type && callback == listener.callback && useCapture == listener.useCapture && scope == listener.scope) {
        this.removeEventListener(listener);
        this._listeners.splice(i, 1);
        continue;
      }
      i++;
    }
    return this;
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
      this._dispatcher["on" + listener.type] = null;
    }
  },

  removeAllListeners: function () {
    while (this._listeners.length) {
      this.removeEventListener(this._listeners.pop());
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

},{"./Object":3}],3:[function(require,module,exports){
"use strict";

var Class = require('./Class'),
    $ = require('jquery'),
    utils = require('./utils');

var GCObject = module.exports = Class.extend({
    
  options: {},
  
  init: function (options) {
    this.setOptions(options);
  },
  
  callback: function (callbackListener) {
    return utils.callback(callbackListener, this);
  },
  
  setOptions: function (options) {
    options = options || {};
    this.options = $.extend(true, {}, this.options, options);
  },

  defineGetter: function (name, fnCallback) {
    Object.defineProperty(this, "$", { 
      get: fnCallback
    });
  },

  defineSetter: function (name, fnCallback) {
    Object.defineProperty(this, "$", { 
      set: fnCallback
    });
  },

  defineGetterSetter: function (name, fnGetter, fnSetter) {
    Object.defineProperty(this, "$", { 
      get: fnGetter,
      set: fnSetter
    });
  }
});

},{"./Class":1,"./utils":4,"jquery":"jquery"}],4:[function(require,module,exports){
"use strict";

var utils = {};
var $ = require('jquery')

/**
 * @plugin $.isMobile
 * @static
 * Check if this is a Mobile device.
 */
utils.isMobile = (function (a) {
return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a);
}(navigator.userAgent || navigator.vendor || window.opera));

/**
 * @plugin $.Events
 * Facade for Mobile Events.
 */
utils.Events = (function () {
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
utils.callback = function (callbackListener, scope) {
    return function () {
      var args = $.makeArray(arguments);
      return callbackListener.apply(scope, args);
    };
};

/**
 * @plugin $.ucfirst
 * Capitalize a word
 */
utils.ucfirst = function (text) {
  return text.charAt(0).toUpperCase() + text.substr(1);
};

/**
 * @plugin $.ucfirst
 * Capitalize all words in text
 */
utils.ucwords = function (text) {
  return $.map(text.split(' '), $.ucfirst).join(' ');
};

utils.regexp = function (text) {
  text = text.replace(/\//g, "\\/")
             .replace(/\./g, "\\.")
             .replace(/\+/g, "\\+")
             .replace(/\*/g, "\\*");
  return text;
};

utils.removeAccents = function (text) {
  var haystack    = "ãáàäâéèëêíìïîõóòöôúùüûç",
      replacement = 'aaaaaeeeeiiiiooooouuuuc';
  text = text.toLowerCase();
  for (var i = 0; i < haystack.length; i++) {
      var chr = haystack.charAt(i);
      var rep = replacement.charAt(i);
      text = text.replace(new RegExp(chr, 'g'), rep);
  }
  return text;
};

module.exports = utils;

},{"jquery":"jquery"}],5:[function(require,module,exports){
"use strict";

var graph = require('../graph'),
    jQuery = require('jquery'),
    $ = jQuery,
    EventDispatcher = require('../core/EventDispatcher');


var PointMake = graph.PointMake,
    PointMake3d = graph.PointMake3d,
    PointMakeZero = graph.PointMakeZero,
    TransformMake = graph.TransformMake,
    TransformMakeZero = graph.TransformMakeZero,
    Transform3dMake = graph.Transform3dMake,
    Transform3dMakeZero = graph.Transform3dMakeZero;

/**
 * Classe representativa de um objeto visual DOM.
 * @class gc.display.DisplayObject
 * @extends gc.core.EventDispatcher
 * @uses gc.display.ScrollView
 * @constructor
 * @param {Object} [options]* Zero or more optional configuration objects.
 **/
var DisplayObject = module.exports = EventDispatcher.extend({
    
  options: {
    selector: null
  },
  
  /**
   * Objeto nativo visual.
   * @property e
   * @private
   * @type Node
   * @default `div`
   */
  e: null,
  
  
  /**
   * Construtor
   * @method init
   * @param {Object} [options] Configuração inicial do objeto
   *  @param {String} [options.selector] Seletor jQuery. Default `div`.
   **/
  init: function (options) {
    this.setupElementOrOptions(options);
    this._super(this.e);
    this.defineGetter('$', function () {
      return jQuery(this.e)
    });
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
    var selector = this.options.selector;
    if (!selector) {
        this.e = document.createElement('div');
        return;
    }
    this.e = $(selector).get(0);
  },
  
  
  /**
   * Retorna a posição espacial do objeto. Este objeto pode conter 6 ou 16 propriedades.
   * @method getTransform
   * @public
   * @return {Object} Retorna um objeto com as coordenadas espaciais do elemento.
   **/
  getTransform: function () {
    var matrix = this.$.css('transform');
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
    this.$.css('transform', 'matrix(' + matrixParams + ')');
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
    this.$.css('transform', 'matrix3d(' + matrixParams + ')');
  },
  
  
  /**
   * Retorna a posição espacial x e y do objeto.
   * @method getTranslate
   * @public
   * @return {Object} Coordenadas x e y
   **/
  getTranslate: function () {
    var transform = this.getTransform();
    return PointMake(transform.translateX, transform.translateY);
  }
});

},{"../core/EventDispatcher":2,"../graph":9,"jquery":"jquery"}],6:[function(require,module,exports){
"use strict";

var $ = require('jquery'),
    DisplayObject = require('./DisplayObject'),
    graph = require('../graph'),
    utils = require('../core/utils'),
    TweenMax = require('gsap');

/** @import */
var graphSizeMake = graph.SizeMake,
    graphPointMake = graph.PointMake,
    graphPointMakeZero = graph.PointMakeZero,
    graphRectMake = graph.RectMake;

var ScrollEvent = {
    SCROLL: "scrollDidScroll"
};

var $document = new DisplayObject(document);

/** @class */
var ScrollView = module.exports = DisplayObject.extend({
    
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
      this._document = $document;
      this.$.addClass('scrollview').css(this.options.size);
      var children = $(this.e).children();
      this._hasChildren = children.length > 0;
      children.remove();
      this.setupViewport();
      this.setupContent();
      this._content.$.append(children);
      this.setupEvents();
      this.setupBounds();
  },
  
  destroy: function () {
    var children = null;
    if (this._hasChildren) {
      children = this.getContent().$.children();
      children.remove();
    }
    TweenMax.killTweensOf(this._content.e);
    this.removeEvents();
    this._content.$.remove(),  this._content  = null;
    this._viewport.$.remove(), this._viewport = null;
    this.$.removeClass('scrollview');
    this.$.removeAttr('style');
    if (children) {
      this.$.append(children);
    }
  },
  
  setupViewport: function () {
    this._viewport = new gc.display.DisplayObject();
    this._viewport.$
        .addClass('scrollview-viewport')
        .css(this.options.size)
        .appendTo(this.e);
  },
  
  setupContent: function () {
    this._content = new gc.display.DisplayObject();
    this._content.$
        .addClass('scrollview-content')
        .css(this.options.contentSize)
        .appendTo(this._viewport.e);
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
    this.options.size = size;
    this.$.css(size);
    this._viewport.$.css(size);
    this.setupBounds();
  },
  
  setContentSize: function (size) {
    this.options.contentSize = size;
    this._content.$.css(size);
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
    TweenMax.killTweensOf(this._content.e);
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
      TweenMax.killTweensOf(this._content.e);
      TweenMax.to(this._content.e, 0.3, $.extend({
        onUpdate: this.callback(function () {
          if (supportTransform) {
            var gsTransform = this._content.e._gsTransform;
            this._translate = graphPointMake(gsTransform.x, gsTransform.y);
          } else {
            var $sel = this._content.$;
            this._translate = graphPointMake($sel.css('left'), $sel.css('top'));
          }
          this.dispatch(gc.events.ScrollEvent.SCROLL);
        }),
        onComplete: this.callback(function () {
          if (supportTransform) {
            var gsTransform = this._content.e._gsTransform;
            this._translate = graphPointMake(gsTransform.x, gsTransform.y);
          } else {
            var $sel = this._content.$;
            this._translate = graphPointMake($sel.css('left'), $sel.css('top'));
          }
          this.dispatch(gc.events.ScrollEvent.SCROLL);
        }),
        ease: 'Quad.easeOut'
      }, temp));
      return;
    }
    if (supportTransform) {
      var methodType = this.options.useGpu ? 
        'setTransform3d' : 'setTransform';
      this._content[methodType]({
        translateX: this._translate.x,
        translateY: this._translate.y
      });
    } else {
      this._content.$.css({
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

},{"../core/utils":4,"../graph":9,"./DisplayObject":5,"gsap":"gsap","jquery":"jquery"}],7:[function(require,module,exports){
"use strict";

var DisplayObject = require('../display/DisplayObject');

var Form = module.exports = DisplayObject.extend({

    init: function (options) {
      this._super(options);
    }
});

},{"../display/DisplayObject":5}],8:[function(require,module,exports){
"use strict";

var DisplayObject = require('../display/DisplayObject');

var TextField = module.exports = DisplayObject.extend({

});

},{"../display/DisplayObject":5}],9:[function(require,module,exports){

"use strict";

/** @namespace */
var graph = {};

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

module.exports = graph;

},{}],10:[function(require,module,exports){
// 
var global = (function () {
  if (this.window) return this.window;
  if (module && module.exports) return module.exports;
  throw 'This library requires window or amd support.';
}());

// declare gc namespace
var gc = global.gc = {};

// graph package
var graph = gc.graph = require('./graph');

// core package
var core = gc.core = {};
core.utils = require('./core/utils');
core.Class = require('./core/Class');
core.Object = require('./core/Object');
core.EventDispatcher = require('./core/EventDispatcher');

// display package
var display = gc.display = {};
display.DisplayObject = require('./display/DisplayObject');
display.ScrollView = require('./display/ScrollView');

// screen package
var scrn = gc.screen = {};
scrn.AbstractScreen = require('./screen/AbstractScreen');

// and finally, form package
var form = gc.form = {};
form.Form = require('./form/Form');
form.TextField = require('./form/TextField');

},{"./core/Class":1,"./core/EventDispatcher":2,"./core/Object":3,"./core/utils":4,"./display/DisplayObject":5,"./display/ScrollView":6,"./form/Form":7,"./form/TextField":8,"./graph":9,"./screen/AbstractScreen":11}],11:[function(require,module,exports){
"use strict";

var DisplayObject = require('../display/DisplayObject');

var AbstractScreen = module.exports = DisplayObject.extend({
    
  init: function (options) {
    this._super(options);
    this.loadAccessors();
  },

  loadAccessors: function () {
    this.$.find('[data-accessor]').each(this.callback(this.onWalkAccessor));
  },

  onWalkAccessor: function (i, el) {
    var accessor = $(el).data('accessor');
    var options  = $(el).data('options') || {};
    var ClassBase = gc.display.DisplayObject;
    var isArray = false;
    if (/\[\]$/.test(accessor)) {
      accessor = accessor.substr(0, accessor.length -2);
      isArray = true;
    }
    if (typeof this[accessor] === 'undefined') return;
    if (isArray && !$.isArray(this[accessor])) this[accessor] = [];
    if ($(el).data('class')) {
      var classFragments = $(el).data('class').split('.');
      var len = classFragments.length;
      ClassBase = window;
      for (var i = 0; i < len; i++) {
        var key = classFragments[i];
        ClassBase = ClassBase[key];
      }
    }
    if (isArray) {
      this[accessor].push(new ClassBase(el));
    } else {
      this[accessor] = new ClassBase(el);
    }
  }
});

},{"../display/DisplayObject":5}],"gsap":[function(require,module,exports){
// gsap.js

if (typeof window.TweenMax === 'undefined') {
  throw 'This library requires "gsap" library as dependency, with "TweenMax" package scoped on window.';
}

module.exports = window.TweenMax;

},{}],"jquery":[function(require,module,exports){
// jquery.js

if (typeof window.jQuery === 'undefined') {
  throw 'This library requires "jquery" library as dependency, scoped on window.';
}

jQuery.noConflict();
module.exports = jQuery;

},{}]},{},[1,2,3,4,5,6,7,8,9,10,11,"gsap","jquery"]);
