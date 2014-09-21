var dgram = require('dgram'),
    client = dgram.createSocket("udp4");

function send(msg) {
    var message = new Buffer(msg.toString());
    client.send(message, 0, message.length, 8042, "192.168.0.105");
}

client.on('message', function (msg) {
    logMessage(msg);
});

function logMessage(msg, sent) {
    var time = new Date(),
        timeString =
            ('0' + time.getHours()).slice(-2) + ':' +
            ('0' + time.getMinutes()).slice(-2) + ':' +
            ('0' + time.getSeconds()).slice(-2) + '.' +
            ('00' + time.getMilliseconds()).slice(-3);

    $log.append(
            '<div class="message ' + (sent ? 'sent': 'received') + '">' +
                '<span class="time">' + timeString + '</span>' +
                '<span class="text">' + escapeHtml(msg.toString()) + '</span>' +
                '</div>'
    );
    $logContainer.scrollTop($log.height());
}

$(window).load(function () {
    window.$log = $('#log');
    window.$logContainer = $('#log-container');
    window.$command = $('#command');

    $command.keyup(function (evt) {
        if (evt.keyCode === 13) {
            var msg = $command.val();
            logMessage(msg, true);
            send(msg);
        }
    });

    //send(counter);


});

var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
};

function escapeHtml(string) {
    return String(string).replace(/[&<>"'\/]/g, function (s) {
        return entityMap[s];
    });
}