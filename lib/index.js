
/**
 * Module dependencies.
 */

var debug = require('debug')('segmentio:millennial-media');
var Integration = require('segmentio-integration');
var dot = require('obj-case');
var Batch = require('batch');

/**
 * Expose `Millennial`
 */

var Millennial = module.exports = Integration('Millennial Media')
  .endpoint('http://cvt.mydas.mobi/handleConversion')
  .channels(['server', 'mobile', 'client'])
  .ensure('message.context.referrer.id')
  .ensure('settings.events')
  .ensure('message.event')
  .retries(2);

/**
 * Ensure referrer.type is millenial media
 */

Millennial.ensure(function(msg){
  var type = msg.proxy('context.referrer.type');
  if ('millennial-media' == type) return;
  return this.reject('context.referrer.type must be "millennial-media"');
});

/**
 * Track.
 *
 * http://docs.millennialmedia.com/conversion-tracking/S2S/mobile-web.html
 *
 * @param {Track} track
 * @param {Function} callback
 */

Millennial.prototype.track = function(track, callback){
  var trackIds = this.map(this.settings.events, track.event());
  var uriId = track.proxy('context.referrer.id');
  var batch = new Batch;
  var self = this;

  trackIds.forEach(function(id){
    batch.push(function(done){
      self
      .get()
      .query({ goalid: id })
      .query({ urid: uriId })
      .end(self.handle(done));
    });
  });

  batch.end(function(err, results){
    if (err) return callback(err);
    var res = results[0];
    res.all = results;
    callback(null, res);
  });
};
