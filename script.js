/* ===================================
   APK Website Script
   Dark Mode
   Share
   Copy Link
   Search
   Download Counter
   Toast
=================================== */

const body = document.body;

const themeBtn = document.getElementById("themeBtn");
const copyBtn = document.getElementById("copyBtn");
const shareBtn = document.getElementById("shareBtn");
const searchInput = document.getElementById("searchInput");
const downloadBtn = document.querySelector(".download-btn");

/* ==========================
   Toast
========================== */

function showToast(message){

    let toast = document.createElement("div");

    toast.className = "toast";

    toast.innerText = message;

    document.body.appendChild(toast);

    setTimeout(()=>{
        toast.classList.add("show");
    },100);

    setTimeout(()=>{
        toast.classList.remove("show");

        setTimeout(()=>{
            toast.remove();
        },300);

    },2500);

}

/* ==========================
   Dark Mode
========================== */

const savedTheme = localStorage.getItem("theme");

if(savedTheme === "dark"){
    body.classList.add("dark");
    themeBtn.innerHTML =
    '<i class="fa-solid fa-sun"></i>';
}

themeBtn.addEventListener("click",()=>{

    body.classList.toggle("dark");

    if(body.classList.contains("dark")){

        localStorage.setItem("theme","dark");

        themeBtn.innerHTML =
        '<i class="fa-solid fa-sun"></i>';

    }else{

        localStorage.setItem("theme","light");

        themeBtn.innerHTML =
        '<i class="fa-solid fa-moon"></i>';

    }

});

/* ==========================
   Copy Link
========================== */

copyBtn.addEventListener("click",()=>{

navigator.clipboard.writeText(window.location.href);

showToast("Website link copied.");

});

/* ==========================
   Share
========================== */

shareBtn.addEventListener("click",async()=>{

if(navigator.share){

try{

await navigator.share({

title:document.title,

text:"Download APK",

url:window.location.href

});

}catch(e){}

}else{

showToast("Share not supported.");

}

});

/* ==========================
   Search
========================== */

searchInput.addEventListener("keyup",()=>{

let value = searchInput.value.toLowerCase();

document.querySelectorAll("section").forEach(sec=>{

let text = sec.innerText.toLowerCase();

if(text.includes(value)){

sec.style.display="block";

}else{

if(sec.classList.contains("search-section")) return;

if(sec.classList.contains("banner")) return;

sec.style.display="none";

}

});

});

/* ==========================
   Download Counter
========================== */

let count = Number(localStorage.getItem("downloads")) || 0;

downloadBtn.addEventListener("click",()=>{

count++;

localStorage.setItem("downloads",count);

showToast("Download Started");

console.log("Downloads :",count);

});

/* ==========================
   Lazy Image
========================== */

document.querySelectorAll("img").forEach(img=>{

img.loading="lazy";

});

/* ==========================
   Scroll Animation
========================== */

const observer = new IntersectionObserver((entries)=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.classList.add("visible");

}

});

},{
threshold:.15
});

document.querySelectorAll("section").forEach(sec=>{

observer.observe(sec);

});

/* ==========================
   Back To Top Button
========================== */

const topBtn=document.createElement("button");

topBtn.innerHTML='<i class="fa-solid fa-arrow-up"></i>';

topBtn.id="topButton";

document.body.appendChild(topBtn);

window.addEventListener("scroll",()=>{

if(window.scrollY>300){

topBtn.style.display="flex";

}else{

topBtn.style.display="none";

}

});

topBtn.addEventListener("click",()=>{

window.scrollTo({

top:0,

behavior:"smooth"

});

});

/* ==========================
   Keyboard Shortcut
========================== */

document.addEventListener("keydown",(e)=>{

if(e.ctrlKey && e.key==="d"){

e.preventDefault();

downloadBtn.click();

}

});

/* ==========================
   Console Message
========================== */

console.log("%cAPK Website Ready",
"color:#4f46e5;font-size:20px;font-weight:bold;");

/* ===========================
   IMAGE VIEWER
=========================== */

const viewer=document.createElement("div");
viewer.className="image-viewer";

viewer.innerHTML=`
<button class="close-viewer">
<i class="fa-solid fa-xmark"></i>
</button>
<img src="">
`;

document.body.appendChild(viewer);

const viewerImg=viewer.querySelector("img");

document.querySelectorAll(".slider img").forEach(img=>{

img.addEventListener("click",()=>{

viewer.classList.add("active");

viewerImg.src=img.src;

});

});

viewer.querySelector("button").onclick=()=>{

viewer.classList.remove("active");

};

/* Progress Animation */

const progressFill=document.getElementById("progressFill");
const progressText=document.getElementById("progressText");
const downloadCount=document.getElementById("downloadCount");

downloadCount.innerText=localStorage.getItem("downloads")||0;

downloadBtn.addEventListener("click",()=>{

let p=0;

let timer=setInterval(()=>{

p++;

progressFill.style.width=p+"%";

progressText.innerHTML=p+"%";

if(p>=100){

clearInterval(timer);

let d=Number(localStorage.getItem("downloads"))||0;

d++;

localStorage.setItem("downloads",d);

downloadCount.innerHTML=d;

}

},20);

});

/* Rating */

const stars=document.querySelectorAll(".star");
const ratingText=document.getElementById("ratingText");

stars.forEach((star,index)=>{

star.onclick=()=>{

stars.forEach(s=>{
s.classList.remove("active");
s.classList.replace("fa-solid","fa-regular");
});

for(let i=0;i<=index;i++){

stars[i].classList.add("active");
stars[i].classList.replace("fa-regular","fa-solid");

}

ratingText.innerHTML="You rated "+(index+1)+" / 5 ⭐";

localStorage.setItem("rating",index+1);

};

});

const savedRating=localStorage.getItem("rating");

if(savedRating){

for(let i=0;i<savedRating;i++){

stars[i].classList.add("active");
stars[i].classList.replace("fa-regular","fa-solid");

}

ratingText.innerHTML="Your Rating : "+savedRating+" / 5 ⭐";

}

/* ===========================
   AUTO SLIDER
=========================== */

const slider=document.querySelector(".slider");

setInterval(()=>{

slider.scrollBy({
left:240,
behavior:"smooth"
});

if(slider.scrollLeft+slider.clientWidth>=slider.scrollWidth-5){

slider.scrollTo({
left:0,
behavior:"smooth"
});

}

},3000);
