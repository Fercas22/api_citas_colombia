require('express')
require('dotenv').config()
const jwt = require('jsonwebtoken')

const db = require('../database/db')
const statusCodes = require('../utils/statusCodes')
// const statusCodes = require('../utils/statusCodes')

const midlewares = {}

//NOTE - VERIFICAR AUTH 
midlewares.verify = (req, res, next) => {

    const { token } = req.query

    try {
        const tokenExp = jwt.verify(token, process.env.JWT_SECRET)

        const isExpired = Date.now() >= tokenExp.exp * 1000

        if (!isExpired) {
            const decoded = jwt.decode(token, process.env.JWT_SECRET)

            const { id } = decoded

            db.query(`SELECT * FROM users WHERE id = "${id}"`, (err, results) => {
                if (err) {
                    res.status(500).json({ statusCode: 500, info: 'internal error' })
                    return
                }
                if (results.length == 0) {
                    res.status(401).json({ statusCode: 401, info: 'unauthotized' })
                    return
                }
                next()
            })
        }else{
            res.statusCode(401).json({statusCode:401, info: 'expired token'})
        }
    }
    catch(err){
        console.log('error en el token ')
        res.status(401).json({statusCode:401, info:'unauthotized'})
        return
    }

}

midlewares.addview = (req,res,next) => {

    /**
     * error interno del servidor - 500
     * usuario no encontrado - 404
     * view añadida a db - 200
     */

    let {token} = req.params
    let id = generateID()
    let decode = jwt.decode(token, process.env.JWT_SECRET)
    let visited_user_id = req.params.id
    let visitor_user_id = decode.id


    db.query(`SELECT * FROM users WHERE id = "${visited_user_id}";`, (err,results) => {
        if(err){
            res.status(500).json({statusCode:500,info:'internal error'})
            return
        }
        if(results.length == 0){
            res.status(404).json({statusCode:404,info:'user not fount'})
            return
        }
        console.log(results)
        db.query(`INSERT INTO views SET ?`, [{id:id, user_id:visitor_user_id, post_id:visited_user_id}], (err,result)=>{
            if(err){
                console.log(err)
                res.status(500).json({statusCode:500,info:'unregistered visit'})
                return
            }
            //si se registro la visita seguimos
            next()
        })
    })

}

//TODO - VERIFICAR CORREO
midlewares.verifyEmail = (req,res,next) => {
    let {mail} = req.body
    db.query(`SELECT * FROM users WHERE mail="${mail}"`, (err,results) => {
        if(err){
            console.log(err)
            res.status(500).json(statusCodes['internalErr'])
            return
        }
        if(results.length > 0){
            res.status(409).json(statusCodes['notAvailable'])
            return
        }
        next()
    })
}

module.exports = midlewares