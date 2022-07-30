import * as Api from '../api.js';
const receivedId = location.href.split('?')[1];

const bookNameInput = document.querySelector('#bookName');
const authorInput = document.querySelector('#author');
const categoryInput = document.querySelector('#category');
const publisherInput = document.querySelector('#publisher');
const infoInput = document.querySelector('#info');
const priceInput = document.querySelector('#price');
const photo = document.querySelector('#photo');
const fileName = document.querySelector('.file-name');
const select = document.querySelector('.select');
const purchaseButton = document.querySelector('#purchaseButton');

photo.addEventListener('change', changeName);

purchaseButton.addEventListener('click', sell);

async function changeName() {
  fileName.innerHTML = photo.files[0].name;
}

async function sell(e) {
  e.preventDefault();

  //upload router
  const bookName = bookNameInput.value;
  const author = authorInput.value;
  const category = categoryInput.value;
  const publisher = publisherInput.value;
  const info = infoInput.value;
  const price = Number(priceInput.value);
  const img = new FormData();
  img.append('img', photo.files[0]);
  try {
    const urlResult = await fetch('/upload/register/', {
      method: 'POST',
      body: img,
    });

    const imageJson = await urlResult.json();
    const imageUrl = imageJson.url;

    const data = {
      bookName,
      author,
      category,
      publisher,
      price,
      info,
      imageUrl,
    };

    const result = await Api.postparam('/product/setProduct', receivedId, data);
    alert(`제품이 수정됐습니다.`);
    location.href = `/adminBookDetail?${receivedId}`;
  } catch (e) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}

async function getAllCategories() {
  const dropDownCategories = await Api.get('/category/list');
  dropDownCategories.forEach((category) => {
    const { _id, categoryName } = category;
    const element = `<option value="${categoryName}">${categoryName}</option>`;

    select.insertAdjacentHTML('beforeend', element);
  });
}

getAllCategories();
