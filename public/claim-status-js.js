document.addEventListener("DOMContentLoaded", function () {
    const checkStatusBtn = document.getElementById("checkStatusBtn");
    const statusMessage = document.getElementById("statusMessage");

    if (checkStatusBtn) {
        checkStatusBtn.addEventListener("click", function () {
            fetch('/status') // Update with your actual API endpoint
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        statusMessage.innerHTML = `<span style="color: green;">${data.message}</span>`;
                    } else {
                        statusMessage.innerHTML = `<span style="color: red;">${data.error}</span>`;
                    }
                })
                .catch(error => {
                    console.error("Error fetching status:", error);
                    statusMessage.innerHTML = `<span style="color: red;">Error checking status. Try again later.</span>`;
                });
        });
    } else {
        console.error("Check Status button not found.");
    }
});
