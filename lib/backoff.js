
var defaults = require('defaults');

exports.exponential = function (options) {
  options || (options = {});

  options = defaults(options, {
    base: 2000
  });

  return function (state) {
    return Math.pow(2, state.tries) * options.base;
  };
};
