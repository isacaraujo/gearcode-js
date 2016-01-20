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
