import {combineReducers} from "redux"
import userReducer from "./userReducer";

const rootReducer = combineReducers({
    counter: userReducer,
})

export default rootReducer;
