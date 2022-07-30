import * as Api from '/api.js';
import { validateNull, validateNumber } from '../useful-functions.js';

const editButton = document.querySelector('#editButton');
editButton.addEventListener('click', submitUserInfo);

async function submitUserInfo(e) {
  e.preventDefault();

  const fullName = document.querySelector('#fullName').value;
  const currentPassword = document.querySelector('#currentPassword').value;
  const password = document.querySelector('#newPassword').value;
  const phoneNumber = document.querySelector('#phoneNumber').value;
  const address1 = document.querySelector('#receiverAddress').value;
  const address2 = document.querySelector('#detailAddress').value;
  const postalCode = document.querySelector('#postalCode').value;
  const address = { postalCode, address1, address2 };

  const arr = [
    fullName,
    currentPassword,
    password,
    phoneNumber,
    postalCode,
    address1,
    address2,
  ];

  function validationCheck(arr) {
    if (!validateNull(arr)) {
      return false;
    }

    if (!validateNumber(phoneNumber)) {
      alert('연락처에 숫자만 입력해주세요.');
      return false;
    }

    if (!validateNumber(postalCode)) {
      alert('우편번호에 숫자만 입력해주세요.');
      return false;
    }

    return true;
  }

  if (validationCheck(arr)) {
    try {
      const data = {
        fullName,
        password,
        phoneNumber,
        address,
        currentPassword,
      };
      alert('수정이 완료됐습니다.');
      await Api.patch('/api/update', '', data);
      location.href = '/accountManagement';
    } catch (e) {
      console.error(err.stack);
      alert(
        `문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`
      );
    }
  }
}
