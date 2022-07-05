# 쇼핑몰 웹 서비스 프로젝트

http://kdt-sw2-seoul-team16.elicecoding.com/

관리자 기능 확인시

ID: test@test.com <br>
PW: testtest

로 로그인 해주세요.

<br>

## 서비스 소개
제품들을 조회하고, 장바구니에 추가하고, 또 주문을 할 수 있는 쇼핑몰 웹 서비스 제작 프로젝트입니다.

1. 회원가입, 로그인, 회원정보 수정 등 유저 정보 관련 CRUD
2. 제품 목록을 조회 및, 제품 상세 정보를 조회 가능함.
3. 장바구니에 제품을 추가할 수 있으며, 장바구니에서 CRUD 작업이 가능함.
4. 장바구니는 서버 DB가 아닌, 프론트 단에서 저장 및 관리됨 (indexedDB 이용)
5. 장바구니에서 주문을 진행하며, 주문 완료 후 조회 및 삭제가 가능함.

<br>

## 기술 스택
### 1. 프론트엔드
- Vanilla javascript
- HTML
- CSS, Bulma CSS

### 2. 백엔드
- Node.js, Express (nodemon, babel-node로 실행됩니다.)
- Mongodb, Mongoose

<br>

## 참여자

이름	| 담당업무
-|-
조재홍	|백엔드
채지우	|백엔드
이주혁	|프론트엔드
조희정	|프론트엔드

<br>

## 실행 방법

1. 레포지토리를 클론하고자 하는 디렉토리에서 아래 명령어를 수행
```
git clone <레포지토리 주소>
```

2. 클론한 디렉토리에서 backend 디렉토리로 들어가 아래 명령어를 통해 backend에서 필요한 module 설치
```
npm install
```

3. backend에서 필요한 .env 설정
```
MONGODB_URL=<몽고DB URL>
PORT=5000
JWT_SECERT_KEY=<랜덤 문자열>
```

4. express 앱을 실행
```
npm run start
```
