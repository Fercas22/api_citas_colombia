//TODO Importaciones
require('dotenv').config();
// require('mysql');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const express = require('express');
const fileUpload = require('express-fileupload')

//TODO Importaciones Locales
require('./database/db');
const { router } = require('./routes');

//TODO Configuraciones
const whiteList = ['https://main.dgg5xgiq7zxjo.amplifyapp.com/']

const app = express();
const port = process.env.PORT || 8080;
app.use(cors({whiteList}));
app.use(cookieParser());
app.use(fileUpload())
app.use(express.urlencoded({extended:true}));
app.use(express.json());

//TODO Rutas
app.use('/api', router);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
})



//NOTE SERVIDOR
app.listen(port, () => { console.log(`API funcionando en el puerto ${port}`) });