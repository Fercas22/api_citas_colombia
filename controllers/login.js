require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../database/db');
const ms = require('ms')
const {generateID} = require('../utils/utils');
const controller = {};

//CODIGOS DE ESTADO 
const notFount = {
    statusCode:404,
    info: 'Not fount'
};
const internalErr = {
    statusCode:500,
    info: 'Internal error'
};
const successOk = {
    statusCode:200,
    info: 'Success ok'
};

// Iniciar sesion
controller.login = (req,res) => {
    console.log('Entramos a incciar sesion');
    const {mail,password} = req.body;
    db.query(`SELECT * FROM users WHERE mail = "${mail}"`, (err,results) => {
        if (err) {
            console.log(err);
            res.status(500).json(internalErr);
            return
        }
        if (results.length == 0) {
            res.status(401).json({statusCode:401, info: 'Incorrect'});
            return
        }
        const pass = results[0].password;
        const email = results[0].mail;
        bcrypt.compare(password, pass, (err,result) => {
            // Si existe un error al encriptar
            if (err) {
                res.status(500).json(internalErr);
                return
            }
            // Si la contraseña es incorrecta
            if (!result) {
                res.status(401).json({statusCode:401, info:'Incorrect'});
                return
            }
            // Si la contraseña es correcta
            const expiresIn = '90d'
            const payload = {id: results[0].id}
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });

            const request = {
                statusCode:200, 
                info: "Done",
                id: payload.id,
                token: token
            }
            console.log('Inicaimos con exito');

            res.cookie('auth',`${token}`).status(200).json(request);
        });
    });
};

// Cerrar sesion
controller.logout = (req,res) => {
    const {token} = req.query
    db.query(`INSERT INTO blackListTokens(token) VALUE("${token}")`, (err,results) => {
        if(err) throw err
        res.json(results)
    })
};

// Registrar usuario
controller.register = (req,res) => {

    const body = req.body;

    console.log(body)
    bcrypt.hash(body.password, 10, (err,pass) => {
        if (err) {
            res.status(500).json(internalErr);
            return
        }
        body.password = pass;
        // Guardar datos en db
        db.query(`INSERT INTO users SET ?`, [body], (err, result) => {
            if (err) {
                console.log(err)
                res.status(500).json(internalErr);
                return
            }
            db.query(`INSERT INTO aditionals SET id_user = ${result.insertId};`, (err,result) => {
                if(err) return res.status(500).json(internalErr);
                res.status(200).json(successOk);
            })
        });
    });

};

module.exports = controller;