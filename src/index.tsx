import 'mapbox-gl/dist/mapbox-gl.css';

import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter,
  createBrowserRouter,
  Route,
  RouterProvider,
  Routes,
} from "react-router-dom";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ErrorBoundary from './ErrorBoundary';
import Admin from './Admin';
// import dotenv from 'dotenv'

// dotenv.config()
const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    errorElement: <ErrorBoundary/>
  },
  {
    path: "/address/:addressSearch",
    element: <App/>,
    errorElement: <ErrorBoundary/>
  },
  {
    path: "/search/:query",
    element: <App/>,
    errorElement: <ErrorBoundary/>
  },
  {
    path: "/organize",
    element: <App organize={true}/>,
    errorElement: <ErrorBoundary/>
  },
  {
    path: "/admin",
    element: <Admin/>
  }
]);


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  // <React.StrictMode>
    <RouterProvider router={router} />
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
