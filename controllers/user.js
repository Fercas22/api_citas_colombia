require('express')
require('dotenv').config()
const jwt = require('jsonwebtoken')
const db = require('../database/db');
const { query } = require('express');
const { generateArrayImages } = require('../utils/utils');
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
    info: 'Success'
};

// Peticion de prueba
controller.index = (req, res) => {
    res.send('Servicio corriendo con éxito');
};

//diferentes filtros
controller.filterMultiple = (req,res) => {

    const {token} = req.query
    const id_user = jwt.decode(token,process.env.JWT_SECRET).id
    console.log(id_user)

    const { 
        age, 
        ageRangeMax,
        ageRangeMin,
        gender, 
        preferences, 
        country, 
        city, 
        state_province, 
        cantusers, 
        page 
    } = req.query

    let sql = `SELECT * FROM view_users WHERE 1=1`
    
    if(age) sql += ` AND age = ${age}`
    if(ageRangeMax && ageRangeMin) sql += ` AND (age >= ${ageRangeMin} AND age <= ${ageRangeMax})`
    if(gender) sql += ` AND gender = "${gender}"`
    if(country) sql += ` AND country = "${country}"`
    if(preferences) sql += ` AND preferences = "${preferences}"`
    if(city) sql += ` AND city = "${city}"`
    if(state_province) sql += ` AND state_province = "${state_province}"`
    if(cantusers && page) {
        let offset = (page - 1) * cantusers
        sql += ` LIMIT ${cantusers} OFFSET ${offset}`
    }
    

    db.query(sql, (err,results) => {
        if(err) {
            res.status(500).json(internalErr)
            return
        }
        if(results.length == 0){
            console.log('No hay usuarios')
            res.status(404).json(notFount)
            return
        }
        if(cantusers && page){
            db.query('SELECT COUNT(*) AS pagesTotal FROM view_users', (err,cantUsers) => {
                
                let pagesTotal =  Math.ceil(cantUsers[0].pagesTotal/cantusers)

                const newObjectUsers = results.filter(user => user.id !== id_user)

                const usersObjectFinal = generateArrayImages(newObjectUsers);

                // console.log(newObjectUsers)
                res.status(200).json({
                    page: page,
                    pages: pagesTotal,
                    total: usersObjectFinal.length,
                    data: usersObjectFinal
                })
            })
        }

    })

}


// LINK - ver usuario
controller.showUser = (req,res) => {

    const {id} = req.query

    console.log(id)

    db.query('SELECT * FROM view_users WHERE id = ?', [id], (err,users) => {
        if(err) {
            console.log(err)
            res.status(500).json(internalErr)
            return
        }
        if(users.length == 0){
            res.status(404).json(notFount)
            return
        }
        const user = users[0]

        // console.log(user.imae)
        // res.send(user.images)
        
        const images = (user.images == null) ? null : user.images.split(',');

        if(images == null){
            user.images = images
            return res.status(200).json(user)
        }

        const imagesLinksArray = images.map((img) => {
            const imagesUrlConcat = `${process.env.URL_BUCKET_AWS}${img}`
            return imagesUrlConcat
        })

        user.images = imagesLinksArray
        res.status(200).json(user)
    })
}


// Actualizar usuario
controller.updRegister = (req,res) => {
    const {table, id} = req.query;
    const body = req.body;

    db.query(`UPDATE ${table} SET ? WHERE id = ${id}`, [body], (err, rows) => {

        if (err) {
            console.log(err)
            res.status(500).json(internalErr);
            return
        }
        res.status(200).json(successOk);
    });
};

// Eliminar usuario (cuenta)
controller.delRegister = (req,res) => {
    const {id, table} = req.query;
    db.query(`SELECT id FROM ${table} WHERE id = ${id};`, (err, results) => {
        if (err) {
            res.status(500).json(internalErr);
            return
        }
        if (results.length == 0) {
            res.status(404).json(notFount);
            return
        } else {
            db.query(`DELETE FROM ${table} WHERE id = ${id}`, (err, rows) => {
                if(err) throw err
                res.json(successOk);
            });
        }
    });
};


//LINK - update aditionals;
controller.updateAditionals = (req,res) => {
    const body = req.body;
    const {id_user} = req.query;
    let querySelect = `SELECT * FROM show_aditionals WHERE id_user = ${id_user};`;
    let queryUpdate = `UPDATE aditionals SET ? WHERE id_user = ${id_user}`;
    let queryInsert = `INSERT INTO aditionals SET ?`;

    db.query(querySelect, (err, results) => {

        let responseErr = {...internalErr}
        let responseOk = {...successOk};
        
        if(err) return res.status(500).json(internalErr); //Si la consulta select falla

        if(results.length == 1){ //Si ya hay registro
            db.query(queryUpdate, [body], (err,results) => {

                console.log(results);
                responseErr.message = "Update Error";
                responseOk.message = "Update Correct";

                if(err) return res.status(500).json(responseErr);
                return res.status(200).json(successOk);

            })
        }else{ //Si no existe registro
            db.query(queryInsert, [body], (err,results) => {

                console.log(results);

                responseErr.message = "Insert Error";
                responseOk.message = "Insert Correct"

                if(err) return res.status(500).json(responseErr);
                return res.status(200).json(responseOk);

            });
        }
    })
}

// LINK - Ver adicionales
controller.showAditionals = (req,res) => {
    let {id_user} = req.query;
    let query = `SELECT * FROM show_aditionals WHERE id_user = ${id_user}`;
    let responseErr = {...internalErr};
    let responseOk = {...successOk};

    db.query(query, (err,results) => {
        if(err) return res.status(500).json(responseErr);
        if(results.length == 0) return res.status(404).json(notFount);
        let data = results[0];
        responseOk.data = data;
        res.status(200).json(responseOk);
    });
}

module.exports = controller;