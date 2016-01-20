// gsap.js

if (typeof window.TweenMax === 'undefined') {
  throw 'This library requires "gsap" library as dependency, with "TweenMax" package scoped on window.';
}

module.exports = window.TweenMax;
