import * as Api from '../api.js';

const listContainer = document.querySelector('.list-container');
const paginationList = document.querySelector('.pagination-list');
const select = document.querySelector('.select');
let totalPage = 0;

select.addEventListener('change', onChange);

getAllCategories();
await getAllBooks(1);
createPaginationBtn(totalPage, 1);

// 전체 카테고리 가져오기
async function getAllCategories() {
  const dropDownCategories = await Api.get('/category/list');
  dropDownCategories.forEach((category) => {
    const { categoryName } = category;
    const element = `<option value="${categoryName}">${categoryName}</option>`;

    select.insertAdjacentHTML('beforeend', element);
  });
}

// 카테고리 선택 시
async function onChange(e) {
  const selected = e.target.value;

  if (selected === 'all') {
    await getAllBooks(1);
  } else {
    await getCategoryBooks(selected, 1);
  }

  createPaginationBtn(totalPage);
}

// 전체 도서 목록 가져오기
async function getAllBooks(currentPage) {
  listContainer.innerHTML = '';

  const datas = await Api.get(`/product/list?pageno=${currentPage}`);
  totalPage = datas.productsList.totalPage;

  datas.productsList.productList.forEach((book) => {
    const { _id, imageUrl, bookName, author, publisher, price } = book;

    const element = `
      <div class="book-container" onclick="location.href='/detail?${_id}'">
          <div class="book-info">
              <img src=${imageUrl} class="book-img" alt=${bookName}>
              <p class="name">${bookName}</p>
              <p class="author">저자: ${author}</p>
              <p class="publisher">출판사: ${publisher}</p>
              <p class="price">판매가: ${price}</p>
          </div>
      </div>
    `;

    listContainer.insertAdjacentHTML('beforeend', element);
  });
}

// 카테고리별 목록 가져오기
async function getCategoryBooks(selectCategory, currentPage) {
  listContainer.innerHTML = '';

  const books = await Api.get(
    `/product/category/${selectCategory}?pageno=${currentPage}`
  );
  totalPage = books.productsList.totalPage;

  books.productsList.productList.forEach((book) => {
    const { _id, bookName, author, publisher, price, imageUrl } = book;

    const element = `
      <div class="book-container" onclick="location.href='/detail?${_id}'">
          <div class="book-info">
              <img src="${imageUrl}" class="book-img" alt=${bookName}>
              <p class="name">${bookName}</p>
              <p class="author">저자: ${author}</p>
              <p class="publisher">출판사: ${publisher}</p>
              <p class="price">판매가: ${price}</p>
          </div>
      </div>
    `;

    listContainer.insertAdjacentHTML('beforeend', element);
  });
}

// pagination 버튼 생성
function createPaginationBtn(totalPage) {
  paginationList.innerHTML = '';

  for (let i = 0; i < totalPage; i++) {
    let btn = null;

    if (i === 0) {
      btn = `
      <li>
        <a class="pagination-link Page 1 is-current">1</a>
      </li>
    `;
    } else {
      btn = `
      <li>
        <a class="pagination-link Page ${i + 1}">${i + 1}</a>
      </li>
    `;
    }

    paginationList.insertAdjacentHTML('beforeend', btn);
  }
}

// pagination 버튼 생성되면 이벤트 추가
document.addEventListener('click', function (e) {
  if (e.target && e.target.classList[0] === 'pagination-link') {
    const paginationBtn = document.querySelectorAll('.pagination-link');
    const pageNumber = e.target.innerText;

    paginationBtn.forEach((btn) => {
      btn.classList.remove('is-current');
    });

    e.target.classList.add('is-current');

    if (select.value === 'all') {
      getAllBooks(pageNumber);
    } else {
      getCategoryBooks(select.value, pageNumber);
    }
  }
});
