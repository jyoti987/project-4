const express = require('express')
const router = express.Router()
const {createShorturl,geturl}=require("../controllers/urlController")


router.post("/url/shorten",createShorturl)
 router.get("/:urlCode",geturl)












module.exports=router