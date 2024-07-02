const token = document.getElementById('token').getAttribute('value');

const errorSection = document.getElementById('error-message');
const successSection = document.getElementById('success-message');

successSection.style.display = 'none';
errorSection.style.display = 'none';

const changePasswordForm = document.getElementById('change-password-form');
const passwordInput = document.getElementById('newPassword');
const submitButton = document.getElementsByTagName('button')[0];
submitButton.disabled = true;

passwordInput.addEventListener('input', () => {
    const value = passwordInput.value;

    if (!value){
      submitButton.disabled = true;
    } else {
      submitButton.disabled = false;
    }
});


changePasswordForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const password = passwordInput.value;

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

    if(response.status !== 200 && response.status !== 201) {
      errorSection.style.display = 'block';
      return;
    }

    successSection.style.display = 'block';
    document.getElementById('form-section').style.display = 'none';

  } catch (e) {
    errorSection.style.display = 'block';
  }
}
