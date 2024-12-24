// Public/js/wishlist.js
document.querySelectorAll('.add-to-wishlist').forEach(button => {
    button.addEventListener('click', async (event) => {
        const productId = event.target.getAttribute('data-product-id');
        
        const response = await fetch(`/wishlist/add/${productId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Include CSRF token if applicable
                'X-CSRF-Token': csrfToken 
            }
        });

        const result = await response.json();
        alert(result.message);
    });
});