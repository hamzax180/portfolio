/* ============================================
   THEME TOGGLE - Dark/Light Mode
   ============================================ */

(function () {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;

    // Check for saved theme preference or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);

    // Toggle theme on button click
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);

            // Add a little animation feedback
            themeToggle.style.transform = 'rotate(180deg) scale(1.1)';
            setTimeout(() => {
                themeToggle.style.transform = '';
            }, 300);
        });
    }
})();
