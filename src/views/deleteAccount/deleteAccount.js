import * as Api from '/api.js';

const passwordInput = document.querySelector('#password');
const continueButton = document.querySelector('#continueButton');

continueButton.addEventListener('click', deleteUser);

async function deleteUser(e) {
  e.preventDefault();

  try {
    const data = passwordInput.value;
    await Api.delete('/api/del', '', { data });
    alert('탈퇴가 완료됐습니다.');
    localStorage.removeItem('token');
    location.href = '/';
  } catch (err) {
    alert(err);
  }
}
