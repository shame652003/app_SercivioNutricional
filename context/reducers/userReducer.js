const initialState = {
  user: null,
  loading: false,
  error: null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'USER_LOADING':
      return { ...state, loading: true, error: null };
    case 'USER_SUCCESS':
      return { ...state, loading: false, user: action.payload, error: null };
    case 'USER_ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default userReducer;
