
async function getAnswer(req, res) {
  const { question } = req.query || {};
  try {
    res.status(200).send(`success: your question is ${question}`);
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
