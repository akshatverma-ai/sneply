// Like button
function likePost(button) {
  let likes = button.getAttribute("data-likes") || 0;
  likes++;
  button.setAttribute("data-likes", likes);
  button.innerHTML = `❤️ Liked (${likes})`;
}

// Upload post
function uploadPost() {
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];
  if (!file) return alert("Please choose an image first!");

  const reader = new FileReader();
  reader.onload = function (e) {
    const feed = document.querySelector(".feed");
    const newPost = document.createElement("div");
    newPost.classList.add("post");
    newPost.innerHTML = `
      <h3>@akshatverma</h3>
      <img src="${e.target.result}" alt="Post Image" />
      <button onclick="likePost(this)">❤️ Like</button>
      <div class="comments">
        <input type="text" class="commentInput" placeholder="Write a comment..." />
        <button onclick="addComment(this)">Comment</button>
        <div class="commentList"></div>
      </div>
    `;
    feed.prepend(newPost);
  };
  reader.readAsDataURL(file);
}

// Comment system
function addComment(button) {
  const post = button.closest(".post");
  const input = post.querySelector(".commentInput");
  const commentList = post.querySelector(".commentList");
  if (input.value.trim() !== "") {
    const newComment = document.createElement("p");
    newComment.textContent = "💬 " + input.value;
    commentList.appendChild(newComment);
    input.value = "";
  }
}
