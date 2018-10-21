
async function getAnswer(req, res) {
  const { question } = req.body;
  try {
    res.status(200).send(`success: your question is ${question}`);
  } catch (err) {
    res.status(500).send('fail');
  }
}
module.exports = { getAnswer };
