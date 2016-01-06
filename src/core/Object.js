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
