require('request')({
		url:  'https://o6ofum69f4.execute-api.us-east-1.amazonaws.com/prod',
		json: require('./example1.json'),
		method:'post',
	}, (err,obj,body) => {
		console.log(err || body)
	})
