import React, { Component } from 'react';
import Word from './Word';
import ListenerButton from './ListenerButton';

import '../css/App.css';

class App extends Component {
  state = {
    show: false,
    listening: false,
    text: "Sorry, can't hear",
  };

  componentDidMount() {
    const Recognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!Recognition) {
      alert(
        '이 브라우저에서는 지원하지 않습니다. 크롬 브라우저를 사용해주세요.'
      );
      return;
    }

    this.recognition = new Recognition();
    // en-US , ko-KR
    this.recognition.lang = process.env.REACT_APP_LANGUAGE || 'ko-KR';
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;

    // on Start
    this.recognition.onstart = () => {
      console.log('mode) onstart')
      this.setState({
        listening: true,
      });
    };

    // 텍스트
    this.recognition.onresult = event => {
      const text = event.results[0][0].transcript;
      console.log('mode) transcript', text);
      this.setState({ text });
    };

    // stopped
    this.recognition.onspeechend = () => {
      console.log('mode) stopped');
      this.setState({ show: true });
    };

    // end
    this.recognition.onend = () => {
      console.log('mode) end');
      this.setState({
        listening: false,
      });
      this.end();
    };

    // no match
    this.recognition.onnomatch = event => {
      console.log('mode) no match');
      this.setState({ text: "인식하지 못하였습니다.\n다시 한번 시도해주세요." });
    };

    // error
    this.recognition.onerror = event => {
      console.log('error', event);
      this.setState({
        show: true,
        text: event.error,
      });
    };
  }

  start = () => {
    this.recognition.start();
  };

  end = () => {
    this.recognition.stop();
  };

  handleClose = () => {
    this.setState({ show: false });
  };

  render() {
    return (
      <main className="demo-1">
        {this.state.show ? (
          <Word text={this.state.text} onClose={this.handleClose} />
        ) : (
          <ListenerButton
            onStart={this.start}
            onEnd={this.end}
            disabled={this.state.listening}
            buttonText={
              this.state.listening ? '듣고 있습니다...' : '무엇이 궁금하세요?'
            }
          />
        )}
      </main>
    );
  }
}

export default App;
