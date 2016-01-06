"use strict";

var $ = require('jquery'),
    DisplayObject = require('./DisplayObject'),
    graph = require('../graph/Dimension'),
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
