'use strict';

const five = require('johnny-five');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app).listen(3000);
const socket = socketio(server);

app.use(express.static(__dirname + '/public'));

five.Board().on('ready', function() {

    console.log('Arduino is ready.');

    var stepper = new five.Stepper({
        type: five.Stepper.TYPE.DRIVER,
        stepsPerRev: 200,
        pins: {
            step: 2,
            dir: 5,
            enable: 8
        }
    });

    var servo = new five.Servo({
        pin: 11,
        startAt: 0
    });

    var animation = new five.Animation(servo);

    socket.on('connection', function(client) {
        client.on('join', function(handshake) {
            console.log(handshake);
        });

        client.on('strike', function(data) {

            var action = JSON.parse(data);

            console.log("position = " + action.position + " , angle = " + action.angle);

            var steps = action.position * 5;
            var angle = action.angle;

            stepper.cw().step(steps, function() {

                console.log(steps + " steps moved");
                animation.enqueue({
                    duration: 1000,
                    cuePoints: [0, 0.75, 1.0],
                    keyFrames: [{ degrees: 0 }, { degrees: 180 }, { degrees: 0 }],
                    oncomplete: function(){
                        console.log("striking");
                        stepper.ccw().step(steps, function() {
                            console.log("return to start");
                        });
                    }
                });
            });
        });
    });
});