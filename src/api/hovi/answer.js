async function getAnswer(req, res) {
  const { question } = req.query || {};
  const { questionAnalyzed } = {};

  const answer = {
    question: question,
    category: '시설',
    response: '서울특별시 강남구 일원로 81 (06351) 삼성서울병원 입니다.'
  }

  // --- referenced from ETRI --
  var openApiURL = 'http://aiopen.etri.re.kr:8000/WiseNLU';
  // access 키 받으면 넣으면 됨
  var access_key = 'YOUR_ACCESS_KEY';
  var analysisCode = 'ANALYSIS_CODE';
  
  var requestJson = {
      'access_key': access_key,
      'argument': {
          'text': question,
          'analysis_code': analysisCode
      }
  };
  
  var request = require('request');
  var options = {
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
