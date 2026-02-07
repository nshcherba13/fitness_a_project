import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App.js';

test('renders Welcome to the club text', () => {
    render(
        <BrowserRouter>
            <App />
        </BrowserRouter>
    );
    const welcomeElement = screen.getByText(/Welcome to the club/i);
    expect(welcomeElement).toBeInTheDocument();
});
