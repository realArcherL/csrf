const router = require('express').Router();
const { PrismaClient, Prisma } = require('@prisma/client');

const prisma = new PrismaClient()


// GET /login
router.get('/login', async (req, res, next) => {
	/**
	 * This more correct logic than the rest
	 */
	try {
		const username = req.cookies.username;
		if (!username) {
			res.render('login_post_defense1', {
				bugType: "csrf-bug-defense1"
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
			res.status(404).render('login_post_defense1', {
				bugType: 'csrf-bug-defense1',
				error: 'Username not found!'
			})
		}

		//TODO: bcrypt password 

		const checkPassword = password === user.password;
		if (!checkPassword) {
			res.status(401).render('login_post_defense1', {
				bugType: 'csrf-bug',
				error: 'Invalid credentials'
			});
		}

		/**
		 * Docs: https://expressjs.com/en/resources/middleware/cookie-session.html
		 */

		res.cookie("username", username, { sameSite: 'lax'});
		res.status(200).redirect('/home')
	} catch (error) {
		next(error);
	}
})






module.exports = router;
