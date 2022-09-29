const express = require('express')
const router = express.Router()
const {createShorturl}=require("../controllers/urlController")


router.post("/url/shorten",createShorturl)












module.exports=router