require('dotenv').config();
require('express-async-errors');

const connectDB = require('./db/connect');
const authMiddleware = require('./middleware/authentication');
// routers
const authRoute = require('./routes/auth');
const jobRoute = require('./routes/job');
// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
// extra package
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rate_limitter = require('express-rate-limit');

const express = require('express');
const app = express();

app.use(express.json());
// extra packages
app.use(helmet());
app.use(cors());
app.use(xss());
app.set('trust proxy', 1)
app.use(rate_limitter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
}));

// routes
app.use('/api/v1', authRoute);
app.use('/api/v1/jobs', authMiddleware, jobRoute);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


const port = process.env.PORT || 3000;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => {
            console.log(`Server is listening at ${port}`);
        })
    } catch (err) {
        console.log(err);
    }
}

start();