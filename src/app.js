const express = require('express');
const createError = require('http-errors');
const morgan = require('morgan');
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
require('dotenv').config();


const routes = require('./routes')

const app = express();
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');
// view engine path
app.set('views', path.join(__dirname, 'views'));


app.get('/health', async (req, res, next) => {
	res.send({ message: 'Awesome it works 🐻' });
});

app.use("/", routes);

app.use((req, res, next) => {
	next(createError.NotFound());
});

app.use((err, req, res, next) => {
	res.status(err.status || 500);
	res.send({
		status: err.status || 500,
		message: err.message,
	});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));
