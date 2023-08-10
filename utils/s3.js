const { S3Client, PutObjectCommand, DeleteObjectsCommand } = require('@aws-sdk/client-s3')

require('dotenv').config()

const s3Client = new S3Client({
    credentials:{
        accessKeyId: process.env.ACCESS_KEY_AWS,
        secretAccessKey: process.env.SECRET_KEY_AWS
    }
})

const S3 = {}

S3.putObject = async (name, file, cb) => {
    const params = {
        Bucket : process.env.BUCKET_NAME_AWS,
        Key : name,
        Body : file
    }

    try{
        const command = new PutObjectCommand(params)
        const response = await s3Client.send()

        const location = response.Location

        cb(null, location)
    }catch(err){
        cb(err, null)
    }
}

S3.deleteObject = async (name, cb) => {
    const params = {
        Bucket: process.env.BUCKET_NAME_AWS,
        Key: name
    }

    try{
        const command = new DeleteObjectsCommand(params)
        const response = await s3Client.send(command)

        cb(null,response)
        console.log(`Delete complete: ${name}`)
    }catch(err){
        cb(err,null)
    }
}

module.exports = S3
// AWS.config.update({
//     accessKeyId : process.env.ACCESS_KEY_AWS,
//     secretAccessKey : process.env.SECRET_KEY_AWS
// })


// const s3 = new AWS.S3()

// const S3 = {}

// S3.putObject = (name, file, cb) => {
//     const params = {
//         Bucket: process.env.BUCKET_NAME_AWS,
//         Key : name,
//         Body : file
//     }

//     s3.upload(params, (err,data) => {
//         if(err){
//             cb(err, null)
//             return
//         }
        
//         const location = data.Location

//         cb(null, location)
//     })

// }

// S3.deleteObject = (name, cb) => {
    
//     const params = {
//         Bucket: process.env.BUCKET_NAME_AWS,
//         Key : name,
//     }

//     s3.deleteObject(params, (err,data) => {
//         if(err) return cb(err,null)
//         cb(null, data)
//         console.log('delete complete: ' + name)
//     })
    
// }

// module.exports = S3