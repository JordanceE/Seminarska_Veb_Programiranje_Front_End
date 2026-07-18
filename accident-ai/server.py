from flask import Flask, request, jsonify, send_from_directory
from extract_scene import extract_scene
import os

app = Flask(__name__, static_folder="../RoadWatch")


@app.route("/")
def home():
    return send_from_directory("../RoadWatch", "index.html")


@app.route("/<path:path>")
def static_files(path):
    return send_from_directory("../RoadWatch", path)


@app.route("/analyze", methods=["POST"])
def analyze():
    if "image" not in request.files:
        return jsonify({
            "error": "No image file uploaded"
        }), 400

    file = request.files["image"]

    if file.filename == "":
        return jsonify({
            "error": "No selected file"
        }), 400

    path = "temp.png"
    file.save(path)

    try:
        scene = extract_scene(path)
        return jsonify(scene.model_dump())
    finally:
        if os.path.exists(path):
            os.remove(path)


if __name__ == "__main__":
    app.run(port=5000)
