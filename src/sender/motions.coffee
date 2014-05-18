output = document.getElementById("output")
progress = document.getElementById("progress")
activeCommands = document.getElementById("activeCommands")

# TODO: Expects the LeapToFirebase exists -- should require it explicitly
throw "No LeapToFirebase" unless LeapToFirebase?
leapToFirebase = new LeapToFirebase config.firebase_room_uri

class LeapEventListener
  # Initiali
  constructor: ->
    console.log "Setting up..."

  listen: ->
    console.log "Listening for event"

  sendEvent: (type, value) ->
    console.log "Event: #{type}, Value: #{JSON.stringify value}"
    firebaseEvent = leapToFirebase.translate {type, value} # TODO: Skip translation step - just send hand event
    # firebaseEvent = {type, value}
    leapToFirebase.sendToFirebase firebaseEvent if firebaseEvent?

  displayActiveCommand: (text) ->
    activeCommands.innerHTML = "<h1> #{text} </h1>" if activeCommands

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
    console.log "Leap:Pinch event"
    @displayActiveCommand type, value
    super type, value

  displayActiveCommand: (type, value) ->
    super "#{type} - #{value.hand} #{value.finger}"

  listen: (frame) ->
    return unless frame.hands[0] or frame.hands[1]
    for hand in frame.hands
      continue unless hand
      whichHand = hand.type # 'left' or 'right'

      # Get pinch strength
      pinchStrength = hand.pinchStrength.toPrecision(2)
      @updateUi pinchStrength

      if not @pinched and pinchStrength > @PINCH_STRENGTH_ON
        # Find and save pinching finger
        {fingerIndex} = @findPinchingFingerType hand
        @pinched = true
        @pinched_finger = fingerIndex

        # Fire event
        @sendEvent 'pinch-start', {
          finger: @pinched_finger
          hand: whichHand
        }
      else if @pinched and pinchStrength < @PINCH_STRENGTH_OFF
        # Fire Event
        @sendEvent 'pinch-stop', {
          finger: @pinched_finger
          hand: whichHand
        }
        # Save 'unpinched' state
        @pinched = false
        @pinched_finger = null

class SpaceListener extends LeapEventListener
  constructor: ->
    console.log "Init ThumbAndSlideListener"

  sendEvent: (type, value) ->
    # console.log "Leap:KeyTap event #{type}, #{value}"
    super type, value

  listen: (frame) ->
    return unless frame.hands[0] or frame.hands[1]
    for hand in frame.hands
      continue unless hand
      whichHand = hand.type
      @sendEvent 'space', {x: hand.palmPosition[0], y: hand.palmPosition[1], z: hand.palmPosition[2]}

    # initialize the toggle.
    # detect if thumb is close to hand

    # TODO first:
    # detect the height of the hand. scale it dude.

# class GrabStrengthListener extends LeapEventListener

#   listen: hand.grabStrength

class KeyTapListener extends LeapEventListener

  constructor: ->
    console.log "Init KeyTapListener"

  sendEvent: (type, value) ->
    # console.log "Leap:KeyTap event #{type}, #{value}"
    # firebaseEvent = leapToFirebase.translate {type, value}
    # leapToFirebase.sendToFirebase firebaseEvent if firebaseEvent?

  listen: (gesture) ->
    console.log "key tap listen"

# TODO: Swipe Left/Right to change effect?
# TODO: hand.grabStrength
pinchHandler = new PinchListener
keyTapListener = new KeyTapListener
# spaceListener = new SpaceListener

Leap.loop
  enableGestures: true
  background: true
,
  (frame) ->
    pinchHandler.listen frame
    # spaceListener.listen frame
