var app = {
	user: 'sa',
	password: '123456',
	server: 'localhost',
	database: 'demo',
	
	options: {
		encrypt: false // Use this if you're on Windows Azure
	},
	pool: {
		min: 0,
		max: 10,
		idleTimeoutMillis: 3000
	}
};

module.exports = app;