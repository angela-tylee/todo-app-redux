import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import './assets/scss/style.scss';
import { store } from './store/store'
import { Provider } from 'react-redux'

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
