'use strict';
const Promisie = require('promisie');
const periodic = require('periodicjs');
const CronJob = require('cron').CronJob;
const path = require('path');
const fs = require('fs-extra');
const crypto = require('crypto');
const async = require('async');
const https = require('https');
const util = require('util');
const usecroncheckfile = path.resolve(__dirname, '../../../content/files/croncheck.json');
let cronPath = path.resolve(__dirname, '../../../../content/files/crons');
let cronMap = {};
const CoreController = periodic.core.controller;
const appSettings = periodic.settings;
const validateTheme = appSettings.theme;
const mongoose = periodic.mongoose;
const logger = periodic.logger;
const encryption_key = fs.readFileSync(path.join(periodic.config.app_root, 'otherdocs/encrypt_key.txt')).toString();
const pemfile = fs.readFileSync(path.join(periodic.config.app_root, 'otherdocs/pf-ils.pem')).toString();
const helpers = require('../utilities').helper;

// var CoreController,
// mongoose,
// Cron,
// logger,
// pemfile,
// periodic,
// cloudUploads,
// downloadCron,
// appenvironment,
// appSettings,
// validateTheme;

var createCronJob = function (cronData) {
  let assetData = cronData.asset;
  let periodicFilename = assetData.attributes.periodicFilename;
  let modulePath = path.join(cronPath, periodicFilename.replace(/\.enc/gi, ''));
  let fn = require(modulePath).script(periodic).bind(null, Object.assign({}, cronData.runtime_options));
  let task = new CronJob({
    cronTime: cronData.cron_interval,
    onTick: fn,
    onComplete: function () { },
    start: false,
  });
  return task;
};

var updateCronJob = function (cronData) {
  let assetData = cronData.asset;
  let periodicFilename = assetData.attributes.periodicFilename;
  let modulePath = path.join(cronPath, periodicFilename.replace(/\.enc/gi, ''));
  let fn = require(modulePath).script(periodic).bind(null, Object.assign({}, cronData.runtime_options));
  let task = new CronJob({
    cronTime: cronData.cron_interval,
    onTick: fn,
    onComplete: function () { },
    start: false,
  });
  cronMap[ cronData._id ].task.stop();
  delete cronMap[ cronData._id ];
  cronMap[ cronData._id ] = {
    task,
    cron: cronData,
  };
  cronMap[ cronData._id ].task.start();
}

var findCronsForInitialization = function (crons, cb) {
  const Cron = periodic.datas.get('standard_cron');
  if (crons) {
    cb(null, crons);
  } else {
    let query = (typeof validateTheme === 'string') ? { active: true, theme: validateTheme } : { active: true };
    Cron.query({ query })
      .then(crons => {
        cb(null, crons);
      })
      .catch(cb);
  }
};

// var decryptHTTPStream = function(options, cb) {
//   try {
//     https.get(options.url, function(https_download_response) {
//       var decipher = crypto.createDecipher(options.algorithm || 'aes192', encryption_key);
//       https_download_response.pipe(decipher).pipe(options.writeStream || options.res);
//       https_download_response.on('end', () => {
//         cb(null, {
//             result: 'success',
//             data: {
//                 message: 'download complete'
//             }
//         });
//       });
//       https_download_response.on('error', e => {
//         cb(e);
//       });
//     });
//   } catch (e) {
//       cb(e);
//   }
// };


var downloadRemoteFiles = function (crons, req) {
  return new Promise((resolve, reject) => {
    Promisie.promisify(fs.ensureDir)(cronPath)
      .then(() => {
        try {
          let remoteFiles = crons.filter(cron => cron.asset.locationtype !== 'local' && cron.asset.locationtype);
          if (remoteFiles.length) {
            async.eachLimit(remoteFiles.map(cron => cron.asset), 5, function (asset, eachcb) {
              asset = asset.toJSON ? asset.toJSON() : asset;
              if (asset.filename) {
                asset.filename.replace(/\.enc/gi, '');
              } else if (asset.attributes && asset.attributes.periodicFilename) {
                asset.filename = asset.attributes.periodicFilename.replace(/\.enc/gi, '');
              }
              let writeStream = fs.createWriteStream(path.join(cronPath, asset.filename));
              writeStream.on('finish', function () {
                eachcb(null, 'finished');
              });
              helpers.decryptHTTPStream({
                url: asset.fileurl,
                algorithm: asset.client_encryption_algo,
                writeStream: writeStream,
              }, function (err) {
                if (err) {
                  eachcb(err);
                }
              });
            }, function (err) {
              if (err) {
                reject(err);
              } else {
                resolve(crons);
              }
            });
          } else {
            resolve(crons);
          }
        } catch (e) {
          reject(e);
        }
      }, reject);
  });
};

