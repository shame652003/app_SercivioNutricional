import { useSelector, useDispatch } from 'react-redux';
import { updateProfile } from '../context/actions/profileActions';

export default function useProfile() {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile);

  const handleUpdateProfile = (field, value) => {
    dispatch(updateProfile({ [field]: value }));
  };

  return {
    profile,
    handleUpdateProfile,
  };

  
}
