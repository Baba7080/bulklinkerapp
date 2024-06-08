import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { RecoilRoot } from 'recoil';
import { store } from "./app/store"
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ChakraProvider >
    <BrowserRouter>
      <Provider store={store}>
        <RecoilRoot>
          <App />
        </RecoilRoot>
      </Provider>
    </BrowserRouter>
  </ChakraProvider>
);
