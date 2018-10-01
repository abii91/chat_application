/**
* PublicController
*
* @description :: Server-side logic for managing Public route requests
*/

const fs = require('fs');

module.exports = {

  index: function(req, res) {
    var pub_files = [];
    var param_file = req.route.params[0];

    // sails.log(req.route);
    // return res.ok();

    if( param_file === undefined || param_file == '' )
    {
      fs.readdir('./public/', function(err, files){
        files.forEach(function(file, index){
          pub_files.push(file);

          if(index === files.length - 1)
          {
            res.view('public', {
              files: pub_files
            });
          }
        });
      });
    }
    else {
      var file_path = 'public/' + param_file;
      fs.exists(file_path, function(file_exists){
        if( file_exists === true )
        {
          fs.readFile(file_path, function(err, data){
            if(err) return res.badRequest();
            res.writeHead(200);
            res.end(data);
          });

          // res.download(file_path, function(err){
          //   if (err)
          //     return res.serverError(err)
          // });
        }
        else
        res.badRequest();
      });
    }
  }

};
