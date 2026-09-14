const WORKER_URL =
    "https://sm7-photo-enhance.sapneswarmajhi1234.workers.dev/";


// ================================
// Elements
// ================================

const fileInput = document.getElementById("fileInput");
const uploadBox = document.getElementById("uploadBox");

const uploadProcessing =
    document.getElementById("uploadProcessing");

const uploadPercent =
    document.getElementById("uploadPercent");

const uploadProgress =
    document.getElementById("uploadProgress");

const uploadStatus =
    document.getElementById("uploadStatus");

const originalSection =
    document.getElementById("originalSection");

const previewImage =
    document.getElementById("previewImage");

const fileName =
    document.getElementById("fileName");

const enhanceBtn =
    document.getElementById("enhanceBtn");

const aiProcessing =
    document.getElementById("aiProcessing");

const enhanceStatus =
    document.getElementById("enhanceStatus");

const enhancePercent =
    document.getElementById("enhancePercent");

const enhanceProgress =
    document.getElementById("enhanceProgress");

const stepUpload =
    document.getElementById("stepUpload");

const stepAI =
    document.getElementById("stepAI");

const stepComplete =
    document.getElementById("stepComplete");

const enhancedSection =
    document.getElementById("enhancedSection");

const enhancedImage =
    document.getElementById("enhancedImage");

const downloadBtn =
    document.getElementById("downloadBtn");

const resetBtn =
    document.getElementById("resetBtn");


// ================================
// Variables
// ================================

let selectedFile = null;
let enhancedImageUrl = null;
let originalImageUrl = null;

let progressTimer = null;


// ================================
// Initial State
// ================================

uploadProcessing.style.display = "none";
originalSection.style.display = "none";
aiProcessing.style.display = "none";
enhancedSection.style.display = "none";


// ================================
// Select Image
// ================================

fileInput.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) return;

    handleImage(file);
});


// ================================
// Handle Image
// ================================

function handleImage(file) {

    if (!file.type.startsWith("image/")) {

        alert("Please select a valid image.");

        return;
    }


    // Reset previous state
    selectedFile = file;
    enhancedImageUrl = null;


    if (originalImageUrl) {

        URL.revokeObjectURL(originalImageUrl);

    }


    originalImageUrl =
        URL.createObjectURL(file);


    previewImage.src = originalImageUrl;

    fileName.textContent = file.name;


    // Hide previous result
    enhancedSection.style.display = "none";

    aiProcessing.style.display = "none";


    // Reset progress
    uploadPercent.textContent = "0%";

    uploadProgress.style.width = "0%";

    uploadStatus.textContent =
        "Preparing your photo...";


    // Show upload processing
    uploadProcessing.style.display = "block";


    // Start upload/preparation animation
    startUploadProgress();
}


// ================================
// Upload Progress UI
// ================================

function startUploadProgress() {

    clearInterval(progressTimer);

    let progress = 0;


    progressTimer = setInterval(function () {

        progress += Math.random() * 12;


        if (progress >= 100) {

            progress = 100;

            clearInterval(progressTimer);

            uploadPercent.textContent = "100%";

            uploadProgress.style.width = "100%";

            uploadStatus.textContent =
                "Photo ready!";

            setTimeout(function () {

                uploadProcessing.style.display =
                    "none";

                originalSection.style.display =
                    "block";

                originalSection.scrollIntoView({
                    behavior: "smooth"
                });

            }, 500);

            return;
        }


        progress =
            Math.floor(progress);


        uploadPercent.textContent =
            progress + "%";

        uploadProgress.style.width =
            progress + "%";


        if (progress < 35) {

            uploadStatus.textContent =
                "Preparing your photo...";

        } else if (progress < 70) {

            uploadStatus.textContent =
                "Loading photo...";

        } else {

            uploadStatus.textContent =
                "Photo almost ready...";

        }

    }, 180);
}


// ================================
// Drag & Drop
// ================================

uploadBox.addEventListener(
    "dragover",
    function (e) {

        e.preventDefault();

        uploadBox.classList.add("dragging");

    }
);


uploadBox.addEventListener(
    "dragleave",
    function () {

        uploadBox.classList.remove("dragging");

    }
);


uploadBox.addEventListener(
    "drop",
    function (e) {

        e.preventDefault();

        uploadBox.classList.remove("dragging");


        const file =
            e.dataTransfer.files[0];


        if (file) {

            handleImage(file);

        }

    }
);


// ================================
// Enhance Photo
// ================================

