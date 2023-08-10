require('express')
const jwt = require('jsonwebtoken');
const db = require('../database/db');
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
    info: 'Success'
};


// NOTE - registrar like
controller.like = (req,res) => {
    let {post_id, token} = req.query
    let user_id = jwt.decode(token, process.env.JWT_SECRET)
    
    console.log(user_id)

    db.query(`SELECT * FROM users WHERE id = '${user_id}';` , (err,user) => {
        if(err){
            res.status(500).json(internalErr);
            return
        }
        if(user.length == 0){
            res.status(404).json(notFount);
            return
        }
        db.query(`INSERT INTO likes(user_id,liked_user_id) VALUE(${user_id},${post_id})`, (err, result) => {
            if(err) {
                console.log(err)
                res.status(500).json(internalErr);
                return
            }
            res.status(200).json(successOk)
        })
    })

}

//NOTE regitrar vista
controller.view = (req,res) => {
    let {post_id, token} = req.query
    let user_id = jwt.decode(token, process.env.JWT_SECRET)
    
    db.query(`SELECT * FROM users WHERE id = '${user_id}';` , (err,user) => {
        if(err){
            res.status(500).json(internalErr);
            return
        }
        if(user.length == 0){
            res.status(404).json(notFount);
            return
        }
        db.query(`INSERT INTO views(user_id,viewed_user_id) VALUE(${user_id},${post_id})`, (err, result) => {
            if(err) {
                console.log(err)
                res.status(500).json(internalErr);
                return
            }
            res.status(200).json(successOk)
        })
    })

}

//NOTE regitrar favorito
controller.favorite = (req,res) => {
    let {post_id, token} = req.query
    let user_id = jwt.decode(token, process.env.JWT_SECRET)
    
    db.query(`SELECT * FROM users WHERE id = '${user_id}';` , (err,user) => {
        if(err){
            res.status(500).json(internalErr);
            return
        }
        if(user.length == 0){
            res.status(404).json(notFount);
            return
        }
        db.query(`INSERT INTO favorites(user_id,favorite_user_id) VALUE(${user_id},${post_id})`, (err, result) => {
            if(err) {
                console.log(err)
                res.status(500).json(internalErr);
                return
            }
            res.status(200).json(successOk)
        })
    })

}


module.exports = controller