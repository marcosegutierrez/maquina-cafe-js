import express from 'express';
import router from './routes/index.route.js';
import { __dirname } from './utils.js';
import { initMongoDB } from './persistence/mongodb/connection.js';
import cookieParser from "cookie-parser";
import session from 'express-session';
import config from './config.js';
import MongoStore from 'connect-mongo';
import { globalLimiter } from './middlewares/rateLimit.js';
import helmet from 'helmet';
import cors from 'cors';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();
const PORT = 8080;

app
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use(express.static(__dirname + '/public'))
    .use(cookieParser())
    .use(session({
        secret: config.SECRET_KEY,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: config.MONGO_URL
        }),
        cookie: {
            maxAge: 1000 * 60 * 10, // 10 min
            httpOnly: true
        }
    }))
    .use(helmet())
    .use(cors())
    .use(globalLimiter);

app
    .use('/api/v1', router)
    .use(errorHandler);

initMongoDB();

app.listen(PORT, () => console.log(`Server Ok on port ${PORT}`));