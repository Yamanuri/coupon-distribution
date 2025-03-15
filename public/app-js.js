document.addEventListener('DOMContentLoaded', () => {
  const claimBtn = document.getElementById('claim-btn');
  const couponDisplay = document.getElementById('coupon-display');
  const couponCode = document.getElementById('coupon-code');
  const couponDescription = document.getElementById('coupon-description');
  const claimMessage = document.getElementById('claim-message');
  const errorMessage = document.getElementById('error-message');
  
  claimBtn.addEventListener('click', async () => {
    try {
      // Disable button during API call to prevent multiple clicks
      claimBtn.disabled = true;
      claimBtn.textContent = 'Processing...';
      
      // Clear previous messages
      errorMessage.classList.add('hidden');
      
      // Make the API request to claim a coupon
      const response = await fetch('/api/claim-coupon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        // Show the coupon
        couponDisplay.classList.remove('hidden');
        couponCode.textContent = data.coupon.code;
        couponDescription.textContent = data.coupon.description;
        claimMessage.textContent = data.message;
        claimMessage.classList.add('success');
        
        // Hide the claim button container
        document.getElementById('claim-container').classList.add('hidden');
        
        // Store claim in local storage for UI purposes only
        // (server will handle actual restriction logic)
        localStorage.setItem('lastClaim', Date.now().toString());
      } else {
        // Show error message
        errorMessage.textContent = data.message || 'Failed to claim coupon. Please try again later.';
        errorMessage.classList.remove('hidden');
        
        // Reset the button
        claimBtn.textContent = 'Claim Your Coupon';
        claimBtn.disabled = false;
        
        // If we need to wait, start a countdown timer
        if (data.message && data.message.includes('minutes')) {
          startCountdown(data.message);
        }
      }
    } catch (error) {
      console.error('Error claiming coupon:', error);
      errorMessage.textContent = 'An error occurred. Please try again later.';
      errorMessage.classList.remove('hidden');
      
      // Reset the button
      claimBtn.textContent = 'Claim Your Coupon';
      claimBtn.disabled = false;
    }
  });
  
  // Check if user recently claimed (for UI purposes)
  const lastClaim = localStorage.getItem('lastClaim');
  if (lastClaim) {
    const timeElapsed = Date.now() - parseInt(lastClaim);
    const hourInMs = 60 * 60 * 1000;
    
    if (timeElapsed < hourInMs) {
      const minutesRemaining = Math.ceil((hourInMs - timeElapsed) / 60000);
      errorMessage.textContent = `You can claim another coupon in ${minutesRemaining} minutes.`;
      errorMessage.classList.remove('hidden');
      claimBtn.disabled = true;
      
      // Start countdown for client-side timer
      startCountdown(`You can claim another coupon in ${minutesRemaining} minutes.`);
    }
  }
  
  // Function to update the countdown timer
  function startCountdown(message) {
    // Extract minutes from message (assuming format "... in X minutes.")
    const minutesMatch = message.match(/in (\d+) minutes/);
    if (!minutesMatch) return;
    
    let minutesRemaining = parseInt(minutesMatch[1]);
    claimBtn.textContent = `Wait (${minutesRemaining}m)`;
    
    const countdownInterval = setInterval(() => {
      minutesRemaining--;
      
      if (minutesRemaining <= 0) {
        clearInterval(countdownInterval);
        claimBtn.textContent = 'Claim Your Coupon';
        claimBtn.disabled = false;
        errorMessage.classList.add('hidden');
      } else {
        claimBtn.textContent = `Wait (${minutesRemaining}m)`;
        errorMessage.textContent = `You can claim another coupon in ${minutesRemaining} minutes.`;
      }
    }, 60000); // Update every minute
  }
});
