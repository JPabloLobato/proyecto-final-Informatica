document.getElementById('profile-pic').addEventListener('click', function() {
    var menu = document.getElementById('dropdown-menu');
    if (menu.style.display === 'block') {
        menu.style.display = 'none';
    } else {
        menu.style.display = 'block';
    }
});

window.addEventListener('click', function(event) {
    var menu = document.getElementById('dropdown-menu');
    if (!event.target.matches('#profile-pic')) {
        if (menu.style.display === 'block') {
            menu.style.display = 'none';
        }
    }
});