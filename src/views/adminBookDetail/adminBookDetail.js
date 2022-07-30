import * as Api from '../api.js';
const receivedId = location.href.split('?')[1];

async function allFunc() {
  const bookContainer = document.querySelector('.book-container');
  const book = await Api.get(`/product/${receivedId}`);

  const { bookName, author, publisher, price, info, imageUrl } = book;

  const element = `
    <img src=${imageUrl} class="book-img" alt=${bookName}>
    <div class="book-info">
        <div>
        <p class="title">${bookName}</p>
        <p class="author">저자: ${author}</p>
        <p class="publisher">출판사: ${publisher}</p>
        <p class="price">판매가: ${price}</p>
        </div>
        <div class="book-introduction">
        <p class="intro-title">책 소개</p>
        <p class="intro-content">${info}</p>
        </div>
    </div>
    `;

  bookContainer.insertAdjacentHTML('beforeend', element);
}

async function deleteProduct() {
  await fetch(`/product/deleteProduct/${receivedId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  alert(`제품이 삭제됐습니다.`);
  location.href = '/adminBookList';
}

// 장바구니, 바로구매 - indexedDB에 현재 상품 데이터 추가
allFunc();
const addCartBtn = document.querySelector('.add-cart');
const buyBtn = document.querySelector('.buy');
addCartBtn.addEventListener(
  'click',
  () => (location.href = `/adminBookUpdate?${receivedId}`)
);
buyBtn.addEventListener('click', deleteProduct);
