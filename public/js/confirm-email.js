const emailVerified = document.getElementById('email-verified').getAttribute("value");

const messageBox = document.getElementById('message-box');
messageBox.classList.remove('hidden', 'error', 'success');

if (emailVerified) {
  messageBox.classList.add('success');
  messageBox.textContent = "Your email has been confirmed successfully!";
} else {
  messageBox.classList.add('error');
  messageBox.textContent = "There was an error confirming your email. Please try again.";
}
