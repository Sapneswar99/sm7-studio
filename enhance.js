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

// Select image
fileInput.addEventListener("change", function () {
    const file = this.files[0];

    if (!file) return;

    handleImage(file);
});

// Handle image
function handleImage(file) {

    if (!file.type.startsWith("image/")) {
        alert("Please select a valid image.");
        return;
    }

    selectedFile = file;

    const imageURL = URL.createObjectURL(file);

    previewImage.src = imageURL;
    fileName.textContent = file.name;

    previewSection.style.display = "block";
    downloadBtn.style.display = "none";

    previewSection.scrollIntoView({
        behavior: "smooth"
    });
}

// Drag & Drop
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

// Enhance photo
enhanceBtn.addEventListener("click", function () {

    if (!selectedFile) {
        alert("Please upload a photo first.");
        return;
    }

    loading.style.display = "block";
    enhanceBtn.disabled = true;

    /*
       Demo enhancement.

       Abhi ye browser mein photo ko enhance
       karne ka basic effect lagata hai.

       Baad mein yahin AI API/backend connect
       karenge.
    */

    setTimeout(function () {

        previewImage.style.filter =
            "contrast(1.12) brightness(1.05) saturate(1.08)";

        loading.style.display = "none";

        enhanceBtn.disabled = false;

        downloadBtn.style.display = "inline-block";

    }, 1500);
});

// Download
downloadBtn.addEventListener("click", function () {

    if (!previewImage.src) return;

    const link = document.createElement("a");

    link.href = previewImage.src;

    link.download = "enhanced-photo.jpg";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
});

// Reset
resetBtn.addEventListener("click", function () {

    selectedFile = null;

    fileInput.value = "";

    previewImage.src = "";

    previewImage.style.filter = "none";

    fileName.textContent = "";

    previewSection.style.display = "none";

    downloadBtn.style.display = "none";
});
