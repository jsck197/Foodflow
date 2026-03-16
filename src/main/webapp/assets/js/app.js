document.addEventListener("DOMContentLoaded", function () {
    var stamp = document.querySelector("[data-now]");
    if (stamp) {
        stamp.textContent = new Date().toLocaleString();
    }
});
