const emailVerified = document.getElementById('email-verified').getAttribute("value");

const successSection = document.getElementById('success-message');
const errorSection = document.getElementById('error-message');

successSection.style.display = emailVerified == "true" ? 'block' : 'none';
errorSection.style.display = emailVerified == "true" ? 'none' : 'block';
