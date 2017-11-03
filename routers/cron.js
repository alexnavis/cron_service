// 'use strict';

// const periodic = require('periodicjs');
// const CronRouter = periodic.express.Router();
// const CoreController = periodic.core.controller;
// const cronController = require('../controllers').cron;
// const RAHelperController = periodic.controllers.extension.get('periodicjs.ext.reactapp').helper;
// const oauth2authController = periodic.controllers.extension.get('periodicjs.ext.oauth2server').auth;

// CronRouter.post('/crons',
//   oauth2authController.ensureApiAuthenticated,    
//   RAHelperController.handleFileUpload,
//   RAHelperController.handleFileAssets,
//   RAHelperController.fixCodeMirrorSubmit,
//   RAHelperController.fixFlattenedSubmit,
//   cronController.setCronFilePath,
//   cronController.createCrons,
//   (req, res, next) => {
//     return res.status(200).send({
//       status: 200,
//       response: 'success',
//       successCallback: 'func:this.props.reduxRouter.push',
//       pathname: '/r-admin/extension/crons',
//     });
//   })

// CronRouter.get('/cron/:id/mocha',
//   cronController.findCron,
//   cronController.mochaCron)

// CronRouter.get('/cron/:id/validate',
//   cronController.findCron,
//   cronController.validateCron)  

// CronRouter.post('/cron/setactive/:id',
//   oauth2authController.ensureApiAuthenticated, 
//   cronController.findCron,
//   cronController.setCronStatus,
//   cronController.updateCronStatus,
//   cronController.handleResponseData)

// CronRouter.post('/cron/:id/run',
//   oauth2authController.ensureApiAuthenticated, 
//   cronController.findCron, 
//   cronController.runCron, 
//   cronController.handleResponseData)

// // CronRouter.get('/cron/:id',
// //   cronController
// // )

// CronRouter.use(periodic.routers.get('standard_cron').router)

// module.exports = CronRouter;