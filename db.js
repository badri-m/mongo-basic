const mongodb = require('mongodb'); //importing mongodb
const MongoClient = mongodb.MongoClient;
const ObjectId= mongodb.ObjectId;
let database;

 async function getdatabase() {
    const client= await MongoClient.connect('mongodb://localhost:27017/') //local host
    database= client.db('cricket');

    
if (!database){
    console.log("ur wrong" );
    }
    return database;
}
module.exports={
    getdatabase,
    ObjectId
}