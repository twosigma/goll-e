var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var util = require('util');
var multiparty = require('multiparty');

/* Endpoint for a specific piece of graph content. */
var endpoint = ":gcl(([a-zA-Z0-9]+|[a-zA-Z0-9]+\.gcl))";

/* The path where graph files reside. */
var graph_dir = path.join(__dirname, "..", "..", "graphs");
var config = {
  active_dir: path.join(graph_dir, "active"),
  archive_dir: path.join(graph_dir, "archived")
};

/* GET List of graph content. */
router.get("/graphs/", function(req, res, next) {
  fs.readdir(config.active_dir, function(err, files) {
    if (err) {
      next(err);
      return;
    }

    // Build up metadata for the files.
    var fileData = [];
    files.forEach(function(name) {
      var data = {
        "filename": name
      };
      fileData.push(data);
    });

    // Send off the object structure we just built up.
    res.setHeader('Content-Type', 'application/json');
    res.json(fileData);
  });
});

/* GET Retrieve a single graph instance. */
router.get("/graphs/:gcl", function(req, res, next) {
  // Figure out the path to the file.
  var file = path.join(config.active_dir, req.params.gcl);

  // Make sure the file exists.
  fs.exists(file, function(exists) {
    // If the file doesn't exist, return a 404.
    if( !exists ) {
      res.status(404).end();
      return;
    }

    // Attempt to do something useful with the file now that we know it exists.
    fs.readFile(file, function(err, data) {
      // If the file could not be read for whatever reason, indicate that it
      // doesn't exist.
      // Making the error handler smarter down the road might be a good idea.
      if (err) {
        next(err);
        return;
      }

      // If we did find the content though, send it to the user.
      res.setHeader('content-type', 'text/plain');
      res.send(data);
    });
  });
});

/* POST A new graph to the collection. */
router.post("/graphs/", function(req, res, next) {
 // fs.writeFile(path.join(config.active_dir, req.body.filename), req.body.contents, function(err) {
 //     if(err) {
 //      res.status(500).send({error: err});
 //     }
 //     res.send({success: true});
 // });

 // Configure multi-part form uploads.
    var options = {
        autoFiles: true,
        uploadDir: config.active_dir
    };
    var form = new multiparty.Form(options);

    // Handle multi-part form data.
    form.parse(req, function(err, fields, files) {
        // If there was some kind of error parsing the multi-part form,
        // forward it to our error handler and bail out.
        if (err) {
            next(err);
            return;
        }

        // Make sure we actually have a filename field in whatever form is
        // submitting the request.
        if (!fields.hasOwnProperty("filename")) {
            throw "No filename property.";
        }

        // We must have at least something file-like for the gcl_content field.
        if (!files.hasOwnProperty("contents")) {
            throw "No contents";
        }

        // At this point, Multiparty will have uploaded the file to the graphs
        // directory, but it won't be the name that we want. We'll go ahead and
        // move the file to the proper location.
        var temp = files.contents[0].path;
        var dest = path.join(config.active_dir, fields.filename[0]);
        fs.rename(temp, dest, function(err) {
            if (err) {
                next(err);
                res.status(500).end();
                return;
            }
            res.status(200).end();
        });
    });

});

/* PUT Update an existing graph. */
/* TODO: Implement this. For now, POST'ing to an existing graph will
 * overwrite it. */
router.put("/graphs/:gcl", function(req, res, next) {
  res.status(501).end();
});

/* DELETE Remove an existing graph. */
/* Note that this doesn't actually delete anything, it moves files to the
 * archive directory */
router.delete("/graphs/:gcl", function(req, res, next) {
  // Build up a path to the existing file, assuming it exists.
  var existing = path.join(config.active_dir, req.params.gcl);
  var destination = path.join(config.archive_dir, req.params.gcl);

  // Only attempt to move the graph if it exists.
  fs.exists(existing, function(exists) {
    if( exists ) {
      fs.rename(existing, destination, function(err) {
        // If the file can't be deleted for whatever reason, forward the error
        // to the error handler and bail out.
        if (err) {
          next(err);
          return;
        }
        res.status(200).send({success: true});
      });
    }
    else {
      res.status(404).send({error: 'File not found'});
    }
  });
});

module.exports = router;
