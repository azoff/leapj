var SerialPort = require("serialport").SerialPort
var serialPort = new SerialPort("/dev/buspirate", {
  baudrate: 115200
}, false); // this is the openImmediately flag [default is true]

serialPort.open(function () {
  console.log('open');
  serialPort.on('data', function(data) {
    //console.log('data received: ' + data);
  });

    Led = new LedController();
    ledInit();
    //ledSet(1);
});

function ledInit() {
    Led.exec('\n');
    Led.exec('m3\n');
    Led.exec('9\n');
    Led.exec('\n');
    Led.exec('\n');
    Led.exec('\n');
    Led.exec('2\n');
    Led.exec('(1)\n');
    Led.exec('y\n');
    Led.exec('\r\n');
}

function LedController(timeout) {
  this.timeout = timeout || 6;
  this.queue = [];
  this.ready = true;
}

LedController.prototype.send = function(cmd, callback) {
  sendCmdToLed(cmd);
  if (callback) callback();
  // or simply `sendCmdToLed(cmd, callback)` if sendCmdToLed is async
};

function sendCmdToLed(cmd) {
    serialPort.write(cmd, function(err, results) {
        //console.log('err ' + err);
        //console.log('results ' + results);
    });
}

LedController.prototype.exec = function() {
  this.queue.push(arguments);
  this.process();
};

LedController.prototype.process = function() {
  if (this.queue.length === 0) return;
  if (!this.ready) return;
  var self = this;
  this.ready = false;
  this.send.apply(this, this.queue.shift());
  setTimeout(function () {
    self.ready = true;
    self.process();
  }, this.timeout);
};

var Firebase = require('firebase');
var dataRef = new Firebase('https://pr5c1gjakw6.firebaseio-demo.com/rooms/github');
dataRef.on('child_added', function(snapshot) {
    if (snapshot.val().type == 'space') {
        x = snapshot.val().x;
        y = snapshot.val().y;
        z = snapshot.val().z;
        if (z > 0.9) {
            Led.exec('led off\r\n');
        } else {
            if (x < 0.33) {
                Led.exec('led r\r\n');
            } else if (x < 0.66) {
                Led.exec('led g\r\n');
            } else {
                Led.exec('led b\r\n');
            }
        }
        console.log(snapshot.val());
    }
});
