import app from "./app.js";
import { initMongoDB } from './persistence/mongodb/connection.js';

const PORT = 8080;

const startServer = async () => {
    await initMongoDB();

    app.listen(PORT, () => console.log(`Server Ok on port ${PORT}`));
}

startServer();