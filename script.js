const data=[
{
name:"Spotify",
icon:"https://picsum.photos/200?1",
dev:"Spotify AB"
},
{
name:"WhatsApp",
icon:"https://picsum.photos/200?2",
dev:"Meta"
},
{
name:"Instagram",
icon:"https://picsum.photos/200?3",
dev:"Meta"
},
{
name:"Telegram",
icon:"https://picsum.photos/200?4",
dev:"Telegram"
},
{
name:"YouTube",
icon:"https://picsum.photos/200?5",
dev:"Google"
},
{
name:"Facebook",
icon:"https://picsum.photos/200?6",
dev:"Meta"
}
];

const apps=document.getElementById("apps");

function load(){

apps.innerHTML="";

data.forEach(app=>{

apps.innerHTML+=`
<div class="card">
<img src="${app.icon}">
<h3>${app.name}</h3>
<p>${app.dev}</p>
</div>
`;

});

}

load();

document.getElementById("theme").onclick=()=>{

document.body.classList.toggle("dark");

};

document.getElementById("search").addEventListener("input",e=>{

let value=e.target.value.toLowerCase();

let cards=document.querySelectorAll(".card");

cards.forEach(card=>{

card.style.display=
card.innerText.toLowerCase().includes(value)
?"block":"none";

});

});
