'use strict';

var path = require('path');

var rootPath = path.normalize(__dirname + '/../../..');

module.exports = {
  root: rootPath,
  port: process.env.PORT || 3000,
  datesToList: 1,
  redis: {
    port: 14583,
    host: 'pub-redis-14583.eu-west-1-1.2.ec2.garantiadata.com'
  }
};