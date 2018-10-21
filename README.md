# HOVI API Server :hospital:

## HOVI의 api 서버입니다.

사용한 라이브러리

- cors (cors 허용)
- dotenv (env 파일)
- express 
- helmet (보안)
- pino (빠른 로깅)
- body-parser
- nodemon (계속 서버를 띄우기 위함)

## HOW TO START
- npm install -g yarn (yarn 설치)
- yarn (패키지 설치)
- yarn dev (실행)

- yarn add "패키지명" (패키지 추가시)

## HOW TO USE
question을 query string으로 받아 추후 작업을 처리한다.

- REQUEST: http://localhost:3000/hovi/answer?question=dd
- RESPONSE: success: your question is dd

- REQUEST: 
http://localhost:3000/hovi/answerByObject?question=dd
- RESPONSE: 
```js
{
    category: 'test category',
    question: question,
    response: 'test response'
  }
```

## STRUCTURE

1. env
- 환경변수를 추가하고 싶으면 .env파일에 추가
- ex) PORT=3000

2. route
- nested 한 구조를 띄고 있음.
- src/server.js 부터 api 폴더 router => hovi 폴더 순서로 쭉 따라가면 된다. 
- app.use('/', router); -> 초기 진입점
- ex) localhost:3000/hovi/answer
- ex2) localhost:3000/hovi/answerByObject

3. utils
- 유틸로 따로 빼서 사용할 함수들을 담음

4. const
- 자주 쓰이는 상수들을 모아 놓음
- ex) name: HOVI
