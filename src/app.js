import express from 'express';
import router from './routes/index.route.js';
import handlebars from 'express-handlebars';
import { __dirname } from './utils.js';
import { initMongoDB } from './persistence/mongodb/connection.js';
import cookieParser from "cookie-parser";
import session from 'express-session';
import config from './config.js';
import MongoStore from 'connect-mongo';
import { globalLimiter } from './middlewares/rateLimit.js';

const app = express();
const PORT = 8080;

// Opciones de handlebars
const hbs = handlebars.create({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }
});

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
    .use(globalLimiter);

app.engine('handlebars', hbs.engine);
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
    // Redirección a página principal
    res.redirect('/drinks');
});

app.use('/', router);

initMongoDB();

app.listen(PORT, () => console.log(`Server Ok on port ${PORT}`));