document.addEventListener('DOMContentLoaded', () => {
    console.log('GitHub Pages site loaded successfully!');
    
    const container = document.querySelector('.container');
    
    // Add a simple interactive element
    const button = document.createElement('button');
    button.textContent = 'Click me!';
    button.style.padding = '10px 20px';
    button.style.margin = '20px 0';
    button.style.backgroundColor = '#007bff';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    
    button.addEventListener('click', () => {
        alert('Welcome to my GitHub Pages site!');
    });
    
    container.appendChild(button);
});
