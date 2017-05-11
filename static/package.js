var socket = io.connect('http://localhost:5000');


packagesFromServer = [];
socket.on('package-arrived', function(size) {
    packagesFromServer.push(size);
});
