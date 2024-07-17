export default function resetValidate(values) {
    const errors = {}
  
    if (!values.password) {
        errors.password = 'Required';
    } else if (values.password.length < 6) {
        errors.password = 'Must be greater than 6.'
    } else if (values.password.includes(" ")) {
        errors.password = 'Invalid password'
    }
  
    if (!values.cpassword) {
        errors.cpassword = 'Required';
    } else if (values.password !== values.cpassword) {
       errors.cpassword = 'Password does not match';
    } else if (values.cpassword.includes(" ")) {
        errors.cpassword = 'Invalid confirm password';
      }
  
      return errors
  }