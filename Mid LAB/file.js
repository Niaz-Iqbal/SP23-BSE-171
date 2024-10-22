
const profilePicture = document.querySelector('.profile-picture img');
const introBox = document.querySelector('.intro-box');


profilePicture.addEventListener('mouseenter', function() {
    introBox.style.display = 'block';  
});


profilePicture.addEventListener('mouseleave', function() {
    introBox.style.display = 'none';   
});
