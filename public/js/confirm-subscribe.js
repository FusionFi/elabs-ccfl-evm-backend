const isSubscribed = document.getElementById('is-subscribed').getAttribute("value");

const messageBox = document.getElementById('message-box');
messageBox.classList.remove('hidden', 'error', 'success');

if (isSubscribed) {
  messageBox.classList.add('success');
  messageBox.textContent = "Your email has been confirmed successfully!\nYour subscription is ON!";
} else {
  messageBox.classList.add('error');
  messageBox.textContent = "There was an error on confirming your email. Please try again.";
}
