const router = require('express').Router();
const { PrismaClient, Prisma } = require('@prisma/client');

const prisma = new PrismaClient()

router.get('/', async (req, res, next) => {
	try {
		res.send(`
		<html>
			<body>
				<h1>Welcome</h1>
				<p>Login here: <a href="/login">/login</a>
				<p>Sing-up here: <a href="/signup">/signup</a>
			</body>
		</html>
		`)
	} catch (error) {
		next(error)
	}
})

router.get('/home', async (req, res, next) => {
	try {
		const username_cookie = req.cookies.username || "";
		const user = await prisma.user.findUnique({
			where: {
				username: username_cookie
			}
		});

		if (user) {
			res.status(200).render('message', {
				username: user.username,
				message: "Message"
			});
		} else {
			res.redirect('/login')
		}
	} catch (error) {
		next(error)
	}
})

// GET /login
router.get('/login', async (req, res, next) => {
	/**
	 * This more correct logic than the rest
	 */
	try {
		const username = req.cookies.username;
		if (!username) {
			res.render('login_post', {
				bugType: "csrf-bug"
			});
			return;
		}
		const user = await prisma.user.findUnique({
			where: {
				username
			}
		});
		if (!user) {
			res.render('login_post', {
				bugType: "csrf-bug"
			});
			return;
		}
		res.redirect('/home')
	} catch (error) {
		next(error)
	}
});


// POST login
router.post('/login', async (req, res, next) => {
	try {
		const { username, password } = req.body

		const user = await prisma.user.findUnique({
			where: {
				username: username
			}
		})

		if (!user) {
			res.status(404).render('login_post', {
				bugType: 'csrf-bug',
				error: 'Username not found!'
			})
		}

		//TODO: bcrypt password 

		const checkPassword = password === user.password;
		if (!checkPassword) {
			res.status(401).render('login_post', {
				bugType: 'csrf-bug',
				error: 'Invalid credentials'
			});
		}

		res.cookie("username", username);
		res.status(200).redirect('/home')
	} catch (error) {
		next(error);
	}
})

// GET /signup
router.get('/signup', async (req, res, next) => {
	try {
		const username_cookie = req.cookies.username || "";
		const user = await prisma.user.findUnique({
			where: {
				username: username_cookie
			}
		});

		if (user) {
			res.status(302).redirect('/home')
		} else {
			res.render('signup_post', {
				bugType: "csrf-bug"
			})
		}

	} catch (error) {
		next(error)
	}
})

// POST /sign-up
router.post('/signup', async (req, res, next) => {
	try {
		const { username, password } = req.body
		// TODO: Check to see unique user

		// TODO: Check for passwords to match

		await prisma.user.create({
			data: {
				username: username,
				password: password
			}
		});

		res.status(200).redirect('/home')

	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			if (error.code === 'P2002') {
				/**
				 * Sending 200 OK here, but since it's a duplication 
				 * error 409 should be sent, but URI was processed
				 * on the server, it can be said it was a valid request
				 * but we can also use 400 Bad Request, may be use
				 * 409 for double submits?
				 * https://stackoverflow.com/questions/3290182/which-status-code-should-i-use-for-failed-validations-or-invalid-duplicates
				 */
				res.status(200).render('signup_post', {
					bugType: "csrf-bug",
					error: "Username already exists"
				})
			}
		}
	}
});

// GET /changepass
router.get('/changepass', async (req, res, next) => {
	try {
		// check for valid users

		const username_cookie = req.cookies.username || "";
		const user = await prisma.user.findUnique({
			where: {
				username: username_cookie
			}
		});

		if (user) {
			res.status(200).render('change_pass', {
				bugType: "csrf-bug"
			})
		} else {
			res.status(401).redirect("/login")
		}
	} catch (error) {
		next(error)
	}
})

// POST /changepass
router.post('/changepass', async (req, res, next) => {
	try {
		const username_cookie = req.cookies.username || "";
		const user = await prisma.user.findUnique({
			where: {
				username: username_cookie
			}
		});

		const { password, confirm_password } = req.body

		if (user) {
			if (password != confirm_password) {
				// Bad request for password change
				res.status(400).render('change_pass', {
					bugType: "csrf-bug",
					error: "Passwords don't match"
				})
			}

			// logic to change password
			await prisma.user.update({
				where: {
					username: user.username
				},
				data: {
					password: password
				}
			})

			res.status(200).redirect('/home')
		} else {
			res.status(401).redirect("/login")
		}
	} catch (error) {
		next(error)
	}
})


// GET route to get a form for method="GET" to change pass
router.get('/get/changepass', async (req, res, next) => {
	try {
		// check for valid users

		const username_cookie = req.cookies.username || "";
		const user = await prisma.user.findUnique({
			where: {
				username: username_cookie
			}
		});

		if (user) {
			res.status(200).render('change_pass_get', {
				bugType: "csrf-bug"
			})
		} else {
			res.redirect("/login")
		}
	} catch (error) {
		next(error)
	}
})

// GET request to change the pass
router.get('/get/getchangepass', async (req, res, next) => {
	try {
		const username_cookie = req.cookies.username || "";
		const user = await prisma.user.findUnique({
			where: {
				username: username_cookie
			}
		});

		// only change in GET form is now the values are taken
		// from the URL query instead of body
		const { password, confirm_password } = req.query

		if (user) {
			if (password != confirm_password) {
				// Bad request for password change
				res.status(400).render('change_pass', {
					bugType: "csrf-bug",
					error: "Passwords don't match"
				})
			}

			// logic to change password
			await prisma.user.update({
				where: {
					username: user.username
				},
				data: {
					password: password
				}
			})

			res.status(200).redirect('/home')
		} else {
			res.status(401).redirect("/login")
		}
	} catch (error) {
		next(error)
	}
})


// logout from the application
router.get("/logout", async (_, res, next) => {
	try {
		res.clearCookie("username");
		res.redirect("/login");
	} catch (error) {
		next(error);
	}
});


module.exports = router;
