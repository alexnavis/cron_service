'use strict';
// const styles = require('../../constants/styles');

const merge = function(...args) {
  let obj = {};
  args.forEach(arg => {
    for (let key in arg) {
      if (obj.hasOwnProperty(key)) {
        obj[key] = Object.assign({}, merge(obj[key], arg[key]))     
      } else {
        obj[key] = arg[key]
      }
    }
  });
  return obj;
};

function standardTableHeader(header) {
  let headerStyle = {
    style: {
      // color: styles.colors.darkGreyText,
      fontWeight: 500,
    },
  };
  if (header.headerColumnProps) {
    header.headerColumnProps = merge(header.headerColumnProps, headerStyle);
  } else {
    header.headerColumnProps = headerStyle;
  }
  return header;
}

module.exports = standardTableHeader;