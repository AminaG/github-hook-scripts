require('babel-register')
require('babel-polyfill')

var app=require('./createAppService').app

require('supertest-as-promised')(app)
.post('/')
.send(require('./example1.json'))
.then( data => {
	if(data.error){
		console.log('Error:',data.error)
	}
	else{
		console.log('success',data.text)
	}
})