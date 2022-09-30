const shortid = require("shortid");
const validUrl = require("valid-url");
const urlModel = require("../models/urlModel");

const createShorturl = async function (req, res) {
  let data = req.body;
  let { longUrl } = data;
  if (!longUrl) {
    res
      .status(400)
      .send({ status: false, msg: "Please provide long url in request body" });
      return
  }
  if (Object.keys(data).length == 0) {
    return res.status(400).send({
      status: false,
      message: `Request body can't be empty`,
    });
  }
  const baseUrl = "http://localhost:3000";
  if (!validUrl.isUri(baseUrl)) {
    return res.status(401).send({
      status: false,
      message: "Please provide valid base url in the code",
    });
  }

  const urlCode = shortid.generate().toLowerCase();
  if (validUrl.isUri(longUrl)) {
    try {
      const url = await urlModel.findOne({ longUrl });
      if (url) {
        return res.status(404).send({
          status: false,
          message: "This long url is already exist please provide different url",
          longUrl: url,
        });
      } else {
        const shortUrl = baseUrl + "/" + urlCode;
        let obj = {
          longUrl,
          shortUrl,
          urlCode
        };
        const createData = await urlModel.create(obj);
        res
          .status(201)
          .send({ status: true, msg: "created", data: createData });
      }
    } catch (err) {
      res.status(500).send({ status: false, msg: err.message });
      return;
    }
  } else {
    res.status(401).send({ status: false, msg: "Invalid long url" });
    return;
  }
};

//========================get url==============================//

const geturl = async (req, res) => {
  try {
    let findURL = await urlModel.findOne({ urlCode: req.params.urlCode });
    if (!findURL) {
      return res.status(404).send({
        status: false,
        msg: "No such urlCode found!",
      });
    }
    return res.status(302).redirect(findURL.longUrl);
  } catch (err) {
    res.status(500).send({
      status: false,
      msg: err.message,
    });
  }
};

module.exports = { createShorturl, geturl };
