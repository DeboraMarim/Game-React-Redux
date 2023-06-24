import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';
import Feedback from '../Pages/Feedback';
import App from '../App';
import { renderWithRouterAndRedux } from './helpers/renderWithRouterAndRedux';

describe('Teste do componente Feedback.js', () => {
  it('deve renderizar os componentes corretamente', () => {
    const { history } = renderWithRouterAndRedux(<Feedback />);
    const header = screen.getByTestId('header-player-name');
    const feedback = screen.getByTestId('feedback-text');

    expect(feedback).toHaveTextContent('Could be better...');
    expect(header).toBeInTheDocument();
    expect(feedback).toBeInTheDocument();
  });
  
  it('deve exibir a mensagem "Well Done!" em caso de muitos acertos', async () => {
    const { store, history } = renderWithRouterAndRedux(<App />);
    store.getState().player.assertions = 5;
    act(() => {
      history.push('/feedback');
    })
    await waitFor(() => {
      const feedback = screen.getByTestId('feedback-text');
      expect(feedback).toHaveTextContent('Well Done!');
    }, 2000);

  });
  
  it('deve permitir que o usuário jogue novamente ao clicar no botão "Play Again"', async() => {
    const { history } = renderWithRouterAndRedux(<App />);
    act(() => {
      history.push('/feedback');
    });
    expect(history.location.pathname).toBe('/feedback')
    await waitFor(() => {
      const playAgainButton = screen.getByTestId('btn-play-again');
      userEvent.click(playAgainButton);
      expect(history.location.pathname).toBe('/')
    }, 2000);
  })
  
  it('deve redirecionar o usuário para a página de ranking ao clicar no botão "Ranking"', async() => {
    const { history } = renderWithRouterAndRedux(<App />);
    act(() => {
      history.push('/feedback');
    });
    expect(history.location.pathname).toBe('/feedback')
    await waitFor(() => {
      const rankingButton = screen.getByTestId('btn-ranking');
      userEvent.click(rankingButton);
      expect(history.location.pathname).toBe('/ranking')
    }, 2000);
  })
});
