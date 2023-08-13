const db = require('../database/db')
const jwt = require('jsonwebtoken')
const {putObject,deleteObject} = require('../utils/s3')
const utils = require('../utils/utils')
const { query } = require('express')
require('express')
require('express-fileupload')

const controllers = {}

controllers.upload = (req,res) => {
    const file = req.files.image
    
    const dataImage = file.data
    const nameSplit = file.name.split('.')
    const finalName = `${nameSplit[0]}-${Date.now()}.${nameSplit[nameSplit.length - 1]}`

    const {token} = req.query
    const decode = jwt.decode(token, process.env.SECRET_JWT)


    putObject(finalName,dataImage,(err,location) => {
        if(err) throw err

        console.log(`Ubicacion: ${location}`)

        db.query(`UPDATE users SET photo_profile = "${location}" WHERE id = ${decode.id}`, (err,result) => {
            if(err) throw err
            console.log(result)
            res.status(200).json({statusCode: 200, info: 'success', location: location})
        })
    })
}

controllers.delete = (req,res) => {

    const {image} = req.body
    const {token} = req.query
    const decode = jwt.decode(token, process.env.SECRET_JWT)

    deleteObject(image, (err,results) => {
        if(err) throw err
        console.log(results)

        db.query(`UPDATE users SET photo_profile = DEFAULT WHERE id = ${decode.id}`, (err,results) => {
            if(err) throw err
            console.log(results)
            res.status(200).json({statusCode: 200, info:'success'})
        })

        res.status(200).json({statusCode:200, info:'success'})
    })

}


//subir varias imagenes
controllers.uploadImages = (req,res) => {

    console.log('entro a upload images')
    
    const {token} = req.query
    
    const decode = jwt.decode(token, process.env.SECRET_JWT)
    
    db.query(`SELECT * FROM view_users WHERE id = ${decode.id}`, (err,results) => {
    
        if(err) {
    
            res.status(500).json({statusCode: 200, info: 'internal err'})
    
        }else{

            const userData = results[0]

            const file = req.files.images

            const arrimages = []

            if (Array.isArray(file)) {
                // Cuando hay varias imágenes
                arrimages = file.map((file, i) => {
                    const fileSplit = file.name.split('.')
                    const ext = fileSplit[fileSplit.length - 1]
                    const name = utils.generateName(i, userData)
                    const nameFinal = `${name}.${ext}`

                    putObject(nameFinal, file.data, (err, result) => {
                        if (err) throw err
                        console.log(result)
                    })

                    return nameFinal
                })
                
            } else {
                // Cuando hay solo una imagen
                const fileSplit = file.name.split('.')
                const ext = fileSplit[fileSplit.length - 1]
                const name = utils.generateName(0, userData)
                const nameFinal = `${name}.${ext}`

                putObject(nameFinal, file.data, (err, result) => {
                    if (err) throw err
                    console.log("Put Object: ",result)
                })

                arrimages.push(nameFinal)
            }

            const images = arrimages

            const nameImagesString = images.join(',')

            db.query(`UPDATE users SET images = "${nameImagesString}" WHERE id = ${decode.id}`, (err,results) => {
                if (err) throw err
                console.log("Update db: ", results)
            })

            res.status(200).json({
                statusCode :    200,
                info:           'success',
                urlbase:        process.env.URL_BUCKET_AWS,
                array:          images,
            })
        }
    })
}


//eliminar un objeto de array
controllers.deleteElementArrayImage = (req,res) => {
    
    const {token,indeximg} = req.query
    const decode = jwt.decode(token, process.env.SECRET_JWT)
    const query = `SELECT * FROM users WHERE id = ${decode.id}`

    if(!indeximg){
        return res.status(400).json({statusCode: 400, info: 'required index'})
    }

    db.query(query, (err,results) => {
        
        let user = results[0]
        let arrayImages = user.images.split(',')
        let keyImage = arrayImages[indeximg]
        let newArrayImages = arrayImages.filter(item => item !== keyImage);
        let newArrayString = (arrayImages.length == 0) ? 'sin imagenes' : newArrayImages.join(',')
        let queryDelete = `UPDATE users SET images = "${newArrayString}"`

        if(indeximg > arrayImages.length - 1) {
            return res.status(400).json({statusCode: 400, info: 'index invalid'})
        }

        console.log(keyImage);


        deleteObject(keyImage, (err,result) => {
            
            if(err) return res.status(500).json({statusCode: 500, info: 'internal err'})

            db.query(queryDelete, (err ,results) => {
                console.log(queryDelete)
                if(err) return res.status(500).json({statusCode: 500, info: 'internal err'})
                console.log(results)
                res.status(200).json({statusCode: 200, info: 'success', images: newArrayImages})
            
            })
        
        })
    })
}



module.exports = controllers