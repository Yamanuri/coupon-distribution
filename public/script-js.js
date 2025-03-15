document.addEventListener("DOMContentLoaded", function () {
  const couponList = document.getElementById("couponList");

  if (couponList) {
      fetch("/coupons")
          .then(response => response.json())
          .then(data => {
              couponList.innerHTML = ""; // Clear loading text
              if (data.length === 0) {
                  couponList.innerHTML = "<li>No coupons available at the moment.</li>";
                  return;
              }

              data.forEach(coupon => {
                  const listItem = document.createElement("li");
                  listItem.innerHTML = `<strong>${coupon.code}</strong> - ${coupon.discount} (Valid until: ${coupon.valid})`;
                  couponList.appendChild(listItem);
              });
          })
          .catch(error => {
              console.error("❌ Error loading coupons:", error);
              couponList.innerHTML = "<li>Error loading coupons.</li>";
          });
  }
});
