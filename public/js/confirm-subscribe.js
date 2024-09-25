const isSubscribed = document.getElementById('is-subscribed').getAttribute("value");

const messageBox = document.getElementById('message-box');
messageBox.classList.remove('hidden', 'error', 'success');

if (isSubscribed == "true") {
  messageBox.classList.add('success');
  messageBox.textContent = "Successfully! Your subscription is ON!";
} else {
  messageBox.classList.add('error');
  messageBox.textContent = "There was an error! Please try again!";
}
