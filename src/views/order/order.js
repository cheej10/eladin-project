import * as Api from '../api.js';
import { getAllDB } from '../indexedDB.js';
import { validateNull, validateNumber } from '../useful-functions.js';

// indexedDB에 담아놓은 책들 가져오기
const books = await getAllDB('buy');

// 결제 정보 표시
const orderCount = document.querySelector('#orderCount');
const priceText = document.querySelector('#price');
const totalPriceText = document.querySelector('#total-price');

let count = 0;
let booksPrice = 0;

books.forEach((book) => {
  count += book.quantity;
  booksPrice += book.price * book.quantity;
});

orderCount.innerText = `${count}개`;
priceText.innerText = `${booksPrice}원`;
totalPriceText.innerText = `${booksPrice + 3000}원`;

// 우편번호 찾기 버튼 클릭 시
const searchPostalCodeBtn = document.querySelector('#searchPostalCodeBtn');
searchPostalCodeBtn.addEventListener('click', searchPostalCode);

const address1 = document.querySelector('#receiverAddress1');
const postalCode = document.querySelector('#receiverPostalCode');

function searchPostalCode() {
  new daum.Postcode({
    oncomplete: function (data) {
      let extraRoadAddr = ''; // 동, 건물 추가할 변수

      // 법정동명이 있을 경우 추가
      if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
        extraRoadAddr += data.bname;
      }

      // 건물명이 있을 경우 추가
      if (data.buildingName !== '' && data.apartment === 'Y') {
        extraRoadAddr +=
          extraRoadAddr !== '' ? ', ' + data.buildingName : data.buildingName;
      }

      // extraRoadAddr 문자열에 괄호 추가
      if (extraRoadAddr !== '') {
        extraRoadAddr = ' (' + extraRoadAddr + ')';
      }

      postalCode.value = data.zonecode;
      address1.value = data.roadAddress + extraRoadAddr;
    },
  }).open();
}

// 구매하기 버튼 클릭 시
const purchaseButton = document.querySelector('#purchaseButton');
purchaseButton.addEventListener('click', purchase);

async function purchase() {
  const receiverName = document.querySelector('#receiverName').value;
  const receiverPhoneNumber = document.querySelector(
    '#receiverPhoneNumber'
  ).value;
  const receiverAddress2 = document.querySelector('#receiverAddress2').value;
  const receiverPostalCode = postalCode.value;

  const arr = [
    receiverName,
    receiverPhoneNumber,
    address1.value,
    receiverAddress2,
    receiverPostalCode,
  ];

  function validationCheck(arr) {
    if (!validateNull(arr)) {
      return false;
    }

    if (!validateNumber(receiverPhoneNumber)) {
      alert('연락처에 숫자만 입력해주세요.');
      return false;
    }

    if (!validateNumber(receiverPostalCode)) {
      alert('우편번호에 숫자만 입력해주세요.');
      return false;
    }

    return true;
  }

  if (validationCheck(arr)) {
    try {
      const user = await Api.get('/api/user');
      const orderList = [];

      books.forEach((book) => {
        const obj = {
          bookName: book.bookName,
          quantity: book.quantity,
          price: book.price,
          productId: book._id,
        };

        orderList.push(obj);
      });

      const info = {
        orderList: orderList,
        email: user.email,
        fullName: receiverName,
        phoneNumber: receiverPhoneNumber,
        address1: address1.value,
        address2: receiverAddress2,
        postalCode: receiverPostalCode,
      };
      console.log(info);
      await Api.post('/order/register', info);

      location.href = '/orderComplete';
    } catch (err) {
      alert(err.message);
    }
  }
}
