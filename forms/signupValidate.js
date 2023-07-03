export default function signupValidate(values) {
    const errors = {}
  
    if (!values.name) {
        errors.name = 'Required';
      } else if (values.name.length < 3  || values.name.length > 40) {
        errors.name = 'Invalid name';
      }
  
    if (!values.email) {
        errors.email = 'Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
       errors.email = 'Invalid email address';
    }
  
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