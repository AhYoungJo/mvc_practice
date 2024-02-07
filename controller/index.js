const users = require('../model/users');

const main = (req, res) => {
	res.render('index');
};

const check_login = (req, res) => {
	const { id, pw } = req.body;

	if (users[0].userid === id && users[0].userpw === pw) {
		res.send({ success: true, message: 'Login successful' });
	} else {
		res.send({ success: false, message: 'Login failed' });
	}
};

module.exports = { main, check_login };
