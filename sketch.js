let capture;
let posenet;
let singlePose;
let skeleton;

function setup() {
    createCanvas(800, 500);

    capture = createCapture(VIDEO);

    // Video size same as canvas
    capture.size(800, 500);

    capture.hide();

    posenet = ml5.poseNet(capture, modelLoaded);

    posenet.on("pose", receivedPoses);
}

function modelLoaded() {
    console.log("Model Loaded");
}

function receivedPoses(poses) {
    if (poses.length > 0) {
        singlePose = poses[0].pose;
        skeleton = poses[0].skeleton;
    }
}

function draw() {

    background(220);

    // Show webcam
    image(capture, 0, 0, width, height);

    if (singlePose) {

        fill(255, 0, 0);
        noStroke();

        // Draw keypoints
        for (let i = 0; i < singlePose.keypoints.length; i++) {

            let keypoint = singlePose.keypoints[i];

            // Draw only if confidence is good
            if (keypoint.score > 0.5) {

                ellipse(
                    keypoint.position.x,
                    keypoint.position.y,
                    15,
                    15
                );
            }
        }

        // Draw skeleton
        stroke(0, 255, 0);
        strokeWeight(3);

        for (let j = 0; j < skeleton.length; j++) {

            let pointA = skeleton[j][0];
            let pointB = skeleton[j][1];

            line(
                pointA.position.x,
                pointA.position.y,
                pointB.position.x,
                pointB.position.y
            );
        }
    }
}