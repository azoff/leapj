class LeapToFirebase
  constructor: (@firebase_instance) ->
    console.log "Construct LeapToFirebase. Connecting to #{firebase_instance}"

  translate: (leap_event) ->

    if leap_event.type is 'pinch-start'
      {
        user: 'string'
        stem: leap_event.value
        event:  { type: 'volume', level: 0}
        source: 'leap'
      }
    else if leap_event.type is 'pinch-stop'
      # TODO: Stop current sends value = 0
      {
        user: 'string'
        stem: leap_event.value
        event:  { type: 'volume', level: 1}
        source: 'leap'
      }
    else
      null

  sendToFirebase: (event) ->
    # after translating, this actually sends event to firebase!
    console.log "Sending event #{JSON.stringify event} to firebase #{@firebase_instance}"
    console.error "Not actually sending to firebase YET"


# hack to let me use Node style exports in tests, but require-js in app
module = module or {}
module.exports = {LeapToFirebase}
