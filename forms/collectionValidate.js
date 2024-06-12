export default function collectionValidate(values) {
    const errors = {}
    const specialCharPattern = /[^a-zA-Z0-9\s]/;

    if (!values.collectionName) {
        errors.collectionName = 'Required';
      } else if (values.collectionName.length < 3 || values.collectionName.length > 50) {
        errors.collectionName = 'Must be between 3 and 50 characters';
      }

        if (!values.collectionDescription) {
          errors.collectionDescription = 'Required';
        } else if (values.collectionDescription.length < 3 || values.collectionDescription.length > 250) {
          errors.collectionDescription = 'Must be between 3 and 250 characters';
        } 


  
      return errors
  }