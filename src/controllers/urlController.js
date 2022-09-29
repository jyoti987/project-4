const shortid = require("shortid")
const validUrl = require("valid-url")
const urlModel = require("../models/urlModel")

const createShorturl = async function (req, res) {

    let url = req.body

    if (Object.keys(url).length == 0) {
        res.status(400).send({ status: false, message: "Please provide url in the request body" })
    }

    let { urlCode, longUrl, shortUrl } = url

    if(!urlCode){
        res.status(400).send({ status: false, message: "Please provide urlCode" })
    } 

    if(!longUrl){
        res.status(400).send({ status: false, message: "Please provide longUrl" })
    }

    const checkUniqueUrl=await urlModel.findOne({longUrl})
    if(checkUniqueUrl){
        res.status(404).send({ status: false, message: "this url is already exist plz provide different url" })
    }

    let baseUrl= "https://localhost:3000"

    let createShortU=baseUrl+"/"+shortid.generate()


}

module.exports={createShorturl}