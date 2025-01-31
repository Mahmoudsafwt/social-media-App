import express from 'express' 
import dotenv from 'dotenv';
import bootstrap from './app.controller.js';
dotenv.config();
const app = express()
const port = 3000
await bootstrap(app,express);


app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))