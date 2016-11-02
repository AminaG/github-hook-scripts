'use strict';

var _=require('lodash')
const port=_.get(require('./createAppService.js').getSettings(),'server.port',80)
require('http').createServer(require('./createAppService').app).listen(port)
console.log('Listening to port %s',port)