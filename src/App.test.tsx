import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from './app/store';
import Home from './pages/Home';

test('renders learn react link', () => {
  const { getByText } = render(
    <Provider store={store}>
      <Home />
    </Provider>
  );

  expect(getByText(/Home/i)).toBeInTheDocument();
});
