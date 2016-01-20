// jquery.js

if (typeof window.jQuery === 'undefined') {
  throw 'This library requires "jquery" library as dependency, scoped on window.';
}

jQuery.noConflict();
module.exports = jQuery;
