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
