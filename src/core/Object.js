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
