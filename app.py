import os
from subprocess import Popen, PIPE
from functools import partial

from flask import Flask, render_template, Response
from flask_socketio import SocketIO, emit


app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)


@app.route('/')
def index():
    """Video streaming home page."""
    return render_template('index.html')


def stream():
    # process = Popen(['ffmpeg', '-i', 'big.mp4', '-q', '23', '-'],
    #                 stdout=PIPE, bufsize=-1)
    process = Popen(['cat', 'static/big.mp4'], stdout=PIPE, bufsize=-1)
    read_chunk = partial(os.read, process.stdout.fileno(), 1024)
    for c in iter(read_chunk, b''):
        socketio.emit('package-arrived', len(c))
        yield c


@app.route('/video_feed')
def video_feed():
    return Response(stream(), mimetype='multipart/x-mixed-replace')


if __name__ == '__main__':
    app.run(debug=True, threaded=True)
