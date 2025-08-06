const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const emotionText = document.getElementById('emotion-text');
const emotionActions = document.getElementById('emotion-actions');
const happyBtn = document.getElementById('happy-btn');
const sadBtn = document.getElementById('sad-btn');
const neutralBtn = document.getElementById('neutral-btn');
const surprisedBtn = document.getElementById('surprised-btn');

// 加载面部识别和情感识别模型
async function loadModels() {
    await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
    await faceapi.nets.faceExpressionNet.loadFromUri('/models');
}

// 启动视频流
async function startVideo() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
    video.srcObject = stream;
}

// 捕获视频流中的人脸表情并识别
video.addEventListener('play', async () => {
    while (true) {
        const detections = await faceapi.detectAllFaces(video).withFaceExpressions();
        context.clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, detections);
        faceapi.draw.drawFaceExpressions(canvas, detections);

        if (detections.length > 0) {
            const expressions = detections[0].expressions;
            const dominantEmotion = getDominantEmotion(expressions);
            emotionText.textContent = `检测到情感: ${dominantEmotion}`;
            handleEmotionAction(dominantEmotion);
        }

        await new Promise(resolve => setTimeout(resolve, 100));
    }
});

// 获取最显著的情感
function getDominantEmotion(expressions) {
    return Object.keys(expressions).reduce((a, b) => expressions[a] > expressions[b] ? a : b);
}

// 根据情感进行操作
function handleEmotionAction(emotion) {
    switch (emotion) {
        case 'happy':
            showButton(happyBtn);
            break;
        case 'sad':
            showButton(sadBtn);
            break;
        case 'neutral':
            showButton(neutralBtn);
            break;
        case 'surprised':
            showButton(surprisedBtn);
            break;
        default:
            hideAllButtons();
            break;
    }
}

// 显示相应按钮
function showButton(button) {
    hideAllButtons();
    button.style.display = 'block';
}

// 隐藏所有按钮
function hideAllButtons() {
    happyBtn.style.display = 'none';
    sadBtn.style.display = 'none';
    neutralBtn.style.display = 'none';
    surprisedBtn.style.display = 'none';
}

// 初始化
loadModels().then(startVideo);
