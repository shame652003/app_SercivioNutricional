const initialState = {
  cedula: '',
  clave: '',
  nombre: '',
  apellido: '',
  correo: '',
  img: null,
  rol: '',
  nombrerol: '',
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
