import axios from 'axios';
import { GET_ERRORS, SET_CURRENT_USER } from './types';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';

// Register user
export const registerUser = (userData, navigate) => (dispatch) => {
  axios
    .post('/api/users/register', userData)
    .then((res) => navigate('/login'))
    .catch((err) => {
      let errors = {};
      if (err.response && err.response.data) {
        errors = err.response.data;
      }
      dispatch({
        type: GET_ERRORS,
        payload: errors,
      });
    });
};

// Login user
export const loginUser = (userData) => (dispatch) => {
  axios
    .post('/api/users/login', userData)
    .then((res) => {
      const { token } = res.data;
      // Save token to local storage
      localStorage.setItem('jwtToken', token);
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      // Set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch((err) => {
      let errors = {};
      if (err.response && err.response.data) {
        errors = err.response.data;
      }
      dispatch({
        type: GET_ERRORS,
        payload: errors,
      });
    });
};

// Set logged in user
export const setCurrentUser = (decoded) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded,
  };
};

// Logout user
export const logoutUser = () => (dispatch) => {
  // Remove token from local storage
  localStorage.removeItem('jwtToken');
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};