const constant = require('../../const/constant');
const request = require('request-promise');

// --- referenced from ETRI --
const openApiURL = process.env.OPEN_API_URL;

// access 키 받으면 넣으면 됨
const access_key = process.env.ACCESS_KEY;
const analysisCode = constant.analysis_code.code1;

async function getAnswer(req, res) {
  const {
    question
  } = req.query || {};
  const {
    questionAnalyzed
  } = {};

  const purifiedQuestion = question.replace(/ /gi, '');

  // 일단 dummy 데이터
  const answer = {
    question: question,
    category: constant.facility,
    response: constant.hospitalInfo.address,
  }

  let requestJson = {
    'access_key': access_key,
    'argument': {
      'text': question,
      'analysis_code': analysisCode
    }
  };

  let options = {
    url: openApiURL,
    body: JSON.stringify(requestJson),
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    }
  };

  try {
    // category 추출 (특정 단어 포함 시)
    // category 에 따른 문장 분석,

    const data = await getData(options);
    const result = {
      data
    };

    //console.log(result.data);

    // 1. 시설 / 2. 위치 / 3. 시간 / 4. 요금 / 5. 증상 / 6. 지식 / 7. 그 외 (+일상대화)

    // --- Category 분류하기 --- 
    function classifyCategory() {
      return new Promise(function (resolve, reject) {
        for (var mor in result.data) {
          const morType = result.data[mor].type;
          const morLemma = result.data[mor].lemma;
          // 각각의 형태소 ( result.data[mor] )
          // NP(대명사)가 있으면 검사
          if (morType == 'NP' && morLemma == '어디') {
            resolve('location');
            break;
          }else if (morType == 'NP' && morLemma == '언제'){
            resolve('time');
            break;
          }
          // NNG(일반명사)가 있으면 검사
          else if (morType == 'NNG' && morLemma == '고장'){
            resolve('facility');
            break;
          }else if (morType == 'NNG' && morLemma == '소요'){
            resolve('time');
            break;
          }else if (morType == 'NNG' && morLemma == '시간'){
            resolve('time');
            break;
          }else if (morType == 'NNG' && morLemma == '요금'){
            resolve('fare');
            break;
          }
          // VV(동사)
          else if (morType == 'VV' && morLemma == '걸리'){
            resolve('fare');
            break;
          }
          // VA(형용사)
          else if (morType == 'VA' && morLemma == '아프'){
            resolve('symptom');
            break;
          }else if (morType == 'VA' && morLemma == '아픈'){
            resolve('symptom');
            break;
          }
          // XSN(명사파생접미사)
          else if (morType == 'XSN' && morLemma == '비'){
            resolve('fare');
            break;
          }
        }
        resolve('etc');
      });
    }


    // --- 분류한 Category에 대한 대답 --- 
    classifyCategory().then(function (morpCategory) {
      answer.category = morpCategory;
      switch (morpCategory) {
        case 'facility':
            answer.response = '시설관련 질문';
          break;
        
        // X-Ray, CT, MRI 등을 음성인식이 어떻게 인식하는지 봐야할 듯.
        // 위치같은 경우는 지도도 같이 띄워주면 좋을듯
        case 'location':
          if(purifiedQuestion.indexOf('편의시설')!=-1){
            answer.response = '본관인 경우 – 지하1층에 아티제, 우체국, 선물의 집, 신한은행, 안경점, 의료용품점, 이/미용실, 편의점, 식당, 등이 있습니다.\n암병원인 경우 – 지하1층에 선물의 집, 신한은행, 커피전문점, 편의점, 식당 등이 있습니다.';
          }else if(purifiedQuestion.indexOf('원무')!=-1){
            answer.response = '환자분들의 편의를 위하여 원무창구를 병원업계최초로 운영하고 있습니다.\n병동 내 1:1 전담 직원 상주로 입/퇴원수속, 중간 진료비 수납, 진료비 상담, 제증명 발급, 퇴원 후 외래 예약, 기타 제안 및 문의사항 가능합니다.\n위치는 각 병동 원무 창구에 있고 이용시간은 평일 08:30~17:00입니다.\n이외의 시간에는 1층 원무창구를 이용해주십시오.';
          }else if(purifiedQuestion.indexOf('엑스레이검사실')!=-1){
            answer.response = '엑스레이실은 어디 있나요?';
          }else if(purifiedQuestion.indexOf('CT검사실')!=-1){
            answer.response = 'CT 검사실은 본관 1층 응급실 맞은편에 있습니다.';
          }else if (purifiedQuestion.indexOf('MRI검사실')!=-1){
            answer.response = 'MRI 검사실은 본관 1층 응급실 맞은편에 있습니다.';
          }else if (purifiedQuestion.indexOf('휠체어')!=-1){
            answer.response = '휠체어는 간호사실 옆에 배치되어 있습니다.';
          }else if (purifiedQuestion.indexOf('정수기')!=-1){
            answer.response = '정수기는 각 병동 휴게실에 배치되어 있습니다.';
          }else if (purifiedQuestion.indexOf('MRI검사실')!=-1){
            answer.response = '본관 1층 응급실 맞은편에 있습니다.';
          }else if (purifiedQuestion.indexOf('병원')!=-1){
            answer.response = '여기는 서울특별시 강남구 일원로 81 (06351) 삼성서울병원입니다.';
          }else{
            answer.response = '어디를 말씀하는지 모르겠어요.. 다시 한 번 말씀해주세요!';
          }
          break;

        case 'time':
          // ~가 언제인가요?
          // ~하는데 소요시간이 얼마나 되나요?
          // ~하는데 얼마나 걸리죠?
          if(purifiedQuestion.indexOf('면회')!=-1){
            answer.response = '일반병동 – 평일 18:00~20:00 주말/공휴일 10:00~12:00, 18:00~20:00\n정신건강의학과 안정병동 – 화, 목, 주말, 공휴일 : 15:00~18:00\n본관/암병원 중환자실 : 매일 오전10:30~11:00 오후 19:30~20:00\n신생아중환자실 : 24시간 자율면회\n가입원실(응급실) : 매일 12:00~13:00, 18:00~19:00';
          }else if (purifiedQuestion.indexOf('퇴원')!=-1){
            answer.response = "퇴원 관련 문의는 담당 간호사에게 문의해주세요.\n초기메뉴의 '간호사에게 부탁하기' 기능을 사용하실 수 있습니다!";
          }else{
            answer.response = "어떤 걸 말씀하시는지 모르겠어요.. 다시 한 번 말씀해주세요!";
          }
          
          break;

        case 'fare':
          if(purifiedQuestion.indexOf('주차')!=-1){
            answer.response = '주차는 24시간 이내 시 (외래, 응급실, 입원/퇴원/수술) 은 1대 1회 무료이고 수납/방문예약은 2시간 무료입니다.\n나머지 시간은 주차요금이 부과됩니다.';
          }
          break;

        case 'symptom':
          answer.response = "증상 관련은 담당 간호사분께 말씀해주세요. \n초기 화면의 '간호사에게 부탁하기' 기능을 사용해주세요.";
          
          break;

        case 'knowledge':
          // 지식관련 질문...

          break;

        case 'etc':
          if(purifiedQuestion.indexOf('너')!=-1 && purifiedQuestion.indexOf('이름')!=-1){
            answer.response = '제 이름은 하비(HOVI)입니다! 여러분들의 편안한 병원생활을 위해 태어났어요~';
          }else{
            answer.response = '잘 못들었어요 ㅠㅠ 다시한번 말씀해주세요';
          }
          break;

        default:

          break;
      }
    });

    res.status(200).json(answer);

  } catch (err) {
    console.log(err);
    res.status(500).send('fail');
  }
}

async function getData(options) {
  // Return new promise
  return new Promise(function (resolve, reject) {
    // Do async job
    request.post(options, function (error, response, body) {
      const {
        return_object: {
          sentence
        }
      } = JSON.parse(body);
      const {
        morp
      } = sentence[0];
      resolve(morp);
    });
  })
}

// 예시
async function getAnswerByObject(req, res) {
  const {
    question
  } = req.query || {};
  const answer = {
    category: 'test category',
    question: question,
    response: 'test response'
  }

  try {
    res.status(200).json(answer);
  } catch (err) {
    res.status(500).send('fail');
  }
}

module.exports = {
  getAnswer,
  getAnswerByObject
};