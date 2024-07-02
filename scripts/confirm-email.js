  const token = "{{token}}"

  const successSection = document.getElementById('success-message');
  const errorSection = document.getElementById('error-message');
  successSection.style.display = 'none';
  errorSection.style.display = 'none';

  const verifyEmail = async () => {
    try {
      const response = await fetch(`/user/verify-email?token=${token}`);

      console.log('response: ', response.status);

      if (response.status !== 200) {
        errorSection.style.display = 'block';
        return;
      }

      successSection.style.display = 'block';
    } catch (e) {
      errorSection.style.display = 'block';
    }
  }

  verifyEmail();