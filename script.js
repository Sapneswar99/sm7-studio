const apps = [
  {
    name: "Super Video Player",
    category: "Video Players & Editors",
    rating: "4.8",
    size: "23 MB",
    icon: "icon.png"
  },
  {
    name: "MX Player",
    category: "Video Players & Editors",
    rating: "4.2",
    size: "28 MB",
    icon: "icon.png"
  },
  {
    name: "VLC for Android",
    category: "Video Players & Editors",
    rating: "4.4",
    size: "32 MB",
    icon: "icon.png"
  },
  {
    name: "KMPlayer",
    category: "Video Players & Editors",
    rating: "4.1",
    size: "23 MB",
    icon: "icon.png"
  },
  {
    name: "BSPlayer",
    category: "Video Players & Editors",
    rating: "3.9",
    size: "18 MB",
    icon: "icon.png"
  },
  {
    name: "Video Player All Format",
    category: "Video Players & Editors",
    rating: "4.3",
    size: "16 MB",
    icon: "icon.png"
  }
];


function showScreen(id) {

  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });

  const screen = document.getElementById(id);

  if (screen) {
    screen.classList.add("active");
  }

  document.querySelectorAll(".nav-item").forEach(item => {
    item.classList.remove("active");

    if (item.dataset.screen === id) {
      item.classList.add("active");
    }
  });

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


function openApp() {
  showScreen("details");
}


function openSearch() {

  showScreen("search");

  setTimeout(() => {
    document.getElementById("searchInput").focus();
  }, 100);

  searchApps();
}


function clearSearch() {

  document.getElementById("searchInput").value = "";

  searchApps();
}


function searchApps() {

  const input =
    document.getElementById("searchInput").value
      .toLowerCase()
      .trim();

  const results =
    apps.filter(app =>
      app.name.toLowerCase().includes(input) ||
      app.category.toLowerCase().includes(input)
    );

  const container =
    document.getElementById("searchResults");

  container.innerHTML = "";

  if (results.length === 0) {

    container.innerHTML = `
      <div style="
        text-align:center;
        color:#89919f;
        padding:50px 10px;
      ">
        No apps found
      </div>
    `;

    return;
  }

  results.forEach(app => {

    container.innerHTML += `
      <div class="app-row">

        <img src="${app.icon}" alt="${app.name}">

        <div class="app-row-info">
          <b>${app.name}</b>
          <small>
            ${app.category}<br>
            ${app.rating} ★ &nbsp; • &nbsp; ${app.size}
          </small>
        </div>

        <button
          class="install-small"
          onclick="openApp()"
        >
          Install
        </button>

      </div>
    `;

  });
}


function loadRecommended() {

  const container =
    document.getElementById("recommended");

  container.innerHTML = "";

  apps.slice(1, 4).forEach(app => {

    container.innerHTML += `
      <div class="app-row">

        <img src="${app.icon}" alt="${app.name}">

        <div class="app-row-info">
          <b>${app.name}</b>
          <small>
            ${app.category}<br>
            ${app.rating} ★ &nbsp; • &nbsp; ${app.size}
          </small>
        </div>

        <button
          class="install-small"
          onclick="downloadApp()"
        >
          Install
        </button>

      </div>
    `;

  });
}


function downloadApp() {

  const apkPath = "https://github.com/Sapneswar99/sm7-studio/releases/download/v1.0.0/Super.Video.Player.apk";

  const link = document.createElement("a");

  link.href = apkPath;

  link.download = "SuperVideoPlayer.apk";

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  startProgress();
}


function startProgress() {

  showScreen("updates");

  const bar =
    document.getElementById("progressBar");

  const text =
    document.getElementById("progressText");

  let progress = 54;

  const timer = setInterval(() => {

    progress += 2;

    if (progress >= 100) {

      progress = 100;

      clearInterval(timer);

      text.textContent =
        "Download completed";

    } else {

      const mb =
        ((23 * progress) / 100).toFixed(1);

      text.textContent =
        `${mb} MB / 23 MB`;

    }

    bar.style.width = progress + "%";

  }, 150);

}


function pauseDownload() {

  alert("Download paused");

}


loadRecommended();
searchApps();
