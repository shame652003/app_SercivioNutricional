import { useSelector, useDispatch } from 'react-redux';
import { updateProfile } from '../context/actions/profileActions';
import { API_URL} from '@env';

export default function useProfile() {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile);
  const profileImage = profile.img ? `${API_URL}${profile.img}` : null;

  const handleUpdateProfile = (field, value) => {
    dispatch(updateProfile({ [field]: value }));
  };



  return {
    profile,
    profileImage,
    handleUpdateProfile,
  };
}
