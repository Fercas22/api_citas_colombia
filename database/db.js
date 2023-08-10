const mysql = require('mysql')
const dotenv = require('dotenv')
dotenv.config()

const db = mysql.createConnection({
    host            :   process.env.HOST_DB,
    user            :   process.env.USER_DB,
    password        :   process.env.PASS_DB,
    database        :   process.env.NAME_DB,
})

db.connect((err)=>{
    if(err) throw err
    console.log('Conexión exitosa con MySQL')
})

function keepAlive(){
    db.query('SELECT 1', (err) => {
        if(err){
            console.log('Error al mantener vivo el servidor')
            return
        }

        console.log('Conexión activa')
    })
}

setInterval(keepAlive, 300000)


module.exports = db