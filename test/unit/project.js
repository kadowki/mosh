/* jshint expr:true */


'use strict';

var expect     = require('chai').expect,
    Lab        = require('lab'),
    cp         = require('child_process'),
    lab        = exports.lab = Lab.script(),
    Project    = require('../../server/models/project'),
    describe   = lab.describe,
    it         = lab.it,
    beforeEach = lab.beforeEach,
    h          = require('../helpers/helpers'),
    db         = h.getdb();


describe('Project', function(){
  beforeEach(function(done){
     cp.execFile(__dirname + '/../../scripts/clean-slate.sh', [db], {cwd:__dirname + '/../../scripts'}, function(err, stdout, stderr){
       done();
     });
  });

  describe('constructor', function(){
    it('should construct a new project', function(done){
      var project = new Project();
      expect(project).to.be.instanceof(Project);
      done();
    });
  });

  describe('.create', function(){
    it('should create a new project', function(done){
      var payload = {projName: 'Bob Testing Project'};
      Project.create(payload, {id: 1}, function(err, results){
        expect(err).to.be.null;
        done();
      });
    });
  });

  describe('.all', function(){
    it('should get all projects for a logged in user', function(done){
      Project.all({id: 1}, function(err, results){
        expect(err).to.be.null;
        expect(results.rows.length).to.be.above(1);
        done();
      });
    });
  });

  describe('.findOne', function(){
    it('should get all projects for a logged in user', function(done){
      Project.findOne({pid: 1}, function(project, streams){
        expect(project.length).to.be.equal(1);
        expect(streams).to.be.ok;
        done();
      });
    });
  });

});
