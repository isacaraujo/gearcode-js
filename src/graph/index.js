
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
