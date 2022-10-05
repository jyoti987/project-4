const shortid = require("shortid");
const validUrl = require("valid-url");
const urlModel = require("../models/urlModel");
const redis = require("redis");
const { promisify } = require("util");

//------------------------------------redis config-----------------------------------//

const redisClient = redis.createClient(
  10645,
  "redis-10645.c301.ap-south-1-1.ec2.cloud.redislabs.com",
  { no_ready_check: true }
);
redisClient.auth("x3nVz7zjAArrQ8D0Q4Zl0elufm2nlLbB", function (err) {
  if (err) throw err;
});

redisClient.on("connect", async function () {
  console.log("Connected to Redis..");
});

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);

//-------------------------------create api-----------------------------------//

const createShorturl = async function (req, res) {
  try {
    let originalUrl = req.body.longUrl;
    if (!originalUrl) {
      return res
        .status(400)
        .send({ staus: false, msg: "User need to put long url" });
    }
    if (Object.keys(originalUrl).length == 0) {
      return res.status(400).send({
        status: false,
        message: `Request body can't be empty`,
      });
    }
    if (!validUrl.isUri(originalUrl)) {
      return res.status(401).send({
        status: false,
        message: "Please provide valid base url in the code",
      });
    }
    const urlCode = shortid.generate();
    const shortUrl = "http://localhost:3000" + "/" + urlCode;
    let output = {
      longUrl: originalUrl,
      shortUrl: shortUrl,
      urlCode: urlCode.trim().toLowerCase(),
    };
    let cachedUrl = await GET_ASYNC(`${originalUrl}`);
    if (cachedUrl) {
      let urlData = JSON.parse(cachedUrl);
      return res.status(200).send({
        status: true,
        msg: "Url already exist in redis",
        data: urlData,
      });
    }
    let uniqueUrl = await urlModel
      .findOne({ longUrl: originalUrl })
      .select({ __v: 0, updatedAt: 0, createdAt: 0, _id: 0 });
    if (uniqueUrl) {
      await SET_ASYNC(`${uniqueUrl.longUrl}`, JSON.stringify({ uniqueUrl }));
      return res.status(200).send({
        status: true,
        msg: "Url already exist in database",
        data: uniqueUrl,
      });
    }
    let savedUrl = await urlModel.create(output);
    return res
      .status(201)
      .send({ status: true, msg: "Created data successfully", data: savedUrl });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

//---------------------get api------------------------------------//

const fetchUrlData = async function (req, res) {
  try{
  let cahcedUrlData = await GET_ASYNC(`${req.params.urlCode}`);
  if (cahcedUrlData) {
    let convertDataToJson = JSON.parse(cahcedUrlData);
    return res.status(302).redirect(convertDataToJson.longUrl);
  } else {
    let findUrl = await urlModel.findOne({ urlCode: req.params.urlCode });
    await SET_ASYNC(`${req.params.urlCode}`, JSON.stringify(findUrl));
    return res.status(200).send({
      status: true,
      msg: "This url already exist in database",
      data: findUrl,
    });
  }
}catch(err){
  return res.status(500).send({status:false,error:err.message})
}
 }

module.exports = { createShorturl, fetchUrlData };




// // const fetchUrlData = async function (req, res) {
// //   try {
//     let cahcedUrlData = await GET_ASYNC(`${req.params.urlCode}`);
//     if (cahcedUrlData == null) {
//       let findUrl = await urlModel.findOne({ urlCode: req.params.urlCode });
//       if (cahcedUrlData == null) {
//         return res.status(404).send({
//           status: true,
//           msg: "url not found",
//         });
//       }
//       await SET_ASYNC(`${req.params.urlCode}`, JSON.stringify(findUrl));
//       return res.status(200).send(findUrl.longUrl);
//     } else {
//       return res.status(302).redirect(cahcedUrlData);
//     }
//   } catch (err) {
//     return res.status(500).send({ status: false, error: err.message });
//   }
// };