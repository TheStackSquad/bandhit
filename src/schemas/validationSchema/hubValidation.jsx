import * as Yup from 'yup';

export const hubValidationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  description: Yup.string().required('Description is required'),
  category: Yup.string().oneOf(['Vendor', 'Entertainer'], 'Invalid category').required(),
  image: Yup.string().url('Invalid image URL').required(),
});
