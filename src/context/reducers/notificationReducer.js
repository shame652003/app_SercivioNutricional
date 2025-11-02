// context/reducers/notificationReducer.js

const initialState = {
    unreadCount: 0,
};

const notificationReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_UNREAD_COUNT':
            return { 
                ...state, 
                unreadCount: action.payload 
            };
        case 'INCREMENT_UNREAD_COUNT':
            return {
                ...state,
                unreadCount: state.unreadCount + 1
            };
        case 'DECREMENT_UNREAD_COUNT':
            return {
                ...state,
                unreadCount: Math.max(0, state.unreadCount - 1) 
            };
        default:
            return state;
    }
};

export default notificationReducer;