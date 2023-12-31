import {createStore,applyMiddleware,compose} from 'redux' //to use redux
import thunk from 'redux-thunk';
import rootReducer from '../redux/reducers/index'




const initialState = {};

const middleware = [thunk]

const store = createStore(
  rootReducer,
 initialState,
 compose(
  applyMiddleware(...middleware),
  window.__REDUX_DEVTOOLS_EXTENSION__&&window.__REDUX_DEVTOOLS_EXTENSION__()
 )
 );

 
 
export default store ;