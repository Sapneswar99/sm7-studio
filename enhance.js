const WORKER_URL =
    "https://sm7-photo-enhance.sapneswarmajhi1234.workers.dev/";

const fileInput = document.getElementById("fileInput");
const uploadBox = document.getElementById("uploadBox");
const previewSection = document.getElementById("previewSection");
const previewImage = document.getElementById("previewImage");
const fileName = document.getElementById("fileName");

const enhanceBtn = document.getElementById("enhanceBtn");
const resetBtn = document.getElementById("resetBtn");
const downloadBtn = document.getElementById("downloadBtn");
const loading = document.getElementById("loading");

let selectedFile = null;
let enhancedImageUrl = null;


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

    selectedFile = file;
    enhancedImageUrl = null;

    const imageURL = URL.createObjectURL(file);

    previewImage.src = imageURL;
    previewImage.style.filter = "none";

    fileName.textContent = file.name;

    previewSection.style.display = "block";

    downloadBtn.style.display = "none";

    enhanceBtn.disabled = false;
    enhanceBtn.textContent = "✨ Enhance Photo";

    previewSection.scrollIntoView({
        behavior: "smooth"
    });
}


// ================================
// Drag & Drop
// ================================

uploadBox.addEventListener("dragover", function (e) {

    e.preventDefault();

    uploadBox.classList.add("dragging");
});


uploadBox.addEventListener("dragleave", function () {

    uploadBox.classList.remove("dragging");
});


uploadBox.addEventListener("drop", function (e) {

    e.preventDefault();

    uploadBox.classList.remove("dragging");

    const file = e.dataTransfer.files[0];

    if (file) {

        handleImage(file);
    }
});


// ================================
// AI Enhance Photo
// ================================

enhanceBtn.addEventListener("click", async function () {

    if (!selectedFile) {

        alert("Please upload a photo first.");

        return;
    }

    loading.style.display = "block";

    enhanceBtn.disabled = true;

    enhanceBtn.textContent = "✨ Enhancing...";

    downloadBtn.style.display = "none";


    try {

        const formData = new FormData();

        formData.append("image", selectedFile);


        const response = await fetch(
            WORKER_URL,
            {
                method: "POST",
                body: formData
            }
        );


        let result;

        try {

            result = await response.json();

        } catch (jsonError) {

            throw new Error(
                "Server returned an invalid response."
            );
        }


        if (!response.ok || !result.success) {

            throw new Error(
                result.message ||
                "AI enhancement failed."
            );
        }


        // Get AI output
        let output = result.output;


        if (Array.isArray(output)) {

            output = output[0];
        }


        if (!output) {

            throw new Error(
                "AI did not return an output image."
            );
        }


        enhancedImageUrl = output;


        // Show enhanced image
        previewImage.style.filter = "none";

        previewImage.src = enhancedImageUrl;


        // Show download button
        downloadBtn.style.display = "inline-block";


        alert("✨ AI Enhancement Complete!");


    } catch (error) {

        console.error("Enhancement Error:", error);


        alert(
            "❌ Enhancement failed.\n\n" +
            (error.message ||
                "Please try again.")
        );


    } finally {

        loading.style.display = "none";

        enhanceBtn.disabled = false;

        enhanceBtn.textContent = "✨ Enhance Photo";
    }
});


// ================================
// Download Enhanced Photo
// ================================

downloadBtn.addEventListener("click", async function () {

    if (!enhancedImageUrl) {

        alert(
            "Please enhance the photo first."
        );

        return;
    }


    try {

        const response = await fetch(
            enhancedImageUrl
        );


        if (!response.ok) {

            throw new Error(
                "Could not download image."
            );
        }


        const blob = await response.blob();

        const blobUrl =
            URL.createObjectURL(blob);


        const link =
            document.createElement("a");

        link.href = blobUrl;

        link.download =
            "enhanced-photo.png";


        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);


        URL.revokeObjectURL(blobUrl);


    } catch (error) {

        console.error(
            "Download Error:",
            error
        );


        // Fallback: open AI image
        window.open(
            enhancedImageUrl,
            "_blank"
        );
    }
});


// ================================
// Choose Another Photo
// ================================

resetBtn.addEventListener("click", function () {

    selectedFile = null;

    enhancedImageUrl = null;

    fileInput.value = "";

    previewImage.src = "";

    previewImage.style.filter = "none";

    fileName.textContent = "";

    previewSection.style.display = "none";

    downloadBtn.style.display = "none";

    loading.style.display = "none";

    enhanceBtn.disabled = false;

    enhanceBtn.textContent = "✨ Enhance Photo";
});


// ================================
// Initial State
// ================================

previewSection.style.display = "none";

loading.style.display = "none";

downloadBtn.style.display = "none";
