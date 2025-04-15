// src/utils/artistValidation.jsx
import * as Yup from 'yup';

export const artistValidation = Yup.object().shape({
  stageName: Yup.string().required('Stage name is required'),
  artistCategories: Yup.array()
    .of(Yup.string())
    .min(1, 'At least one category is required')
    .max(3, 'Maximum of 3 categories allowed'),
  genre: Yup.string().required('Genre is required'),
  address: Yup.string().required('Address is required'),
  description: Yup.string().required('Description is required'),
  phone: Yup.string().required('Phone number is required'),
  twitter: Yup.string().url('Invalid Twitter URL'),
  facebook: Yup.string().url('Invalid Facebook URL'),
  instagram: Yup.string().url('Invalid Instagram URL'),
  profileImage: Yup.mixed().required('Profile image is required'),
});