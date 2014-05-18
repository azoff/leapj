leapJ
=====

"DJ with your body"

A good place to find songs with stems:

* [/r/SongStems](http://www.reddit.com/r/SongStems/search?q=-request&sort=top&restrict_sr=on&t=all)
* [multitrackdownloads](http://multitrackdownloads.blogspot.co.uk/)

Build
-----

`compass compile` (or `make build`)

To work on CoffeeScript files in `/src`

```bash
npm install
gulp
```

Then run the server of your choice, e.g.

python -m SimpleHTTPServer

Internet-flaky mode
-------------------

Edit `js/config.js` and change `localPubSub` to something non-NULL.

This must be done on *all* senders and receivers.

Then, run the pubsub (and skip Firebase):

```
node pubsub/server.js
```


Directory structure
-------------------

receiver/
    The music player.
sender/
    Sends leap gestures as music events.
common/
    Files shared by receiver and sender.

TODO
----

* Move fonts/ and scss/ into common/
* Remove non-web assets (e.g. README.md) before deploying
    * This involves creating a folder called "public/" that is pushed to firebase.
