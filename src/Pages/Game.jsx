import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as sanitizeHtml from 'sanitize-html';
import Header from '../components/Header';
import '../styles/game.css';
import AnswerTimer from '../components/AnswerTimer';
import { addScore, addAssertions } from '../Redux/Actions';

const INITIAL_STATE = {
  questions: [],
  options: [],
  correctAnswer: [],
  questionId: 0,
  category: [],
  difficulty: [],
  responseAPI: false,
  color: '',
  nextButton: false,
};

class Game extends Component {
  state = {
    ...INITIAL_STATE,
  };

  componentDidMount() {
    this.getQuestions();
  }

  getQuestions = async () => {
    const token = localStorage.getItem('token');
    const data = await fetch(`https://opentdb.com/api.php?amount=5&token=${token}`)
      .then((response) => response.json())
      .then((conteudo) => conteudo);
    const responseFail = 3;
    if (data.response_code === responseFail) {
      const { history } = this.props;
      localStorage.removeItem('token');
      history.push('/');
    }
    this.setState({
      questions: data.results.map((result) => result.question),
      options: data.results.map((result) => {
        const number = 0.5;
        return [
          result.correct_answer,
          ...result.incorrect_answers].sort(() => Math.random() - number);
      }),
      difficulty: data.results.map((result) => result.difficulty),
      correctAnswer: data.results.map((result) => result.correct_answer),
      category: data.results.map((result) => result.category),
      responseAPI: true,
    });
  };

  changeColor = (e) => {
    const { target } = e;
    const { correctAnswer } = this.state;
    const { id, innerHTML } = target;
    if (innerHTML === correctAnswer[id]) {
      e.currentTarget.classList.add('green');
      this.setState({ color: 'green' });
    } else {
      e.currentTarget.classList.add('red');
      this.setState({ color: 'red' });
    }
  };

  teste = (boolean) => {
    const { color } = this.state;
    if (color === 'green' && boolean) {
      return 'green';
    }
    if (color === 'green' && !boolean) {
      return 'red';
    }
    if (color === 'red' && boolean) {
      return 'green';
    }
    if (color === 'red' && !boolean) {
      return 'red';
    }
  };

  renderNextButton = () => {
    this.setState({
      nextButton: true,
    });
  };

  renderNextQuestion = () => {
    const { questionId } = this.state;
    const { history } = this.props;
    const magicNumber = 10;
    const maxIndex = 4;
    if (questionId === maxIndex) {
      history.push('/feedback');
    }
    this.setState({
      nextQuestion: true,
      questionId: questionId + 1,
      color: '',
      nextButton: false,
    });
    setTimeout(() => {
      this.setState({ nextQuestion: false });
    }, magicNumber);
  };

  alteraPlacar = ({ target }) => {
    const { id } = target;
    const { correctAnswer, difficulty } = this.state;
    const { dispatch, seconds } = this.props;
    if (target.innerHTML === correctAnswer[id]) {
      let assertion = 0;
      let counter = 0;
      const multiple = 3;
      const minimumScore = 10;
      switch (difficulty[id]) {
      case 'hard':
        counter = minimumScore + (seconds * multiple);
        assertion += 1;
        break;
      case 'medium':
        counter = minimumScore + (seconds * 2);
        assertion += 1;
        break;
      case 'easy':
        counter = minimumScore + (seconds * 1);
        assertion += 1;
        break;
      default:
        break;
      }
      dispatch(addScore(counter));
      dispatch(addAssertions(assertion));
    }
  };

  render() {
    const {
      questions,
      options,
      correctAnswer,
      questionId,
      responseAPI,
      category,
      nextButton,
      nextQuestion } = this.state;
    const { isDisabled } = this.props;
    const clean = sanitizeHtml(questions[questionId]);
    return (
      <div className="game-content">
        <Header />
        <form className="form-content">
          <h3
            data-testid="question-category"
          >
            { category[questionId] }
          </h3>
          {responseAPI && <AnswerTimer disabled={ nextButton } next={ nextQuestion } />}
          <h2
            data-testid="question-text"
            className="question-input"
            dangerouslySetInnerHTML={ { __html: clean } }
          />
          {responseAPI && (
            <div data-testid="answer-options" className="answers">
              {
                options[questionId]
                  .map((question, index) => {
                    const questionCleaned = sanitizeHtml(question);
                    return (
                      <button
                        key={ index }
                        data-testid={
                          question === correctAnswer[questionId]
                            ? 'correct-answer'
                            : `wrong-answer-${index - 1}`
                        }
                        id={ questionId }
                        className={ `answers-btn ${
                          this.teste(question === correctAnswer[questionId])}` }
                        onClick={ (e) => {
                          e.preventDefault();
                          this.changeColor(e);
                          this.renderNextButton();
                          this.alteraPlacar(e);
                        } }
                        disabled={ isDisabled }
                        aria-label="questions"
                        dangerouslySetInnerHTML={ { __html: questionCleaned } }
                      />
                    );
                  })
              }
            </div>)}
          {nextButton && (
            <button
              data-testid="btn-next"
              onClick={ (e) => {
                e.preventDefault();
                this.renderNextQuestion();
              } }
              className="next-btn"
            >
              Next
            </button>)}
        </form>
      </div>
    );
  }
}

Game.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  isDisabled: PropTypes.bool,
}.isRequired;

const mapStateToProps = (state) => ({
  isDisabled: state.user.isDisabled,
  score: state.player.score,
  seconds: state.player.seconds,
});

export default connect(mapStateToProps)(Game);
