import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import md5 from 'crypto-js/md5';
import '../styles/header.css';

class Header extends Component {
  render() {
    const { name, email, score } = this.props;
    return (
      <div className="header-content">
        <p data-testid="header-player-name" className="name">{ name }</p>
        <p data-testid="header-score" className="score">{ score }</p>
        <img
          src={ `https://www.gravatar.com/avatar/${md5(email).toString()}` }
          alt="teste"
          data-testid="header-profile-picture"
        />
      </div>
    );
  }
}

Header.propTypes = {
  name: PropTypes.string,
  email: PropTypes.string,
  score: PropTypes.number,
}.isRequired;

const mapStateToProps = (state) => ({
  email: state.user.email,
  name: state.user.name,
  score: state.player.score,
});

export default connect(mapStateToProps)(Header);
