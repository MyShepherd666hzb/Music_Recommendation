// const video = document.getElementById('video');
//
// // 1. 加载 face-api.js 模型
// Promise.all([
//     faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
//     faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
//     faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
//     faceapi.nets.faceExpressionNet.loadFromUri('/models')
// ]).then(startVideo).catch(err => {
//     console.error('Error loading models:', err);
// });
//
// // 2. 启动摄像头视频流
// function startVideo() {
//     navigator.mediaDevices.getUserMedia({
//         video: {}
//     }).then(stream => {
//         video.srcObject = stream;
//     }).catch(err => {
//         console.error('Error accessing the camera: ', err);
//     });
// }
//
// // 3. 处理视频流并进行人脸检测与表情识别
// video.addEventListener('play', () => {
//     const canvas = faceapi.createCanvasFromMedia(video);
//     document.body.append(canvas);
//
//     const displaySize = { width: video.videoWidth, height: video.videoHeight };
//     faceapi.matchDimensions(canvas, displaySize);
//
//     // 4. 每隔100ms进行一次检测
//     setInterval(async () => {
//         const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
//             .withFaceLandmarks()
//             .withFaceExpressions();
//
//         const resizedDetections = faceapi.resizeResults(detections, displaySize);
//         canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height); // 清空之前的画布
//
//         // 5. 在画布上绘制检测结果
//         faceapi.draw.drawDetections(canvas, resizedDetections);
//         faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
//         faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
//     }, 100);
// });



// 等待加载完面部识别模型
window.onload = async () => {
    // 加载模型
    await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
    await faceapi.nets.faceExpressionNet.loadFromUri('/models');

    // 获取视频元素
    const video = document.getElementById('video');

    // 打开摄像头
    navigator.mediaDevices.getUserMedia({ video: {} })
        .then((stream) => {
            video.srcObject = stream;
        })
        .catch(err => console.error('Error accessing webcam:', err));

    // 处理视频流
    video.addEventListener('play', () => {
        // 创建 canvas，用来绘制人脸和表情
        const canvas = faceapi.createCanvasFromMedia(video);
        document.body.append(canvas);

        // 设置 canvas 尺寸与视频相同
        const displaySize = { width: video.width, height: video.height };
        faceapi.matchDimensions(canvas, displaySize);

        // 每隔100ms进行一次人脸识别
        setInterval(async () => {
            const detections = await faceapi.detectAllFaces(video)
                .withFaceLandmarks()
                .withFaceExpressions();

            // 在canvas上绘制检测到的人脸和表情
            canvas?.clear();
            const resizedDetections = faceapi.resizeResults(detections, displaySize);
            faceapi.draw.drawDetections(canvas, resizedDetections);
            faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
            faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
        }, 100);
    });
};
