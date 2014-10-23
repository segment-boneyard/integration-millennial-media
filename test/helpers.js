
var facade = require('segmentio-facade');
var extend = require('extend');
var uid = require('uid');
var merge = require('merge-util');

var userId1  = uid();
var userId2  = uid();
var email    = 'testing-' + userId1 + '@segment.io';
var groupId  = uid();

exports.track = function (context) {
  context = extend({
    userId     : userId1,
    event      : 'Baked a cake',
    properties : {
      layers  : ['chocolate', 'strawberry', 'fudge'],
      revenue : 19.95,
      numLayers : 10,
      fat : 0.02,
      bacon : '1',
      date : (new Date()).toISOString(),
      address : {
        state : 'CA',
        zip  : 94107,
        city : 'San Francisco'
      }
    },
    channel    : 'server',
    timestamp  : new Date(),
    context : {
      groupId: groupId,
      traits : {
        email   : email,
        age     : 23,
        created : new Date(),
        bad     : null,
        alsoBad : undefined,
        address : {
          state : 'CA',
          zip  : 94107,
          city : 'San Francisco'
        }
      },
      ip : '12.212.12.49',
      userAgent: 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)'
    }
  }, context);
  return new facade.Track(context);
};


exports.track.bare = function (context) {
  context = extend({
    userId  : 'aaa',
    event   : 'Bear tracks',
    channel : 'server'
  }, context);
  return new facade.Track(context);
};


/**
 * Use a particular user id
 */

exports.identify = function (context) {
  context = extend({
    userId : userId1,
    traits : {
      fat         : 0.02,
      firstName   : 'John',
      'Last Name' : 'Doe',
      email       : email,
      company     : 'Segment.io',
      city        : 'San Francisco',
      state       : 'CA',
      phone       : '5555555555',
      websites    : [
        'http://calv.info',
        'http://ianstormtaylor.com',
        'http://ivolo.me',
        'http://rein.pk'
      ],
      bad     : null,
      alsoBad : undefined,
      met : (new Date()).toISOString(),
      created : new Date('1/12/2013'),
      userAgent: 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)'
    },
    context : {
      ip: '12.212.12.49',
      groupId: groupId
    },
    timestamp : new Date(),
    channel : 'server'
  }, context);
  return new facade.Identify(context);
};

/**
 * Group
 */

exports.group = function(context){
  return new facade.Group(extend({
    timestamp: new Date,
    channel: 'server',
    groupId: groupId,
    userId: userId1,
    traits: {
      name: 'Segment.io',
      email: 'john@segment.io',
      created: new Date,
      plan: 'free'
    }
  }, context));
};


exports.alias = function (context) {
  context = extend({
    from      : userId1,
    to        : userId2,
    channel   : 'server',
    timestamp : new Date()
  }, context);
  return new facade.Alias(context);
};

/**
 * Create a page call merged from `options`
 *
 * @param {Object} options
 * @return {Page}
 */

exports.page = function(options){
  return new facade.Page(merge({
    name: 'Page',
    category: 'Docs',
    userId: userId1,
    properties: {
      url: 'https://segment.io/docs',
      title: 'Analytics.js - Segment.io'
    },
    context: {
      ip: '12.212.12.49'
    },
    timestamp: new Date,
    channel: 'server'
  }, options || {}));
};


/**
 * Create a scree call merged from `options`
 *
 * @param {Object} options
 * @return {Screen}
 */

exports.screen = function(options){
  return new facade.Screen(merge({
    name: 'Screen',
    category: 'Docs',
    userId: userId1,
    properties: {
      url: 'https://segment.io/docs',
      title: 'Analytics.js - Segment.io'
    },
    context: {
      ip: '12.212.12.49'
    },
    timestamp: new Date,
    channel: 'server'
  }, options || {}));
};
