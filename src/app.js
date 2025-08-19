import express from 'express';
import router from './routes/index.route.js';
import handlebars from 'express-handlebars';
import { __dirname } from './utils.js';
import { initMongoDB } from './persistence/mongodb/connection.js';
import cookieParser from "cookie-parser";

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
    .use(express.urlencoded({extended: true}))
    .use(express.static(__dirname + '/public'))
    .use(cookieParser());

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