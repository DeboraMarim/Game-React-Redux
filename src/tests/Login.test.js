import React from 'react';
import userEvent from '@testing-library/user-event';
import { screen, waitFor } from '@testing-library/react';
import App from '../App';
import { renderWithRouterAndRedux } from './helpers/renderWithRouterAndRedux';

// jest.mock('../Redux/Actions', () => ({
//   addEmail: jest.fn(),
//   addName: jest.fn(),
// }));
const gravatar = 'input-gravatar-email';
describe('Login', () => {
  it('deve renderizar o componente corretamente', () => {
    const { getByTestId } = renderWithRouterAndRedux(<App />);
    expect(getByTestId('input-player-name')).toBeInTheDocument();
    expect(getByTestId(gravatar)).toBeInTheDocument();
    expect(getByTestId('btn-play')).toBeInTheDocument();
    expect(getByTestId('btn-settings')).toBeInTheDocument();
  });
  it('verificação de renderização da page Game após click', async () => {
    const { history } = renderWithRouterAndRedux(<App />);
    const nameInput = screen.getByRole('textbox', { name: /name/i });
    const emailInput = screen.getByTestId(gravatar);

    userEvent.type(nameInput, 'User');
    userEvent.type(emailInput, 'user@email.com');
    const playButton = screen.getByRole('button', { name: /play/i });

    userEvent.click(playButton);

    await waitFor(() => {
      expect(history.location.pathname).toBe('/game');
    });
  });
  it('verificação de renderização da page Config após click', async () => {
    const { history } = renderWithRouterAndRedux(<App />);
    const configButton = screen.getByRole('button', { name: /configurações/i });
    expect(configButton).toBeInTheDocument();
    userEvent.click(configButton);
    await waitFor(() => {
      expect(history.location.pathname).toBe('/config');
    });
  });
});
