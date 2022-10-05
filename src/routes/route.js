const express = require('express')
const router = express.Router()
const {createShorturl,fetchUrlData}=require("../controllers/urlController")

//create short url
router.post("/url/shorten",createShorturl)
//get url data
router.get("/:urlCode",fetchUrlData)












module.exports=router