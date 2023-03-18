const router = require('express').Router();
const { PrismaClient, Prisma } = require('@prisma/client');

const prisma = new PrismaClient()

// Front End Render
router.get('/signup', async (req, res, next) => {
	try {
		res.render('signup_post', {
			bugType: "csrf-bug"
		})
	} catch (error) {

	}
})

// Back-end Render
router.post('/api/signup', async (req, res, next) => {
	try {
		const { username, password } = req.body
		const signup_message = "Sing-up Success!"

		// Check to see unique user

		// Check for passwords to match

		const user = await prisma.user.create({
			data: {
				username: username,
				password: password
			}
		});


		res.status(200).render("message", {
			username: username,
			message: signup_message
		})

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



module.exports = router;
