output = document.getElementById("output")
progress = document.getElementById("progress")

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
    console.log "Init pinch listener..."
    @pinched = false

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

  listen: (hand) ->
    # Get pinch strength
    pinchStrength = hand.pinchStrength.toPrecision(2)
    @updateUi pinchStrength
    if not @pinched and pinchStrength > .6
      @pinched = true
      {pincher, fingerIndex} = @findPinchingFingerType hand
      @sendEvent 'pinch-start', fingerIndex
      console.log "pinched! Finger = #{fingerIndex}"
    else if @pinched and pinchStrength < .4
      @pinched = false
      @sendEvent 'pinch-end', null
      console.log "un-pinched!"
    return

# TODO: new handler
initHandRotationHandler = ->
  return
  # base stats

initHandAltitudeHandler = ->
  height = .5 # height ranges from 0 to

pinchHandler = new PinchListener

Leap.loop
  background: true
,
  hand: (hand) ->
    pinchHandler.listen hand
    return
