# HOVI API Server :hospital:
```
open ai api를 활용해 질문의 구문 분석을 통해 알맞은 대답을 응답해주는 서버를 구축한다.
```
## HOVI의 api 서버입니다.

사용한 라이브러리

- cors (cors 허용)
- dotenv (env 파일)
- express 
- helmet (보안)
- pino (빠른 로깅)
- body-parser
- nodemon (계속 서버를 띄우기 위함)
- request (http 요청)

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

## CATEGORY OF QUESTION

- 시설
  keyword: '고장'

- 위치
  keyword: '어디'

- 시간
  keyword: '언제'

- 요금
  keyword: '얼마'

- 증상

- 일상

- 기타

## Analysis Code in ETRI

요청할 분석 코드로서 요청할 수 있는 분석 요청은 아래와 같음
형태소 분석 : “morp”,
어휘의미 분석 (동음이의어 분석) : “wsd”
어휘의미 분석 (다의어 분석) : “wsd_poly”
개체명 인식 : “ner”
의존 구문 분석 : “dparse”
의미역 인식 : “srl”