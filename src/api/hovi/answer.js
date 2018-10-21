async function getAnswer(req, res) {
  const { question } = req.query || {};
  const { questionAnalyzed } = {};

  const answer = {
    category: 'cate',
    question: question,
    response: 'res'
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
