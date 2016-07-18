// Put your parse application keys here!
$.ajaxPrefilter(function (settings, _, jqXHR) {
  jqXHR.setRequestHeader("X-Parse-Application-Id", "PARSE_APP_ID");
  jqXHR.setRequestHeader("X-Parse-REST-API-Key", "PARSE_API_KEY");
});

module.exports = {

  getYelp: function(req, res, next){
    console.log("req body is: ", req.body.data);
    //data: {category: "", location: ""}

    res.status(200).send("getYelp Ran")
  }

};