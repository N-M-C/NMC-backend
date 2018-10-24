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

    // 1. 시설 / 2. 위치 / 3. 시간 / 4. 요금 / 5. 증상 / 6. 일상대화 / 7. 그 외

    // --- Category 분류하기 --- 
    function classifyCategory() {
      return new Promise(function (resolve, reject) {
        for (var mor in result.data) {
          // 각각의 형태소 ( result.data[mor] )
          
          // NP (대명사)가 있으면 검사
          if (result.data[mor].type == 'NP') {
            if (result.data[mor].lemma == '어디') {
              resolve(2);
              break;
            } else if (result.data[mor].lemma == '언제') {
              resolve(3);
              break;
            }
          }

          if (result.data[mor].type == 'NNG') {
            if (result.data[mor].lemma == '고장') {
              resolve(1);
              break;
            } else if (result.data[mor].lemma == '소요') {
              resolve(3);
              break;
            } else if (result.data[mor].lemma == '시간') {
              resolve(3);
              break;
            }
          }
        }
      });
    }


    // --- 분류한 Category에 대한 대답 --- 
    classifyCategory().then(function (morpCategory) {
      console.log('category:', morpCategory);
      switch (morpCategory) {
        case 1:

          break;
        
        // X-Ray, CT, MRI 등을 음성인식이 어떻게 인식하는지 봐야할 듯.
        // 위치같은 경우는 지도도 같이 띄워주면 좋을듯
        case 2:
          if(question.replace(/ /gi, '').indexOf('편의시설')!=-1){
            console.log('본관인 경우 – 지하1층에 아티제, 우체국, 선물의 집, 신한은행, 안경점, 의료용품점, 이/미용실, 편의점, 식당, 등이 있습니다.\n암병원인 경우 – 지하1층에 선물의 집, 신한은행, 커피전문점, 편의점, 식당 등이 있습니다.');
          }else if(question.replace(/ /gi, '').indexOf('원무')!=-1){
            console.log('환자분들의 편의를 위하여 원무창구를 병원업계최초로 운영하고 있습니다.\n병동 내 1:1 전담 직원 상주로 입/퇴원수속, 중간 진료비 수납, 진료비 상담, 제증명 발급, 퇴원 후 외래 예약, 기타 제안 및 문의사항 가능합니다.\n위치는 각 병동 원무 창구에 있고 이용시간은 평일 08:30~17:00입니다.\n이외의 시간에는 1층 원무창구를 이용해주십시오.');
          }else if(question.replace(/ /gi, '').indexOf('엑스레이검사실')!=-1){
            console.log('엑스레이실은 어디 있나요?');
          }else if(question.replace(/ /gi, '').indexOf('CT검사실')!=-1){
            console.log('CT 검사실은 본관 1층 응급실 맞은편에 있습니다.');
          }else if (question.replace(/ /gi, '').indexOf('MRI검사실')!=-1){
            console.log('MRI 검사실은 본관 1층 응급실 맞은편에 있습니다.');
          }else if (question.replace(/ /gi, '').indexOf('휠체어')!=-1){
            console.log('휠체어는 간호사실 옆에 배치되어 있습니다.');
          }else if (question.replace(/ /gi, '').indexOf('정수기')!=-1){
            console.log('정수기는 각 병동 휴게실에 배치되어 있습니다.');
          }else if (question.replace(/ /gi, '').indexOf('MRI검사실')!=-1){
            console.log('본관 1층 응급실 맞은편에 있습니다.');
          }else{
            console.log('어디를 말씀하는지 모르겠어요.. 다시한번 말씀해주세요!');
          }
          break;

        case 3:
          // ~가 언제인가요?
          // ~하는데 소요시간이 얼마나 되나요?
          // ~하는데 얼마나 걸리죠?
          
          break;

        case 4:

          break;

        case 5:

          break;

        case 6:

          break;

        case 7:

          break;

        default:

          break;
      }
    });

    res.status(200).json(result);

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