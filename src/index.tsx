import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { createRoot } from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import App from './App';
import { store } from './app/store';
import PageLayout from './layouts/PageLayout';

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <Provider store={store}>
      <PageLayout>
        <App/>
      </PageLayout>   
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