enhanceBtn.addEventListener(
    "click",
    async function () {

        if (!selectedFile) {

            alert(
                "Please select a photo first."
            );

            return;
        }


        // Disable button
        enhanceBtn.disabled = true;


        // Hide old result
        enhancedSection.style.display =
            "none";


        // Show AI processing
        aiProcessing.style.display =
            "block";


        aiProcessing.scrollIntoView({
            behavior: "smooth"
        });


        // Reset steps
        stepUpload.classList.add("active");

        stepAI.classList.remove("active");

        stepComplete.classList.remove("active");


        // Reset progress
        setEnhanceProgress(
            0,
            "Starting AI enhancement..."
        );


        // Start estimated progress
        startAIProgress();


        try {

            const formData =
                new FormData();


            formData.append(
                "image",
                selectedFile
            );


            // Send image to Cloudflare Worker
            const response =
                await fetch(
                    WORKER_URL,
                    {
                        method: "POST",
                        body: formData
                    }
                );


            let result;


            try {

                result =
                    await response.json();

            } catch (jsonError) {

                throw new Error(
                    "Server returned an invalid response."
                );

            }


            if (
                !response.ok ||
                !result.success
            ) {

                throw new Error(
                    result.message ||
                    "AI enhancement failed."
                );

            }


            // Stop progress animation
            stopAIProgress();


            // Get AI output
            let output =
                result.output;


            if (Array.isArray(output)) {

                output =
                    output[0];

            }


            if (!output) {

                throw new Error(
                    "AI did not return an output image."
                );

            }


            enhancedImageUrl =
                output;


            // Complete progress
            setEnhanceProgress(
                100,
                "Enhancement complete!"
            );


            // Update steps
            stepUpload.classList.add(
                "active"
            );

            stepAI.classList.add(
                "active"
            );

            stepComplete.classList.add(
                "active"
            );


            // Show enhanced image
            enhancedImage.src =
                enhancedImageUrl;


            // Show result section
            setTimeout(function () {

                aiProcessing.style.display =
                    "none";

                enhancedSection.style.display =
                    "block";

                enhancedSection.scrollIntoView({
                    behavior: "smooth"
                });

            }, 600);


        } catch (error) {

            stopAIProgress();


            console.error(
                "Enhancement Error:",
                error
            );


            aiProcessing.style.display =
                "none";


            enhanceBtn.disabled = false;


            alert(
                "❌ Enhancement failed.\n\n" +
                (
                    error.message ||
                    "Please try again."
                )
            );

        }

    }
);


// ================================
// AI Progress
// ================================

function startAIProgress() {

    stopAIProgress();


    let progress = 5;


    progressTimer =
        setInterval(function () {

            // Keep progress below 90%
            // until AI actually finishes
            if (progress < 85) {

                progress +=
                    Math.random() * 4;

                progress =
                    Math.floor(progress);


                let status =
                    "AI is processing your photo...";


                if (progress < 25) {

                    status =
                        "Uploading image to AI...";

                } else if (progress < 55) {

                    status =
                        "AI is analyzing your photo...";

                } else if (progress < 75) {

                    status =
                        "Enhancing details and sharpness...";

                } else {

                    status =
                        "Almost finished...";

                }


                setEnhanceProgress(
                    progress,
                    status
                );

            }

        }, 800);
}


// ================================
// Stop AI Progress
// ================================

function stopAIProgress() {

    if (progressTimer) {

        clearInterval(progressTimer);

        progressTimer = null;

    }
}


// ================================
// Set Enhance Progress
// ================================

function setEnhanceProgress(
    percent,
    status
) {

    enhancePercent.textContent =
        percent + "%";


    enhanceProgress.style.width =
        percent + "%";


    enhanceStatus.textContent =
        status;
}


// ================================
// Download Enhanced Photo
// ================================

downloadBtn.addEventListener(
    "click",
    async function () {

        if (!enhancedImageUrl) {

            alert(
                "Please enhance the photo first."
            );

            return;
        }


        try {

            downloadBtn.disabled = true;

            downloadBtn.textContent =
                "⬇ Preparing Download...";


            const response =
                await fetch(
                    enhancedImageUrl
                );


            if (!response.ok) {

                throw new Error(
                    "Could not download image."
                );

            }


            const blob =
                await response.blob();


            const blobUrl =
                URL.createObjectURL(blob);


            const link =
                document.createElement("a");


            link.href =
                blobUrl;


            link.download =
                "enhanced-photo.png";


            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);


            setTimeout(function () {

                URL.revokeObjectURL(
                    blobUrl
                );

            }, 1000);


        } catch (error) {

            console.error(
                "Download Error:",
                error
            );


            // Fallback
            window.open(
                enhancedImageUrl,
                "_blank"
            );


        } finally {

            downloadBtn.disabled = false;

            downloadBtn.textContent =
                "⬇ Download Enhanced Photo";

        }

    }
);


// ================================
// Reset / Enhance Another Photo
// ================================

resetBtn.addEventListener(
    "click",
    function () {

        stopAIProgress();


        selectedFile = null;

        enhancedImageUrl = null;


        if (originalImageUrl) {

            URL.revokeObjectURL(
                originalImageUrl
            );

            originalImageUrl = null;

        }


        fileInput.value = "";


        previewImage.src = "";

        enhancedImage.src = "";

        fileName.textContent = "";


        // Hide sections
        uploadProcessing.style.display =
            "none";

        originalSection.style.display =
            "none";

        aiProcessing.style.display =
            "none";

        enhancedSection.style.display =
            "none";


        // Reset upload progress
        uploadPercent.textContent =
            "0%";

        uploadProgress.style.width =
            "0%";


        // Reset AI progress
        setEnhanceProgress(
            0,
            "Preparing AI enhancement..."
        );


        // Reset steps
        stepUpload.classList.add(
            "active"
        );

        stepAI.classList.remove(
            "active"
        );

        stepComplete.classList.remove(
            "active"
        );


        enhanceBtn.disabled = false;


        // Back to upload area
        uploadBox.scrollIntoView({
            behavior: "smooth"
        });

    }
);
