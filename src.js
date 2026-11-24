import { upload } from "@vercel/blob/client";

const input = document.querySelector("#fileInput");
const browse = document.querySelector("#browse");
const dropzone = document.querySelector("#dropzone");
const queue = document.querySelector("#queue");
const MAX_SIZE = 100 * 1024 * 1024;

browse.addEventListener("click", (event) => {
  event.stopPropagation();
  input.click();
});
dropzone.addEventListener("click", (event) => {
  if (event.target.closest("button")) return;
  input.click();
});
dropzone.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    input.click();
  }
});
input.addEventListener("change", () => {
  handleFiles([...input.files]);
  input.value = "";
});
["dragenter", "dragover"].forEach(type => dropzone.addEventListener(type, event => {
  event.preventDefault();
  dropzone.classList.add("dragover");
}));
["dragleave", "drop"].forEach(type => dropzone.addEventListener(type, event => {
  event.preventDefault();
  dropzone.classList.remove("dragover");
}));
dropzone.addEventListener("drop", event => handleFiles([...event.dataTransfer.files]));

function formatSize(bytes) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
function addRow(file) {
  const row = document.createElement("div");
  row.className = "file-row";
  row.innerHTML = `<div class="file-symbol">↥</div><div class="file-info"><div class="file-name"></div><div class="file-status"></div><div class="progress"><span></span></div></div>`;
  row.querySelector(".file-name").textContent = file.name;
  row.querySelector(".file-status").textContent = `Preparing · ${formatSize(file.size)}`;
  queue.prepend(row);
  return {
    status: row.querySelector(".file-status"),
    progress: row.querySelector(".progress span"),
    row
  };
}
async function handleFiles(files) {
  for (const file of files) {
    const ui = addRow(file);
    if (file.size > MAX_SIZE) {
      ui.status.textContent = "File is larger than the 100 MB limit";
      ui.status.classList.add("error");
      ui.progress.style.background = "#ff8585";
      continue;
    }
    try {
      ui.status.textContent = "Uploading…";
      ui.progress.style.width = "12%";
      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
        onUploadProgress: ({ percentage }) => {
          ui.progress.style.width = `${Math.max(4, percentage)}%`;
          ui.status.textContent = `Uploading · ${Math.round(percentage)}%`;
        }
      });
      ui.progress.style.width = "100%";
      ui.status.textContent = "Upload complete · Link ready";
      const copy = document.createElement("button");
      copy.className = "copy-link";
      copy.textContent = "Copy link";
      copy.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(blob.url);
          copy.textContent = "Copied!";
          setTimeout(() => copy.textContent = "Copy link", 1600);
        } catch {
          window.prompt("Copy your file link:", blob.url);
        }
      });
      ui.row.append(copy);
    } catch (error) {
      console.error(error);
      ui.status.textContent = error.message || "Upload failed. Check your storage setup.";
      ui.status.classList.add("error");
      ui.progress.style.width = "100%";
      ui.progress.style.background = "#ff8585";
    }
  }
}