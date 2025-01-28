// src/schemas/validationSchema/dashboardSchema.jsx
import * as Yup from 'yup'

const dashboardValidationSchema = Yup.object().shape({
  eventName: Yup.string()
    .required('Event name is required')
    .min(3, 'Event name must be at least 3 characters'),
  time: Yup.string()
    .required('Event time is required')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  date: Yup.date()
    .required('Event date is required')
    .min(new Date(), 'Date must be in the future'),
  price: Yup.number()
    .required('Ticket price is required')
    .positive('Price must be a positive number'),
  venue: Yup.string()
    .required('Venue is required')
    .min(3, 'Venue name must be at least 3 characters')
})

export default dashboardValidationSchema