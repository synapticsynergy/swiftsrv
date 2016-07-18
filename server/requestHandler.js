// Put your parse application keys here!


module.exports = {

  getYelp: function(req, res, next){
    console.log("req body is: ", req.body.data);
    //data: {category: "", location: ""}

    res.status(200).send("getYelp Ran")
  }

};