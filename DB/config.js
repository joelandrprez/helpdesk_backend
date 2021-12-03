const mongoose = require('mongoose');
require ('dotenv').config();




const dbConnection = async()=>{
    try {
        await mongoose.connect(process.env.CONN);
    console.log('DB ONLINE');
    } catch (error) {
        console.log(error);
    }


}
module.exports = {
    dbConnection
} 