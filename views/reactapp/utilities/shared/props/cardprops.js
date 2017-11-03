'use strict';
// const styles = require('../../constants/styles');

function cardProps(options) {
  return Object.assign({}, {
    cardTitle: options.cardTitle,
  }, {
    cardStyle: options.cardStyle,
  });
}

module.exports = cardProps;