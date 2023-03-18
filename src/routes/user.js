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
				console.log(error)
				res.render('signup_post', {
					bugType: "csrf-bug",
					error: "Username already exists"
				})
			}
		}
	}
});



module.exports = router;
