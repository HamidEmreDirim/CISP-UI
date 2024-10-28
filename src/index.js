import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from "react-router-dom";

// core styles
import "./scss/volt.scss";

// vendor styles
import "react-datetime/css/react-datetime.css";

import HomePage from "./pages/HomePage";

ReactDOM.render(
  <HashRouter>
    <HomePage />
  </HashRouter>,
  document.getElementById("root")
);
