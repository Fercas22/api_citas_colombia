const express = require('express');
const router = express.Router();
const fs = require('fs');

const PATH_ROUTER = __dirname;

//TODO video.js
const cleanFileName = (fileName) => {
    //TODO video
    const clean = fileName.split(".").shift();
    return clean;
}

//TODO [idex.js, video.js] 
fs.readdirSync(PATH_ROUTER).filter((fileName) => {
    const prefixRoute = cleanFileName(fileName);
    if (prefixRoute !== "index") {
        console.log(`Cargando la ruta... ${prefixRoute}`);
        router.use(`/${prefixRoute}`, require(`./${prefixRoute}.js`));
    }
})


module.exports = { router };