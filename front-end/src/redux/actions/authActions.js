import axios from 'axios';
import { GET_ERRORS, SET_CURRENT_USER } from './types';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode'

// Register user
export const registerUser = (userData, navigate) => (dispatch) => {
  axios
    .post('/api/users/register', userData)
    .then((res) => navigate('/login'))
    .catch((err) => {
      let errors = {};
      if (err.response && err.response.data) { // Check if err.response and err.response.data exist
        errors = err.response.data;
      }
      dispatch({
        type: GET_ERRORS,
        payload: errors,
      });
    });
}

 
//get user token

export const loginUser = userData => dispatch => {
  axios 
  .post('/api/users/login',userData)
  .then(res=>{
    //save to local storage
    const {token} = res.data;
    localStorage.setItem('jwtToken', token);
    //set token to Auth header
    setAuthToken(token); // will create this function in utils folder and import from it
    //decode token to get user data
    const decoded = jwt_decode(token);
    //set the current user
    dispatch(setCurrentUser(decoded));
  })
  .catch(err => {
    let errors = {};
    if (err.response && err.response.data) { // Check if err.response and err.response.data exist
      errors = err.response.data;
    }
    dispatch ({
      type: GET_ERRORS,
      payload: errors,
    });
  });
}

//set logged in user
export  const setCurrentUser =(decoded) => {
  return {
    type:SET_CURRENT_USER,
    payload:decoded
  }
}