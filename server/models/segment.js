/* jshint unused:false */
'use strict';

var pg     = require('../config/postgres/manager'),
    async  = require('async'),
    Reply  = require('./reply'),
    AWS    = require('aws-sdk');

function Segment(){
}

Segment.create = function(obj, user, cb){
  pg.query('insert into segments (creator, stream_id, body) values ($1, $2, $3)', [user.id, obj.streamId, obj.body], cb);
};

//needs to be modified where it also gets attachments
Segment.getAll = function(obj, cb){
  pg.query('select * from get_segments($1)', [obj.sid], function(err, results){
    if(err){return cb(err);}
    async.map(results.rows, iterator, function(err, segments){
      if(err){return cb(err);}
      cb(null, segments);
    });
  });
};

Segment.update = function(obj, user, cb){
  pg.query('update segments set body = $1, edited_by = $2, date_edited = now() where id = $3;', [obj.body, user.username, obj.segmentId], cb);
};

Segment.delete = function(segId, cb){
  pg.query('delete from segments where id = $1', [segId], cb);
};

module.exports = Segment;

function iterator(row, cb){
  Reply.populate(row.id, function(err, replys){
    row.replys = replys.rows;
    cb(err, row);
  });
}

//for use later
function deleteAttachments(segId, attachments){
  var s3   = new AWS.S3(),
  params = {
    Bucket: process.env.AWS_BUCKET,
    Delete: { /* required */
      Objects: [ /* required */
        {
          Key: 'STRING_VALUE' /* required */
        }
      ],
      Quiet: true
    }
  };

  //no big callback needed since segment this is taken care of on AWS
  s3.deleteObjects(params, function(err, data){
    if (err) {
      console.log(err, err.stack);
    }
    else {
      console.log(data);
    }
  });
}


