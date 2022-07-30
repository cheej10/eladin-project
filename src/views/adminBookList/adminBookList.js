import * as Api from '../api.js';

const listContainer = document.querySelector('.list-container');
const paginationList = document.querySelector('.pagination-list');
const categoryBox = document.querySelector('.category-box');
const sortBox = document.querySelector('.sort-box');

let totalPage = 0;

categoryBox.addEventListener('change', dropDownChange);
sortBox.addEventListener('change', dropDownChange);

getAllCategories();
await getAllBooks(1);
createPaginationBtn(totalPage, 1);

// 전체 카테고리 가져오기
async function getAllCategories() {
  const dropDownCategories = await Api.get('/category/list');
  dropDownCategories.forEach((category) => {
    const { categoryName } = category;
    const element = `<option value="${categoryName}">${categoryName}</option>`;

    categoryBox.insertAdjacentHTML('beforeend', element);
  });
}

// 카테고리 or 정렬 선택 시
async function dropDownChange() {
  if (categoryBox.value === 'all') {
    if (sortBox.value === 'latest') {
      await getAllBooks(1);
    } else if (sortBox.value === 'expensive') {
      await getExpensiveBooks(1);
    } else {
      await getCheapBooks(1);
    }
  } else {
    if (sortBox.value === 'latest') {
      await getCategoryBooks(categoryBox.value, 1);
    } else if (sortBox.value === 'expensive') {
      await getCategoryExpensiveBooks(categoryBox.value, 1);
    } else {
      await getCategoryCheapBooks(categoryBox.value, 1);
    }
  }
  createPaginationBtn(totalPage, 1);
}

function attachToContainer(books) {
  listContainer.innerHTML = '';

  books.productsList.productList.forEach((book) => {
    const { _id, imageUrl, bookName, author, publisher, price } = book;

    const element = `
      <div class="book-container" onclick="location.href='/adminBookDetail?${_id}'">
          <div class="book-info">
              <div class = "imgGallery">
                <img src=${imageUrl} class="book-img" alt=${bookName}>
              </div>
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

// 전체 도서 목록 가져오기 (기본 정렬: 최신순)
async function getAllBooks(currentPage) {
  const datas = await Api.get(`/product/latestlist?pageno=${currentPage}`);
  totalPage = datas.productsList.totalPage;

  attachToContainer(datas);
}

// 가격 낮은 순
async function getCheapBooks(currentPage) {
  const datas = await Api.get(`/product/cheaplist?pageno=${currentPage}`);
  totalPage = datas.productsList.totalPage;

  attachToContainer(datas);
}

// 가격 높은 순
async function getExpensiveBooks(currentPage) {
  const datas = await Api.get(`/product/expensivelist?pageno=${currentPage}`);
  totalPage = datas.productsList.totalPage;

  attachToContainer(datas);
}

// 카테고리별 목록 가져오기
async function getCategoryBooks(selectCategory, currentPage) {
  const datas = await Api.get(
    `/product/category/${selectCategory}/latestlist?pageno=${currentPage}`
  );
  totalPage = datas.productsList.totalPage;

  attachToContainer(datas);
}

async function getCategoryCheapBooks(selectCategory, currentPage) {
  const datas = await Api.get(
    `/product/category/${selectCategory}/cheaplist?pageno=${currentPage}`
  );
  totalPage = datas.productsList.totalPage;

  attachToContainer(datas);
}

async function getCategoryExpensiveBooks(selectCategory, currentPage) {
  const datas = await Api.get(
    `/product/category/${selectCategory}/expensivelist?pageno=${currentPage}`
  );
  totalPage = datas.productsList.totalPage;

  attachToContainer(datas);
}

const previousPageBtn = document.querySelector('.pagination-previous');
const nextPageBtn = document.querySelector('.pagination-next');

previousPageBtn.addEventListener('click', () => {
  const pageBtn = document.querySelectorAll('.pagination-link');
  const currentPage = Number(pageBtn[0].innerText - 5);

  if (currentPage < 0) return;

  createPaginationBtn(totalPage, currentPage);
  pagination(currentPage);
});

nextPageBtn.addEventListener('click', () => {
  const pageBtn = document.querySelectorAll('.pagination-link');
  const currentPage = Number(pageBtn[pageBtn.length - 1].innerText) + 1;

  if (currentPage > totalPage) return;

  createPaginationBtn(totalPage, currentPage);
  pagination(currentPage);
});

// pagination 버튼 5개씩 생성
function createPaginationBtn(totalPage, currentPage) {
  const pageCount = 5;
  paginationList.innerHTML = '';

  const firstNum = currentPage - (currentPage % pageCount) + 1;
  let lastNum = currentPage - (currentPage % pageCount) + pageCount;

  if (lastNum > totalPage) {
    lastNum = totalPage;
  }

  for (let i = firstNum; i <= lastNum; i++) {
    let btn = null;

    if (i === currentPage) {
      btn = `
        <li>
          <a class="pagination-link Page ${i} is-current">${i}</a>
        </li>
      `;
    } else {
      btn = `
        <li>
          <a class="pagination-link Page ${i}">${i}</a>
        </li>
      `;
    }

    paginationList.insertAdjacentHTML('beforeend', btn);
  }
}

function pagination(pageNumber) {
  if (categoryBox.value === 'all') {
    if (sortBox.value === 'latest') {
      getAllBooks(pageNumber);
    } else if (sortBox.value === 'expensive') {
      getExpensiveBooks(pageNumber);
    } else {
      getCheapBooks(pageNumber);
    }
  } else {
    if (sortBox.value === 'latest') {
      getCategoryBooks(categoryBox.value, pageNumber);
    } else if (sortBox.value === 'expensive') {
      getCategoryExpensiveBooks(categoryBox.value, pageNumber);
    } else {
      getCategoryCheapBooks(categoryBox.value, pageNumber);
    }
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

    pagination(pageNumber);
  }
});
