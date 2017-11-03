'use strict';
const periodic = require('periodicjs');
const https = require('https');
const fs = require('fs-extra');
const path = require('path');
const crypto = require('crypto');
const Promisie = require('promisie');
const mime = require('mime');
const encryption_key = fs.readFileSync(path.join(periodic.config.app_root, 'otherdocs/encrypt_key.txt')).toString();
const STATUS_REGEXP = /^(2|3)\d{2}$/;
const oauth2clientLocals = periodic.locals.extensions.get('periodicjs.ext.oauth2client');
let getBearerToken = oauth2clientLocals.oauth.get_auth_tokens;

var decryptHTTPStream = function(options, cb) {
  try {
    https.get(options.url, function(https_download_response) {
      var decipher = crypto.createDecipher(options.algorithm || 'aes192', encryption_key);
      https_download_response.pipe(decipher).pipe(options.writeStream || options.res);
      https_download_response.on('end', () => {
        cb(null, {
            result: 'success',
            data: {
                message: 'download complete'
            }
        });
      });
      https_download_response.on('error', e => {
        cb(e);
      });
    });
  } catch (e) {
      cb(e);
  }
};

function uploadFileData (data) {
  try {
    let { formdata, boundary } = data;
    let jsaSettings = periodic.settings.container['job-service-api-container'];
    // let themeconfig = periodic.locals.container.get('job-service-api-container').themeconfig;
    let basic_auth_header = `Bearer ${getBearerToken().users.dsa.extensionattributes.passport.oauth2client_dsa.accesstoken}`;
    let requestOptions = {
      hostname: 'jsa-dev.promisefinancial.net',
      port: '8886',
      path: '/cron/standard_asset/upload',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${ boundary }`,
        'Content-Length': Buffer.byteLength(formdata),
        'Accept': 'application/json',
        'Authorization': basic_auth_header,
      },
      method: 'POST'
    };
    return new Promisie((resolve, reject) => {
      try {
        let request = https.request(requestOptions, response => {
          let responseData = [];
          let status = response.statusCode.toString();
          if (!STATUS_REGEXP.test(status) || (typeof response.statusMessage === 'string' && response.statusMessage.toUpperCase() !== 'OK')) {
            reject(new Error(response.statusMessage));
          } else {
            response.on('data', responseData.push.bind(responseData))
              .on('error', reject)
              .on('end', () => {
                resolve(Buffer.concat(responseData).toString());
              });
          }
        });
        request.on('error', reject);
        request.end(formdata);
      } catch (e) {
        reject(e);
      }
    });
  } catch (e) {
    return Promisie.reject(e);
  }
}

function generateMultipartData (data, files) {
  let boundary = `----DigiFiBoundary${ Math.floor(Math.random() * 1000000000000000) }`;
  let formdata = Object.keys(data).reduce(function (result, key) {
    result += `--${ boundary }\r\nContent-Disposition: form-data; `;
    result += `name="${ key }";\r\n\r\n${ data[key] }\r\n`;
    return result;
  }, '');
  let filedata;
  if (files) {
    filedata = files.reduce(function (result, file) {
      let content = `--${ boundary }\r\nContent-Disposition: form-data; `;
      content += `name="${ file.name }"; filename="${ file.filename }";\r\n`;
      content += `Content-Type: ${ mime.lookup(file.filename) };\r\n\r\n`;
      return result.concat(Buffer.concat([Buffer.from(content), (file.data instanceof Buffer) ? file.data : Buffer.from(file.data), Buffer.from('\r\n')]));
    }, []);
  }
  if (filedata.length) formdata = Buffer.concat([Buffer.from(formdata), Buffer.concat(filedata), Buffer.from(`--${ boundary }--`)]);
  else formdata += `--${ boundary }--`;
  return { formdata: formdata, boundary: boundary };
};

module.exports = {
  decryptHTTPStream,
  uploadFileData,
  generateMultipartData,
};