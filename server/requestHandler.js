

module.exports = {

  getYelp: function(req, res, next){
    console.log("req body is: ", req.body);
    res.status(200).send("getYelp Ran")
  }

};