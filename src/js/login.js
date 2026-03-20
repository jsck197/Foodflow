function login() {
    let role = document.getElementById("role").value;

    if (role === "admin") {
        window.location.href = "admin-dashboard.html";
    } else if (role === "department") {
        window.location.href = "department-dashboard.html";
    } else if (role === "storekeeper") {
        window.location.href = "storekeeper-dashboard.html";
    } else {
        alert("Please select a user role");
    }
}