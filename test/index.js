
var Test = require('segmentio-integration-tester');
var helpers = require('./helpers');
var assert = require('assert');
var should = require('should');
var MM = require('..');

describe("Millennial Media", function() {
  var settings;
  var mm;

  beforeEach(function(){
    mm = new MM;
    settings = {
      events: {
        'Bear tracks': '12345'
      }
    };
  });

  beforeEach(function(){
    mm = new MM(settings);
    test = Test(mm, __dirname);
  });

  it('should have the correct settings', function(){
    test
      .name('Millennial Media')
      .endpoint('http://cvt.mydas.mobi/handleConversion')
      .channels(['server', 'mobile', 'client'])
      .ensure('message.context.referrer.id')
      .ensure('settings.events')
      .ensure('message.event')
      .retries(2);
  });

  describe('.validate()', function(){
    var msg;

    beforeEach(function(){
      msg = {
        event: 'some-event',
        context: {
          referrer: {
            id: 'some-id',
            type: 'millennial-media'
          }
        }
      };
    });

    it('should be invalid if `.events` are missing', function(){
      delete settings.events;
      test.invalid(msg, settings);
    });

    it('should be invalid if `referrer.id` is missing', function(){
      delete msg.context.referrer.id;
      test.invalid(msg, settings);
    });

    it('should be invalid if `.referrer.type` is not "millennial-media"', function(){
      msg.context.referrer.type = 'foo';
      test.invalid(msg, settings);
    });

    it('should be invalid if `.event` is missing', function(){
      delete msg.event;
      test.invalid(msg, settings);
    });

    it('should be valid if settings are complete', function(){
      test.valid(msg, settings);
    });
  });

  describe('.track()', function(){
    var track;

    beforeEach(function() {
      track = helpers.track.bare({
        context: {
          referrer: {
            id: 'SAhCht3bQKPGd-z7ZvtYWW-i',
            type: 'millennial-media'
          }
        }
      });
    });

    it('should track an event successfully', function(done){
      test
        .track(track, settings)
        .query({ goalid: '12345' })
        .query({ urid: 'SAhCht3bQKPGd-z7ZvtYWW-i' })
        .expects(200, done);
    });

    it('should match the event name case-insensitively', function(done){
      var trackData = track.json();
      trackData.event = track.event().toUpperCase();
      track = helpers.track(trackData);
      test
        .track(track, settings)
        .expects(200, done);
    });

    it('should support array events', function(done){
      var events = mm.settings.events = [];
      events.push({ key: track.event(), value: 12345 });
      events.push({ key: track.event(), value: 12345 });
      mm.track(track, function(err, res){
        if (err) return done(err);
        assert.equal(200, res.status);
        assert.equal(2, res.all.length);
        done();
      });
    })
  });
});

