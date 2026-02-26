from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/api/health")
def health():
    return jsonify({"status": "ok", "service": "backend", "runtime": "python"})


@app.route("/api/stats")
def stats():
    return jsonify({
        "requests": 12847,
        "uptime": "99.9%",
        "latency_ms": 45,
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8001)
