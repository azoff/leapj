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
    # TODO: Do something different depending on which hand is gesturing
    { type: 'pinch-start', value: { finger: 0, hand: 'left'} }
    { type: 'pinch-start', value: { finger: 1, hand: 'left'} }
    { type: 'pinch-stop', value: { finger: 0, hand: 'left'} }
    { type: 'pinch-stop', value: { finger: 1, hand: 'left'} }
  ], (pinch_event) ->
    it "takes a pinch command and outputs a track-on/off", ->
      expected = _.clone base_event
      expected.event = { type: "volume", level: if pinch_event.type is 'pinch-start' then 0 else 1}
      expected.stem = pinch_event.value.finger
      actual = l2f.translate pinch_event
      assert.deepEqual actual, expected
