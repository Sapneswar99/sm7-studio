const images = document.querySelectorAll(".screenshot-card-img img");
const viewer = document.getElementById("imageViewer");
const fullImage = document.getElementById("fullImage");
const close = document.querySelector(".close");

images.forEach(img => {
  img.onclick = () => {
    viewer.style.display = "flex";
    fullImage.src = img.src;
  };
});

close.onclick = () => {
  viewer.style.display = "none";
};

viewer.onclick = (e) => {
  if(e.target === viewer){
    viewer.style.display = "none";
  }
};let selectedRating=0;

const ADMIN_PASS="7328887871";


function selectStar(n){

selectedRating=n;

document.querySelectorAll(".ps-stars span")
.forEach((s,i)=>{
s.classList.toggle("active",i<n);
});

}



function submitReview(){

let name=username.value;
let text=userReview.value;


if(!name || !text || selectedRating==0){

alert("Fill all fields");
return;

}


let data=JSON.parse(localStorage.getItem("reviews")||"[]");


data.unshift({

name:name,
review:text,
rating:selectedRating,
date:new Date().toLocaleDateString()

});


localStorage.setItem("reviews",JSON.stringify(data));


loadReviews();


username.value="";
userReview.value="";
selectedRating=0;


}



function loadReviews(){

let data=JSON.parse(localStorage.getItem("reviews")||"[]");

let html="";


data.forEach((r,i)=>{


html+=`

<div class="review">

<button class="delete-btn"
onclick="deleteReview(${i})">
Delete
</button>


<div class="review-name">
${r.name}
</div>


<div class="review-stars">
${"â˜…".repeat(r.rating)}
</div>


<p>${r.review}</p>


<div class="review-date">
${r.date}
</div>


</div>

`;

});


reviewList.innerHTML=html;

}



function deleteReview(i){

let p=prompt("Admin password");

if(p===ADMIN_PASS){

let data=JSON.parse(localStorage.getItem("reviews")||"[]");

data.splice(i,1);

localStorage.setItem("reviews",JSON.stringify(data));

loadReviews();

}else{

alert("Wrong password");

}

}


loadReviews();