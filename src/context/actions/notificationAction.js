
export const setUnreadCount = (count) => {
    return {
        type: 'SET_UNREAD_COUNT',
        payload: count,
    };
};

export const incrementUnreadCount = () => {
    return {
        type: 'INCREMENT_UNREAD_COUNT',
    };
};

export const decrementUnreadCount = () => {
    return {
        type: 'DECREMENT_UNREAD_COUNT',
    };
};