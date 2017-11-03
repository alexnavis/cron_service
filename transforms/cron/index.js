'use strict';
const periodic = require('periodicjs');

function filterCrons(req) {
  return new Promise((resolve, reject) => {
    try {
      req.controllerData = req.controllerData || {};
      req.controllerData.model_query = {
        theme: periodic.settings.theme
      }
      return resolve(req);
    } catch (err) {
      return reject(err)
    }
  });
}

function findCron(req) {
  return new Promise((resolve, reject) => {
    try {
      let Cron = periodic.datas.get('standard_cron');
      Cron.load({ query: { _id: req.params.id }})
      .then(cron => {
        req.controllerData = req.controllerData || {};
        req.controllerData.cron = cron;
        return resolve(req);
      }, reject)
      .catch(e => {
        logger.warn('Error loading cron: ', e);
      })
    } catch (err) {
      return reject(err)
    }
  });
}

function downloadAsset(req) {
  return new Promise((resolve, reject) => {
    try {
      req.controllerData = req.controllerData || {};
      return resolve(req);
    } catch (err) {
      return reject(err)
    }
  });
}

module.exports = {
  filterCrons,
  findCron,
  downloadAsset,
};