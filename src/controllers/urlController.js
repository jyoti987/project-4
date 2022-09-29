const shortid = require("shortid");
const validUrl = require("valid-url");
const urlModel = require("../models/urlModel");

const createShorturl = async function (req, res) {
  let data = req.body;
  let { longUrl } = data;
  if (Object.keys(longUrl).length == 0) {
    res
      .status(400)
      .send({
        status: false,
        message: "Please provide url in the request body",
      });
  }
  const baseUrl = "http://localhost:3000";
  if (!validUrl.isUri(baseUrl)) {
    res
      .status(401)
      .send({
        status: false,
        message: "Please provide url in the request body",
      });
  }

  const urlCode = shortid.generate();
  if (validUrl.isUri(longUrl)) {
    try {
      const url = await urlModel.findOne({ longUrl });
      if (url) {
        res
          .status(404)
          .send({
            status: false,
            message: "this url is already exist plz provide different url",
          });
      } else {
        const shortUrl = baseUrl + "/" + urlCode;
        let obj = {
          longUrl,
          shortUrl,
          urlCode,
        };
        const createData = await urlModel.create(obj);
        res
          .status(201)
          .send({ status: true, msg: "created", data: createData });
      }
    } catch (err) {
      res.status(500).send({ status: false, msg: err.msg });
    }
  } else {
    res.status(401).send({ status: false, msg: "invalid long" });
  }
};

module.exports = { createShorturl };
