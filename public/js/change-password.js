const token = document.getElementById('token').getAttribute('value');

const messageBox = document.getElementById('message-box');
const changePasswordForm = document.getElementById('change-password-form');
const newPasswordInput = document.getElementById('new-password');
const confirmPasswordInput = document.getElementById('confirm-password');
const submitButton = document.getElementsByTagName('button')[0];
submitButton.disabled = true;

changePasswordForm.addEventListener('input', () => {
  const newPassword = newPasswordInput.value;
  const confirmPassword = confirmPasswordInput.value;
  if (newPassword && confirmPassword && newPassword === confirmPassword) {
    submitButton.disabled = false;
  } else {
    submitButton.disabled = true;
  }
});

changePasswordForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const password = newPasswordInput.value;

  changePassword(token, password);
});

const changePassword = async (token, password) => {
  try {
    const response = await fetch('/user/change-password', {
      method: 'POST',
      body: JSON.stringify({
        token,
        password,
      }),
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (response.status !== 200 && response.status !== 201) {
      messageBox.classList.add('error');
      messageBox.textContent = "There was an error! Please try again!";
      return;
    }

    messageBox.classList.add('success');
    messageBox.textContent = "Your password has been reset successfully!";

  } catch (e) {
    messageBox.classList.add('error');
    messageBox.textContent = "There was an error! Please try again!";
  }
}
