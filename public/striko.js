// striko.js

(function() {
    var socket = io.connect(window.location.hostname + ':' + 3000);

    socket.on('connect', function(data) {
        socket.emit('join', 'Client is connected!');
    });

    var position = document.getElementById('position');
    var angle = document.getElementById('angle');

    document.getElementById("strike").onclick = function(){

        var data = JSON.stringify({
            position: position.value,
            angle: angle.value
        });

        socket.emit('strike', data);
    }

}());