const express = require('express')
const router = express.Router()
const path = require('path')
const fsPromises = require('fs').promises
let obj = {};

(async () => {
    try{
        const data = await fsPromises.readFile(path.join(__dirname, '..', '..', 'model', 'students.json'), 'utf-8');
        if(data)
            obj = JSON.parse(data);

    } catch(e){
        console.log("Failed to read students data", e)
    }
})();

router.route('/')
    .get((req, res) =>{
        res.send(obj)
    })
    .post(async (req, res) => {
        if(req.body.name){
            obj.push({"id" : obj.length+1, "name" : req.body.name});
            await fsPromises.writeFile(path.join(__dirname, '..', '..', 'data', 'students.json'), JSON.stringify(obj), 'utf-8')
            res.json({"message" : "Request processed successfully"})
        } else 
            res.status(400).json({"message" : "Required field name is missing"})

    })


module.exports = router