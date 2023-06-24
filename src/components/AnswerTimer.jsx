import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { disableButton, timerSecondToScore } from '../Redux/Actions';

class AnswerTimer extends Component {
  state = {
    seconds: 30,
  };

  componentDidMount() {
    this.timer();
  }

  componentDidUpdate(nextProps) {
    if (nextProps.next === true) {
      this.resetCouter();
      this.timer();
    }
  }

  timer = () => {
    const second = 1000;
    this.interval = setInterval(() => {
      this.resumeCounter();
      this.pauseCounter();
    }, second);
  };

  resumeCounter = () => {
    const { seconds } = this.state;
    this.setState({ seconds: seconds - 1 }, this.disableButtons);
  };

  pauseCounter = () => {
    const { disabled, dispatch } = this.props;
    const { seconds } = this.state;
    if (disabled) {
      dispatch(timerSecondToScore(seconds));
      clearInterval(this.interval);
    }
  };

  resetCouter = () => {
    this.setState({ seconds: 30 });
  };

  disableButtons = () => {
    const { dispatch } = this.props;
    const { seconds } = this.state;
    if (seconds === 0) {
      clearInterval(this.interval);
      dispatch(disableButton());
    }
  };

  render() {
    const { seconds } = this.state;
    return (
      <div className="timer-content">{ seconds }</div>
    );
  }
}

AnswerTimer.propTypes = {
  dispatch: PropTypes.func,
}.isRequired;

export default connect(null)(AnswerTimer);
