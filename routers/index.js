'use strict';

const periodic = require('periodicjs');
const fs = require('fs-extra');
const path = require('path');
const logger = periodic.logger;
// const CronRouter = require('./cron');
const CronRouter = periodic.express.Router();
const packageJson = fs.readJsonSync(path.join(__dirname, '../package.json'));
const preTransforms = periodic.utilities.middleware.preTransforms(periodic);
const CoreController = periodic.core.controller;
const cronController = require('../controllers').cron;
const RAHelperController = periodic.controllers.extension.get('periodicjs.ext.reactapp').helper;
const oauth2authController = periodic.controllers.extension.get('periodicjs.ext.oauth2server').auth;
const encryption_key = fs.readFileSync(path.join(periodic.config.app_root, 'otherdocs/encrypt_key.txt')).toString();
let cronPath = path.join(periodic.config.app_root, '/content/files/crons');
const chokidar = require('chokidar');
const cron_lib = require('../lib/crons');
const initializeCrons = cron_lib.initializeCrons;
const getCronMap = cron_lib.getCronMap;

CronRouter.post('/crons',
  oauth2authController.ensureApiAuthenticated,    
  RAHelperController.handleFileUpload,
  RAHelperController.handleFileAssets,
  RAHelperController.fixCodeMirrorSubmit,
  RAHelperController.fixFlattenedSubmit,
  cronController.setCronFilePath,
  cronController.createCrons,
  (req, res, next) => {
    return res.status(200).send({
      status: 200,
      response: 'success',
      successCallback: 'func:this.props.reduxRouter.push',
      pathname: '/r-admin/extension/crons',
    });
  })

CronRouter.get('/cron/:id/mocha',
  cronController.findCron,
  cronController.mochaCron)

CronRouter.get('/cron/:id/validate',
  cronController.findCron,
  cronController.validateCron)  

CronRouter.post('/cron/setactive/:id',
  oauth2authController.ensureApiAuthenticated, 
  cronController.findCron,
  cronController.setCronStatus,
  cronController.updateCronStatus,
  cronController.handleResponseData)

CronRouter.post('/cron/:id/run',
  oauth2authController.ensureApiAuthenticated, 
  cronController.findCron, 
  cronController.runCron, 
  cronController.handleResponseData)

CronRouter.get('/crons/:id',
  cronController.findCron,
  cronController.stageAssetDownload,
  periodic.core.files.decryptAssetMiddlewareHandler({
    periodic,
    encryption_key,
  }),
  cronController.handleAssetDownload,
  cronController.handleResponseData)

CronRouter.put('/crons/:id',
  cronController.clearCronCache,  
  oauth2authController.ensureApiAuthenticated,
  cronController.updateCron,
  cronController.stageMultipartData)

CronRouter.post('/cron/standard_asset/upload',
  cronController.stageFileUpload,
  periodic.core.files.uploadMiddlewareHandler({
    periodic,
    'asset_core_data': 'standard_asset',
    encrypted_client_side: true,
    encryption_key,
    'exclude-userstamp': true,
    save_file_to_asset: true,
    send_response: false
  }),
  cronController.updateCronWithNewAsset,
  cronController.updateCronJob,
  cronController.sendMicroserviceResponseJSON)

CronRouter.use(periodic.routers.get('standard_cron').router)

module.exports = CronRouter;