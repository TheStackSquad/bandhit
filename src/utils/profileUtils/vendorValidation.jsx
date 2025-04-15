// src/utils/vendorValidation.jsx

import * as Yup from 'yup';

export const vendorValidation = Yup.object().shape({
  business_name: Yup.string().required('Business name is required'),
  business_categories: Yup.array()
    .of(Yup.string())
    .min(1, 'At least one category is required')
    .max(3, 'Maximum of 3 categories allowed'),
  address: Yup.string().required('Address is required'),
  description: Yup.string().required('Description is required'),
  phone: Yup.string().required('Phone number is required'),
  twitter: Yup.string().url('Invalid Twitter URL').nullable(),
  facebook: Yup.string().url('Invalid Facebook URL').nullable(),
  instagram: Yup.string().url('Invalid Instagram URL').nullable(),
  cover_image_url: Yup.string().required('Cover image is required'),
  cover_image_public_id: Yup.string().required('Image ID is required for tracking'),
});

 
export const artistValidation = Yup.object().shape({
  artist_name: Yup.string().required(' Name is required'),
  genre: Yup.array()
    .of(Yup.string())
    .min(1, 'At least one genre is required')
    .max(3, 'Maximum of 3 genres allowed'),
  address: Yup.string().required('Address is required'),
  bio: Yup.string().required('Bio is required'),
  phone: Yup.string().required('Phone number is required'),
  twitter: Yup.string().url('Invalid Twitter URL').nullable(),
  facebook: Yup.string().url('Invalid Facebook URL').nullable(),
  instagram: Yup.string().url('Invalid Instagram URL').nullable(),
  cover_image_url: Yup.string().required('Cover image is required'),
  cover_image_public_id: Yup.string().required('Image ID is required for tracking'),
});
