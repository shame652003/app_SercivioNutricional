import { combineReducers } from "redux";
import userReducer from "./userReducer";
import profileReducer from './profileReducer';
import notificationReducer from './notificationReducer'; 

const rootReducer = combineReducers({
    user: userReducer,
    profile: profileReducer, 
    notifications: notificationReducer, 
});

export default rootReducer;