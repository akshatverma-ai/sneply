// Login system
function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (username === "akshat" && password === "1234") {
    window.location.href = "profile.html";
  } else {
    alert("Wrong username or password!");
  }
}

// Profile picture update
function updateProfilePic(event) {
  const img = document.getElementById("profileImg");
  const file = event.target.files[0];
  if (file) {
    img.src = URL.createObjectURL(file);
  }
}

// Follow button
function toggleFollow() {
  const btn = document.getElementById("followBtn");
  if (btn.textContent === "Follow") {
    btn.textContent = "Following ✅";
    btn.style.backgroundColor = "#28a745";
  } else {
    btn.textContent = "Follow";
    btn.style.backgroundColor = "#ff4081";
  }
}
