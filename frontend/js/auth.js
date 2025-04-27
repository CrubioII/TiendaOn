document.addEventListener('DOMContentLoaded', () => {
    // Ejemplo: Función para manejar login
    async function login(email, password) {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        window.location.href = data.role === 'admin' ? 'admin.html' : 'customer.html';
      } else {
        alert(data.error);
      }
    }
  
    // Ejemplo de uso (en un formulario real)
    // document.getElementById('loginForm').addEventListener('submit', (e) => {
    //   e.preventDefault();
    //   login(emailInput.value, passwordInput.value);
    // });
  });