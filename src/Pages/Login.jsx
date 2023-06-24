import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addEmail, addName } from '../Redux/Actions';
import logo from '../trivia.png';
import '../styles/login.css';

class Login extends Component {
  state = {
    email: '',
    name: '',
    isDisable: true,
  };

  validation = () => {
    const { name, email } = this.state;
    const number = 0;
    const emailRegex = /^[\w+.]+@\w+\.com$/;
    const pass = name.length > number && emailRegex.test(email);
    this.setState({
      isDisable: !pass,
    });
  };

  handleChange = ({ target }) => {
    const { id, value } = target;
    this.setState({
      [id]: value,
    }, () => this.validation());
  };

  getToken = async () => {
    const token = await fetch('https://opentdb.com/api_token.php?command=request');
    const theToken = await token.json();
    this.saveInLocalStorage(theToken.token);
    return theToken.token;
  };

  saveInLocalStorage = (value) => {
    localStorage.setItem('token', value);
  };

  render() {
    const { email, name, isDisable } = this.state;
    const { dispatch, history } = this.props;
    return (
      <div className="login-content">
        <img src={ logo } className="App-logo" alt="logo" />
        <form className="form-content">
          <label htmlFor="name">
            Name:
            {' '}
            <input
              data-testid="input-player-name"
              type="text"
              id="name"
              name={ name }
              onChange={ this.handleChange }
              className="name-input"
            />
          </label>
          <label htmlFor="email">
            Email:
            {' '}
            <input
              data-testid="input-gravatar-email"
              type="email"
              name={ email }
              id="email"
              onChange={ this.handleChange }
              className="email-input"
              autoComplete="off"
            />
          </label>
          <div className="btn-inputs">
            <button
              data-testid="btn-play"
              disabled={ isDisable }
              onClick={ async (e) => {
                e.preventDefault();
                dispatch(addEmail(email));
                dispatch(addName(name));
                await this.getToken();
                history.push('/game');
              } }
              className="play-btn"
            >
              Play

            </button>
            <button
              type="button"
              data-testid="btn-settings"
              onClick={ () => {
                history.push('/config');
              } }
              className="config-btn"
            >
              Configurações

            </button>
          </div>
        </form>

      </div>
    );
  }
}

Login.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  dispatch: PropTypes.func,
}.isRequired;

export default connect(null)(Login);