var initializeCrons = function (crons, cb) {
  try {
    crons = null;
    Promisie.promisify(findCronsForInitialization)(crons)
      .then(crons => downloadRemoteFiles(crons))
      .then(crons => {
        let loaderAsync = Promisie.promisify(async.eachSeries);
        let result = [];
        return loaderAsync(crons, function (cron, eachcb) {
          let periodicFilename = cron.asset.attributes.periodicFilename;
          let modulePath = path.join(cronPath, periodicFilename.replace(/\.enc/gi, ''));
          Promisie.promisify(fs.stat)(modulePath)
            .then(() => {
              Promisie.promisify(fs.readFile)(modulePath, 'utf8')
                .then(file => {
                  let signData = new Buffer(file.trim()).toString('base64');
                  let sign = crypto.createSign('RSA-SHA256');
                  sign.update(signData);
                  let signature = sign.sign(pemfile, 'hex');
                  if (signature === cron.asset_signature) {
                    result.push(cron);
                    eachcb(null, 'success');
                  } else {
                    logger.warn(`Asset ${cron.asset.attributes.periodicFilename} is unsigned and will not be loaded`);
                    result.push(false);
                    eachcb(null, 'failed');
                  }
                });
            }, e => {
              logger.warn(`Asset ${cron.asset.attributes.periodicFilename} could not be found and will not be loaded`, e);
              result.push(false);
              eachcb(null, 'failed');
            });
        })
          .then(() => result, () => false);
      })
      .then(crons => {
        if (Array.isArray(crons)) {
          crons.forEach(cron => {
            if (cron && cron.active && !cronMap[cron._id]) {
              let task = createCronJob(cron);
              task.start();
              cronMap[ cron._id ] = {
                task: task,
                cron: cron,
              };
            } else if (cron && cron.active && cronMap[ cron._id ]) {
              let task = createCronJob(cron);
              cronMap[ cron._id ].task.stop();
              delete cronMap[ cron._id ];
              cronMap[ cron._id ] = {
                task,
                cron: cron,
              };
              cronMap[ cron._id ].task.start();
            }
          });
        }
        if (typeof cb === 'function') {
          cb(null, crons);
        }
      })
      .catch(e => {
        logger.warn('Error starting crons', e);
        if (typeof cb === 'function') {
          cb(e);
        }
      });
  } catch (e) {
    logger.warn('Error starting crons', e);
    if (typeof cb === 'function') {
      cb(e);
    }
  }
};

var findCronDiff = function (map, cb) {
  const Cron = periodic.datas.get('standard_cron');
  let currentCrons = Object.keys(map);
  let query = {
    $and: [ {
      active: true,
    }, {
      _id: { $nin: currentCrons, },
    }, ],
  };
  if (typeof validateTheme === 'string') {
    query.$and.push({
      theme: validateTheme,
    });
  }
  Cron.query({ query })
    .then(crons => {
      cb(null, crons);
    })
    .catch(cb);
};

var digestCrons = function (modified, cb) {
  try {
    let skipDigest;
    if (periodic.settings.application.cron_check_file_enabled) {
      logger.silly('Updating crons');
      Promisie.promisify(findCronDiff)(cronMap)
        .then(crons => {
          if (!skipDigest) {
            return Promisie.promisify(initializeCrons)(crons);
          } else {
            return false;
          }
        })
        .then(() => {
          if (!skipDigest) {
            if (Array.isArray(modified) && modified.length) {
              modified.forEach(cron => {
                if (cron.status === false && cronMap[ cron.id ]) {
                  cronMap[ cron.id ].task.stop();
                  cronMap[ cron.id ] = null;
                  delete cronMap[ cron.id ];
                }
              });
            }
            cb(null, 'Crons updated');
          }
        })
        .catch(e => {
          cb(e);
        });
    } else {
      cb(null, 'No croncheck file skipping initialization');
    }
  } catch (e) {
    cb(e);
  }
};

var useCronTasks = function () {
  try {
    if (periodic.settings.application.cron_check_file_enabled) {
      logger.silly('Initialzing crons');
      initializeCrons(null, function (err) {
        if (err) {
          logger.error('Could not start crons', err);
        } else {
          logger.silly('Crons initialized');
        }
      });
    } else {
      logger.silly('Not initialzing crons');
    }
  } catch (e) {
    logger.warn('Error calling useCronTasks', e);
  }
};

var getCronMap = function () {
  return cronMap;
};

module.exports = {
  getCronMap,
  digestCrons,
  useCronTasks,
  findCronDiff,
  initializeCrons,
  findCronsForInitialization,
  createCronJob,
  downloadRemoteFiles,
}