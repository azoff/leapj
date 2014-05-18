{LeapToFirebase} = require '../src/sender/leap_to_firebase'

_ = require 'underscore'
assert = require 'assert'
debug = require('debug') 'test:leap_to_firebase'
util = require 'util'

describe "Leap To Firebase", ->
  l2f = new LeapToFirebase

  base_event =
    user: 'string'
    # createdAt: 'serverTime' # automatically added by firebase
    stem: 'int'
    event: {}
    source: "leap"

  _.each [
    { type: 'pinch-start', value: 0 }
    { type: 'pinch-start', value: 1 }
    { type: 'pinch-stop', value: 0 }
    { type: 'pinch-stop', value: 1 }
  ], (pinch_event) ->
    it "takes a pinch command and outputs a track-on/off", ->
      expected = _.clone base_event
      expected.event = { type: "volume", level: if pinch_event.type is 'pinch-start' then 0 else 1}
      expected.stem = pinch_event.value
      actual = l2f.translate pinch_event
      assert.deepEqual actual, expected
