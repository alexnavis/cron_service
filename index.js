'use strict';
const periodic = require('periodicjs');
const cronInitializer = require('./lib/crons');

module.exports = () => {
  try {
    periodic.status.on('configuration-complete', status => {
      cronInitializer.useCronTasks();
    })
  } catch(e){
    return Promise.reject(e);
  }
  return Promise.resolve(true);
}