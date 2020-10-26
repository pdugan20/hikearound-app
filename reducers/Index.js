import { combineReducers } from 'redux';

import authReducer from './Auth';
import hikeReducer from './Hike';
import userReducer from './User';
import mapReducer from './Map';
import modalReducer from './Modal';
import feedReducer from './Feed';

export default combineReducers({
    authReducer,
    hikeReducer,
    userReducer,
    mapReducer,
    modalReducer,
    feedReducer,
});
