import express from 'express';
import router from './routes/index.js';
import handlebars from 'express-handlebars';
import { __dirname } from './utils.js';
import { initMongoDB } from './persistence/mongodb/connection.js';

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
    .use(express.static(__dirname + '/public'));

app.engine('handlebars', hbs.engine);
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
    res.send(`Welcome to the Coffee Machine!
        <br>
        Go to /drinks`);
});

app.use('/', router);

initMongoDB();

app.listen(PORT, () => console.log(`Server Ok on port ${PORT}`));