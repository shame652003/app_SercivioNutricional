const initialState = {
    cedula: '12345678',
    clave:'Uptaeb123*',
    name: 'Admin',
    lastName: 'Flores',
    email: 'servicionutricional2024@gmail.com',
    profileImage: null,
  };
  
  const profileReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'UPDATE_PROFILE':
        return { ...state, ...action.payload };
      default:
        return state;
    }
  };
  
  export default profileReducer;
  