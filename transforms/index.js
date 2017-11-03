'use strict';
const pretransform = require('./pretransform');
const posttransform = require('./posttransform');

function testPreTransform(req) {
  return new Promise((resolve, reject) => {
    periodic.logger.silly('sample pre transfrom', req.params.id);
    resolve(req);
  });
}
function testPostTransform(req) {
  return new Promise((resolve, reject) => {
    periodic.logger.silly('sample post transfrom', req.params.id);
    resolve(req);
  });
}

module.exports = {
  pre: pretransform,
  post: posttransform,
};