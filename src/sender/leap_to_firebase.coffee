class LeapToFirebase
  constructor: (firebase_room_uri) ->
    console.log "Construct LeapToFirebase. Connecting to #{firebase_room_uri}"
    @firebase_room_uri = firebase_room_uri
    @firebase = new Firebase @firebase_room_uri if firebase_room_uri

  translate: (leap_event) ->
    console.log JSON.stringify leap_event
    # Takes an event send by the leap controller (e.g. a gesture and value)
    # and translates it into the events that our audio engine expects.
    # We call it 'Firebase' since I'm passing those values to firebase,
    # but really this logic would work without firebase in the middle, too.
    if leap_event.type is 'pinch-start'
      {
        user: 'string'
        stem: leap_event.value.finger
        event:  { type: 'volume', level: 0}
        source: 'leap'
      }
    else if leap_event.type is 'pinch-stop'
      # TODO: Stop current sends value = 0
      {
        user: 'string'
        stem: leap_event.value.finger
        event:  { type: 'volume', level: 1}
        source: 'leap'
      }
    else if leap_event.type is 'space'
      # TODO: this spams like whoa
      {
        user: 'string'
        stem: 1
        event: { type: 'volume', level: leap_event.value.x }
        source: 'leap'
      }
    else
      null

  sendToFirebase: (event) ->
    # after translating, this actually sends event to firebase!
    event.createdAt ?= Date() # Firebase.ServerValue.TIMESTAMP # TODO: Add it here if you want
    console.log "Sending event #{JSON.stringify event} to firebase #{@firebase_room_uri}"
    @firebase.push event

# hack to let me use Node style exports in tests, but require-js in app
module = module or {}
module.exports = {LeapToFirebase}
