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

## 형태소 태그 분류
1. 체언
  - 명사(NN)
    - 일반명사(NNG)
    - 고유명사(NNP)
    - 의존명사(NNB)
  - 대명사(NP) 
    - 대명사(NP)
  - 수사(NR) 
    - 수사(NR)
2. 용언
  - 동사(VV) 
    - 동사(VV)
  - 형용사(VA) 
    - 형용사(VA)
  - 보조용언(VX) 
    - 보조용언(VX)
  - 지정사(VC)
    - 긍정지정사(VCP)
    - 부정지정사(VCN)
3. 수식언
  - 관형사(MM)
    - 성상 관형사(MMA)
    - 지시 관형사(MMD)
    - 수 관형사(MMN)
  - 부사(MA)
    - 일반부사(MAG)
    - 접속부사(MAJ)
4. 독립언 
  - 감탄사(IC) 
    - 감탄사(IC)
5. 관계언 
  - 격조사(JK)
    - 주격조사(JKS)
    - 보격조사(JKC)
    - 관형격조사(JKG) 
    - 목적격조사(JKO)
    - 부사격조사(JKB)
    - 호격조사(JKV)
    - 인용격조사(JKQ)
  - 보조사(JX) 
    - 보조사(JX)
  - 접속조사(JC) 
    - 접속조사(JC)
6. 의존형태
  - 어미(EM)
    - 선어말어미(EP)
    - 종결어미(EF)
    - 연결어미(EC)
    - 명사형전성어미(ETN)
    - 관형형전성어미(ETM)
  - 접두사(XP) 
    - 체언접두사(XPN)
  - 접미사(XS)
    - 명사파생접미사(XSN)
    - 동사파생접미사(XSV)
    - 형용사파생접미사(XSA)
  - 어근(XR) 
    - 어근(XR)
7. 기호
  - 일반기호(ST)
    마침표,물음표,느낌표(SF)
    쉼표,가운뎃점,콜론,빗금(SP)
    따옴표, 괄호표, 줄표(SS)
    줄임표(SE)
    붙임표(물결)(SO)
    기타 기호(SW)
  - 외국어(SL) 
    - 외국어(SL)
  - 한자(SH) 
    - 한자(SH)
  - 숫자(SN) 
    - 숫자(SN)
  - 분석불능범주(NA) 
    - 분석불능범주(NA) 