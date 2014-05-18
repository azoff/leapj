output = document.getElementById("output")
progress = document.getElementById("progress")

# TODO: Expects the LeapToFirebase exists -- should require it explicitly
throw "No LeapToFirebase" unless LeapToFirebase?
leapToFirebase = new LeapToFirebase config.firebase_room_uri

class LeapEventListener
  # Initiali
  constructor: ->
    console.log "Setting up..."

  listen: ->
    console.log "Listening for event"

  sendEvent: (event_name, value) ->
    console.log "Event: #{event_name}, Value: #{value}"
    console.error "sendEvent: not yet really sending event..."

class PinchListener extends LeapEventListener

  constructor: ->
    @PINCH_STRENGTH_ON = .8
    @PINCH_STRENGTH_OFF = .4
    console.log "Init pinch listener... Pinch On=#{@PINCH_STRENGTH_ON}, Off=#{@PINCH_STRENGTH_OFF}"
    @pinched = false
    @pinched_finger = null


  findPinchingFingerType: (hand) ->
    console.log "findPinchingFingerType"
    closest = 500 # normal distances are ~30 (pinched) to 200 (unpinched)
    for f in [0..4] # TODO: don't check the thumb
      current = hand.fingers[f]
      distance = Leap.vec3.distance(hand.thumb.tipPosition, current.tipPosition)
      if(current != hand.thumb && distance < closest)
        closest = distance
        pincher = current
        fingerIndex = f
    return {pincher, fingerIndex}

  updateUi: (pinchStrength) ->
    # Display pinch strength
    # These are global vars declared in index.html
    if output and progress
      output.innerHTML = pinchStrength
      progress.style.width = pinchStrength * 100 + "%"
    else
      console.error "UI hooks aren't configured. output (#{output}), progress (#{progress})"

  sendEvent: (type, value) ->
    console.log "Leap Event received. Translating and sending FirebaseEvent"
    firebaseEvent = leapToFirebase.translate {type, value}
    leapToFirebase.sendToFirebase firebaseEvent if firebaseEvent?

  listen: (hand) ->
    # Get pinch strength
    pinchStrength = hand.pinchStrength.toPrecision(2)
    @updateUi pinchStrength

    if not @pinched and pinchStrength > @PINCH_STRENGTH_ON
      # Find and save pinching finger
      {fingerIndex} = @findPinchingFingerType hand
      @pinched = true
      @pinched_finger = fingerIndex

      # Fire event
      @sendEvent 'pinch-start', @pinched_finger
    else if @pinched and pinchStrength < @PINCH_STRENGTH_OFF
      # Fire Event
      @sendEvent 'pinch-stop', @pinched_finger

      # Save 'unpinched' state
      @pinched = false
      @pinched_finger = null

pinchHandler = new PinchListener

Leap.loop
  background: true
,
  hand: (hand) ->
    pinchHandler.listen hand
    return
