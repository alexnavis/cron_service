'use strict';
const periodic = require('periodicjs');
const cron = require('./cron');

module.exports = {
  GET: {
    '/crons': [
      cron.filterCrons,
    ],
  },
  PUT: {
  },
  POST: {
  },
}