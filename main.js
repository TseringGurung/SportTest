
var checkbox = document.getElementById('theme-toggle-checkbox');
var themeLabel = document.getElementById('theme-label');
var logo = document.getElementsByClassName('logo')[0]; 


if (localStorage.getItem('dark-mode') === 'enabled') {
  document.body.classList.add('dark-mode');
  checkbox.checked = true;
  themeLabel.textContent = 'Light Mode';
  themeLabel.style.color = '#f7f7f7'; 
  logo.style.color = '#f7f7f7'; 
} else {
  document.body.classList.add('light-mode');
  themeLabel.style.color = '#333'; 
}

checkbox.addEventListener('change', function() {
  if (this.checked) {
    document.body.classList.remove('light-mode');
    document.body.classList.add('dark-mode');
    localStorage.setItem('dark-mode', 'enabled');
    themeLabel.textContent = 'Light Mode';
    themeLabel.style.color = '#f7f7f7'; 
    logo.style.color = '#f7f7f7'; 
  } else {
    document.body.classList.remove('dark-mode');
    document.body.classList.add('light-mode');
    localStorage.setItem('dark-mode', 'disabled');
    themeLabel.textContent = 'Dark Mode';
    themeLabel.style.color = '#333'; 
    logo.style.color = '#333'; 
  }
});

document.addEventListener('DOMContentLoaded', () => {
    const emojis = document.querySelectorAll('.emoji');
    emojis.forEach(emoji => {
      emoji.style.fontSize = `${Math.random() * (3.5 - 2) + 2}rem`;
      emoji.style.animationDelay = `${Math.random() * 2}s`;
    });
  });
  
  