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
