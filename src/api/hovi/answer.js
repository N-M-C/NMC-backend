const constant = require('../../const/constant');
const request = require('request-promise');

// --- referenced from ETRI --
const openApiURL = process.env.OPEN_API_URL;

// access 키 받으면 넣으면 됨
const access_key = process.env.ACCESS_KEY;
const analysisCode = constant.analysis_code.code1;

async function getAnswer(req, res) {
  const { question } = req.query || {};
  const { questionAnalyzed } = {};
  
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
      headers: {'Content-Type':'application/json; charset=UTF-8'}
  };

 

  try {
      // category 추출 (특정 단어 포함 시)
      // category 에 따른 문장 분석,

      const data = await getData(options);
      const result = { data };
      
      //console.log(result.data);

      // --- Category 분류하기 --- 언제 다하냐...?
      for (var mor in result.data){

        if(result.data[mor].type=='NP'){
          if(result.data[mor].lemma=='어디'){
            console.log('CATEGORY: 위치');
          }else if(result.data[mor].lemma=='언제'){
            console.log('CATEGORY: 시간');
          }
        }
        if(result.data[mor].type=='NNG'){
          if(result.data[mor].lemma=='고장'){
            console.log('CATEGORY: 시설');
          }else if(result.data[mor].lemma=='소요'){
            console.log('CATEGORY: 시간');
          }else if(result.data[mor].lemma=='시간'){
            console.log('CATEGORY: 시간');
          }
        }
      }
      

      
  
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).send('fail');
  }
}

async function getData(options) {
  // Return new promise
  return new Promise(function(resolve, reject) {
    // Do async job
    request.post(options,  function (error, response, body) {
      const { return_object: {sentence} } = JSON.parse(body);
      const { morp } = sentence[0];
      resolve(morp);
   });
  })
}

// 예시
async function getAnswerByObject(req, res) {
  const { question } = req.query || {};
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

module.exports = { getAnswer, getAnswerByObject };
