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

const express = require('express');
const app = express();

app.use(express.json());
// extra packages

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