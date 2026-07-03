// ==============================
// Landing Page
// ==============================

function robotSpeak(text) {
    speechSynthesis.cancel();

    const msg = new SpeechSynthesisUtterance(text);

    msg.lang = "en-US";
    msg.rate = 0.8;
    msg.pitch = 0.4;
    msg.volume = 1;

    speechSynthesis.speak(msg);
}

const startBtn = document.getElementById("startBtn");
const startSound = document.getElementById("startSound");

if (startBtn) {

    startBtn.addEventListener("click", (e) => {

        e.preventDefault();
            robotSound.volume = 1.0;
        robotSound.play();

        robotSpeak("Welcome to Pose Net");

        setTimeout(() => {
            window.location.href = "posenet.html";
        }, 1500);

    });

}

// ==============================
// PoseNet
// ==============================

let capture;
let posenet;
let singlePose;
let skeleton;

let personDetected = false;
let lastState = "";

function setup() {

    createCanvas(800, 500);

    capture = createCapture(VIDEO);
    capture.size(800, 500);
    capture.hide();

    posenet = ml5.poseNet(capture, modelLoaded);

    posenet.on("pose", receivedPoses);
}

function modelLoaded() {

    console.log("Model Loaded");

    robotSpeak("Pose Net Initialized");

}

function receivedPoses(poses) {

    if (poses.length > 0) {

        singlePose = poses[0].pose;
        skeleton = poses[0].skeleton;

        if (!personDetected) {

            robotSpeak("Human Detected");

            personDetected = true;

        }

    } else {

        personDetected = false;

    }

}

function detectHands() {

    if (!singlePose) return;

    let left = singlePose.leftWrist;
    let right = singlePose.rightWrist;

    if (left.confidence > 0.5 && left.y < 200) {

        if (lastState !== "left") {

            robotSpeak("Left Hand Raised");

            lastState = "left";

        }

    }

    else if (right.confidence > 0.5 && right.y < 200) {

        if (lastState !== "right") {

            robotSpeak("Right Hand Raised");

            lastState = "right";

        }

    }

    else {

        lastState = "";

    }

}

function draw() {

    background(220);

    image(capture, 0, 0, width, height);

    if (singlePose) {

        noFill();
        stroke(0, 255, 153);
        strokeWeight(3);

        // Draw keypoints
        for (let i = 0; i < singlePose.keypoints.length; i++) {

            let keypoint = singlePose.keypoints[i];

            if (keypoint.score > 0.7) {

                if (i <= 4) {

                    ellipse(
                        keypoint.position.x,
                        keypoint.position.y,
                        10,
                        10
                    );

                }

                else {

                    ellipse(
                        keypoint.position.x,
                        keypoint.position.y,
                        30,
                        30
                    );

                }

            }

        }

        // Draw skeleton
        stroke(0, 255, 153);
        strokeWeight(5);

        for (let i = 0; i < skeleton.length; i++) {

            let pointA = skeleton[i][0];
            let pointB = skeleton[i][1];

            line(
                pointA.position.x,
                pointA.position.y,
                pointB.position.x,
                pointB.position.y
            );

        }

        // Detect hand movement
        detectHands();

    }

}