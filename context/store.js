import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import profileReducer from './reducers/profileReducer';

const rootReducer = combineReducers({
  profile: profileReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
