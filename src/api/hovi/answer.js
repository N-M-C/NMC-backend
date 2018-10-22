const constant = require('../../const/constant');
const request = require('request');

// --- referenced from ETRI --
// const openApiURL = process.env.OPEN_API_URL;
const openApiURL = constant.open_api_info.open_api_url;

// const access_key = process.env.ACCESS_KEY;
const access_key = constant.open_api_info.access_key;
const analysisCode = constant.analysis_code.code1;

async function getAnswer(req, res) {
  const { question } = req.query || {};
  var { questionAnalyzed } = {};
  
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
  
  request.post(options, function (error, response, body) {
      console.log('responseCode = ' + response.statusCode);
      console.log('responseBody = ' + body);
  });

  // category 추출 (특정 단어 포함 시)

  // category 에 따른 문장 분석, 

  try {
    //res.status(200).send(`success: your question is ${question}`);
    res.status(200).json(answer);
  } catch (err) {
    res.status(500).send('fail');
  }
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
