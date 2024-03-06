import React from 'react';
import { Route, Routes, Link } from 'react-router-dom';

const ProtectedRoute = ({ isAuthenticated, ...props }) => {
  return !isAuthenticated ? <Link to={props.path === "/signup" ? "/signup" : "/signin"} /> : <Routes><Route {...props} /></Routes>;
};

export default ProtectedRoute;

