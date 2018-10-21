import constant from '../../const/constant';

async function getAnswer(req, res) {
  const { question } = req.query || {};
  const { questionAnalyzed } = {};
  
  // 일단 dummy 데이터
  const answer = {
    question: question,
    category: constant.facility,
    response: constant.hospitalInfo.address,
  }
  // --- referenced from ETRI --
  const openApiURL = process.env.OPEN_API_URL;
  // access 키 받으면 넣으면 됨
  const access_key = process.env.ACCESS_KEY;
  const analysisCode = process.env.ANALYSIS_CODE;
  
  let requestJson = {
      'access_key': access_key,
      'argument': {
          'text': question,
          'analysis_code': analysisCode
      }
  };
  
  let request = require('request');
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
