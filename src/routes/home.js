const router = require('express').Router();

router.get('/', async (req, res, next) => {
	try {
		res.send(`
		<html>
			<body>
				<h1>Welcome</h1>
				<p>Login here: <a href="/login">/login</a></p>
				<p>Sing-up here: <a href="/signup">/signup</a></p>

				<h2>Vulnerable implementation (check out GitHub issues for more)</h2>
				<h3>!Make sure you are logged in first</h3>
				<p>Vulnerable change password <a href="/changepass">/changepass</a></p>
				<p>GET based vulnerable change password <a href="/get/changepass">/get/changepass</a></p>
			</body>
		</html>
		`)
	} catch (error) {
		next(error)
	}
})

module.exports = router;