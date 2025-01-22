import * as yup from 'yup';

const paymentSchema = yup.object({
  email: yup
    .string()
    .email('Enter a valid email')
    .required('Email is required'),
  cardNumber: yup
    .string()
    .matches(/^\d{4} \d{4} \d{4} \d{4}$/, 'Card number must be 16 digits')
    .when('paymentMethod', {
      is: 'card',
      then: yup.string().required('Card number is required'),
    }),
  cardHolder: yup
    .string()
    .when('paymentMethod', {
      is: 'card',
      then: yup.string().required('Cardholder name is required'),
    }),
  expiryDate: yup
    .string()
    .matches(/^\d{2}\/\d{2}$/, 'Expiry date must be in MM/YY format')
    .when('paymentMethod', {
      is: 'card',
      then: yup.string().required('Expiry date is required'),
    }),
  cvv: yup
    .string()
    .matches(/^\d{3}$/, 'CVV must be 3 digits')
    .when('paymentMethod', {
      is: 'card',
      then: yup.string().required('CVV is required'),
    }),
});

export default paymentSchema;
