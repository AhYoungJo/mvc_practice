로그인 페이지 MVC 패턴으로 구현 연습
==================================

- 로그인 성공하면 'Login successfull' 메시지 띄우기
![image](https://github.com/AhYoungJo/mvc_practice02/assets/125351416/829fab59-a7c7-44f2-9772-5d1b7add698a)

- 로그인 실패하면 'Login failed' 메시지 띄우기
![image](https://github.com/AhYoungJo/mvc_practice02/assets/125351416/7f5211b8-218c-412c-ae29-4fb99813ad89)

<br />

## 필수 설치 npm
	npm install express
    npm install ejs

node_modules와 package.json은 gitignore에 추가해줍니다.

- gitignore파일 생성
```
touch .gitignore
```
- .gitignore 예시
```gitigonore
    node_modules
    package-lock.json
    package.json
```
<br />

## 필수 cdn 'Axios'

index.ejs 부분에 aioxs cdn을 추가해줘야 사이트에서 볼 수 있습니다.
```ejs
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js">
</script>
```
<br />

(1) mvc 폴더 및 하위 파일 생성
-------------------------
<p style='color: gray;'>*파일 생성 또는 작업 순서는 개발자에 따라 달라질 수 있습니다.</p>

![image](https://github.com/AhYoungJo/mvc_practice02/assets/125351416/a937b901-b3cb-4a1d-97d5-61ed54f1c5e5)

## (2) server.js에서 서버 생성
```javascript
const express = require('express');
const app = express();
const PORT = 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', './views');

app.listen(PORT, () => {
	console.log(`http://localhost:${PORT}`);
});
```
<br />

## (3) model > users.js에 임시 데이터 생성
```js
const users = [
	{
		userid: 'alice',
		userpw: '1234',
	},
];
```
- 마지막 줄에 생성한 데이터를 외부에서도 사용할 수 있도록 내보내주는 코드 추가
```js
module.exports = users;
```
<br />

## (3) views > index.ejs에서 로그인 폼 작성

![image](https://github.com/AhYoungJo/mvc_practice02/assets/125351416/d487ea3c-103d-44e1-b29a-3f84640cabd7)

```ejs
<body>
	<h3>로그인 페이지</h3>
	<form>
	<fieldset>
		<legend>로그인</legend>
		<label for="id">아이디: </label>
		<input type="text" id="id" required />
		<label for="pw">비밀번호: </label>
		<input type="password" id="pw" required />
	</fieldset>
	<button type="button" onclick="loginPost()">로그인</button>
	</form>
	<div class="result"></div>
<body>
```
- `<body>`안에 `<script>`를 넣어서 `form`데이터를 전송하고, 백에서 데이터를 불러오기 위한 코드 추가
```javascript
<script>
function loginPost() {
  const resultBox = document.querySelector('.result');

  const data = {
    id: document.querySelector('#id').value,
    pw: document.querySelector('#pw').value,
  };

  axios({
    method: 'POST',
    url: '/check_login',
    data,
  }).then((res) => {
    console.log('res', res);
    const { success, message } = res.data;
    if (success) {
      resultBox.textContent = message;
      resultBox.style.color = 'blue';
    } else {
      resultBox.textContent = message;
      resultBox.style.color = 'red';
    }
  });
}
</script>
```
- 해당 부분은 백에서 받아온 데이터로 `success`와 `message`는 Controller에서 작업할 예정 
```ejs
const { success, message } = res.data;
  if (success) {
    resultBox.textContent = message;
    resultBox.style.color = 'blue';
  } else {
    resultBox.textContent = message;
    resultBox.style.color = 'red';
  }
```
<br />

## (4) controller > index.js에서 프론트 요청과 응답 코드 작성
```js
const users = require('../model/users');  // users 데이터 가져오기

const main = (req, res) => {
	res.render('index');
};

const check_login = (req, res) => {
	const { id, pw } = req.body;          // index.ejs의 form 데이터 가져오기

	if (users[0].userid === id && users[0].userpw === pw) {             // 만약 아이디와 비밀번호가 일치하면
		res.send({ success: true, message: 'Login successful' });   // scuess값은 true, message는 이와 같은 내용으로 저장해서 응답한다.
	} else {                                                            // 틀리면
		res.send({ success: false, message: 'Login failed' });      // success값은 false, message는 이와 같은 내용으로 저장해서 응답한다.
	}
};
```
- 외부에서도 위의 내용을 불러올 수 있도록 내보내주기
```js
module.exports = { main, check_login };
```
<br />

## (5) routes > index.js에서 라우터하기
- 라우터 전에 express와 router, controller를 각각 불러와야한다.
```js
const express = require('express');
const router = express.Router();
const controller = require('../controller');
```
- 라우터하기
```js
router.get('/', controller.main);
router.post('/check_login', controller.check_login);
```
- 내보내기
```js
module.exports = router;
```

## (6) 마지막으로 server.js에서 routes 불러오기 
- 기존 server.js 코드에 아래 코드를 추가해준다.
```js
const router = require('./routes');
app.use('/', router);
```
