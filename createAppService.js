"use strict";

var yaml=require('js-yaml')
var _=require('lodash')
var Promise=require('bluebird')
var express=require('express')

var app=express()

function getSettingsFile(){
	try{
		var currentPath=__dirname + '/settings.yaml'
		return require('fs').readFileSync(currentPath).toString()
	}
	catch(err){
		console.log('cannot read settings.yaml file')
	}
}

function getSettings(){
	return yaml.safeLoad(getSettingsFile())	
}

app.use(require('body-parser').json())

app.get('/health',function(req,res){
	res.send('ok:' + require('./package').version)
})
app.use('*', function (req,res,next) {
	console.log(req.method + ' ' + req.url)
	next()
})
app.post('/',function (req,res)  {

	(async function () {

	})().then( data =>{
		var settings=getSettings()
		var repo_full_name=_.get(req.body,'repository.full_name','')
		if(!repo_full_name) return 'repo not found in request'
		
		var branch=_.get(req.body,'ref','').match(/[^\/]+$/)[0]
		
		var user=repo_full_name.match(/^[^\/]*/)[0]
		var repo_name=repo_full_name.match(/[^\/]*$/)[0]

		var command=_.get(settings,['repos',repo_full_name,branch,'command'],'')
		
		command=command.replace(/{{repo}}/g,repo_name)
		command=command.replace(/{{user}}/g,user)
		command=command.replace(/{{branch}}/g,branch)

		console.log('Git hook for:%s, branch: %s',repo_name + '/' + user,branch)

		if(!command){
			console.log('Command not found')
			return 'command not found:' + i + ' For Branch:' + repo_name + ',' + branch
		}
		else{
			return runCommand(user,repo_name,branch,command)
		}
	}).then(data => {
		res.send(data)
	}).catch( err=>
		res.status(500).send(err.message)
	)	
	
})

function runCommand(user,repo_name,branch,command){
	var defer=Promise.defer()
	
	

	var ext,pre
	if (require('os').type().match(/window/i)) {
		pre=''
		var ext='.bat'
	}
	else{
		pre='#!/bin/sh\n'
		ext='.sh'
	}
	const file=__dirname + '/' + repo_name + '-' + branch + ext

	console.log('Writing temp file:%s',file,{mode:777})
	
	require('fs').writeFileSync(file,pre + command,{mode:777})		
	var x=require('child_process').exec( file,function(err,response){
		require('fs').unlink(file)		
		if(err){
			defer.reject(err)			
		}
		else{
			defer.resolve(response)
		}
	})
	return defer.promise;
}


module.exports.app=app
module.exports.getSettings=getSettings
