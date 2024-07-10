export default function inventoryValidate(values) {
    const errors = {}
    const specialCharPattern = /[^a-zA-Z0-9\s\-|]/;

    const keywordPattern = /[^a-zA-Z0-9\s\-|,]/;

        if (!values.productName) {
          errors.productName = 'Required';
        } else if (specialCharPattern.test(values.productName)) {

          errors.productName = 'Name should not contain special characters';
        }


        if (!values.productPrice) {
            errors.productPrice = 'Required';
          } else if (isNaN(values.productPrice)) {
            errors.productPrice = 'Price should be a number';
          } else if (values.productPrice < 0) {
            errors.productPrice = 'Price should be a positive number';
          } else if (values.productPrice > 1000000) {
            errors.productPrice = 'Price should be less than 1000000';
          } else if (String(values.productPrice).includes(" ")) {
            errors.productPrice = 'Invalid price';
          } 

        if (!values.compareAtPrice) {
            errors.compareAtPrice = 'Required';
        } else if (isNaN(values.compareAtPrice)) {
            errors.compareAtPrice = 'Price should be a number';
        } else if (values.compareAtPrice < 0) {
            errors.compareAtPrice = 'Price should be a positive number';
        } else if (values.compareAtPrice > 1000000) {
            errors.compareAtPrice = 'Price should be less than 1000000';
        } else if (String(values.compareAtPrice).includes(" ")) {
            errors.compareAtPrice = 'Invalid price';
        }

        if (!values.productSizeValue) {
            errors.productSizeValue = 'Required';
        } else if (values.productSizeValue < 0) {
            errors.productSizeValue = 'Size cannot be negative';
        } else if (values.productSizeValue > 1000000) {
            errors.productSizeValue = 'Size should be less than 1000000';
        }  else if (isNaN(values.productSizeValue)) {
            errors.productSizeValue = 'Size should be a number';
        }  else if (String(values.productSizeValue).includes(" ")) {
            errors.productSizeValue = 'Invalid size';
        } 

        if (values.productQuantity === undefined || values.productQuantity === null) {
          errors.productQuantity = 'Required';
      } else if (values.productQuantity < 0) {
          errors.productQuantity = 'Quantity cannot be negative';
      } else if (values.productQuantity > 1000000) {
          errors.productQuantity = 'Quantity should be less than 1000000';
      } else if (String(values.productQuantity).includes(" ")) { 
          errors.productQuantity = 'Invalid quantity';
      } else if (isNaN(values.productQuantity)) {
          errors.productQuantity = 'Quantity should be a number';
      } else if (String(values.productQuantity).includes(".")) {
          errors.productQuantity = 'Quantity should be a whole number';
      }

        if (!values.productCost) {
            errors.productCost = 'Required';
        } else if (values.productCost < 0) {
            errors.productCost = 'Cost cannot be negative';
        } else if (values.productCost > 1000000) {
            errors.productCost = 'Cost should be less than 1000000';
        } else if (String(values.productCost).includes(" ")) {
            errors.productCost = 'Invalid cost';
        } else if (isNaN(values.productCost)) {
            errors.productCost = 'Cost should be a number';
        } else if (String(values.productCost).includes(" ")) {
            errors.productCost = 'Cost should be a whole number';
        } else if (String(values.productCost).includes("-")) {
            errors.productCost = 'Cost should be positive';
        } 
    
  if (!values.productSku) {
    errors.productSku = 'Required';
  } else if (values.productSku.length < 3 || values.productSku.length > 40) {
    errors.productSku = 'Invalid SKU length';
  } else if (specialCharPattern.test(values.productSku)) {
    errors.productSku = 'SKU should not contain special characters';
  }

  if (!values.productKeywords) {
    errors.productKeywords = 'Required';
  } else if (keywordPattern.test(values.productKeywords)) {
    errors.productKeywords = 'Keywords should only contain letters, numbers, and commas';
  } else {
    const keywordsArray = values.productKeywords.split(',').map(keyword => keyword.trim());
    const uniqueKeywords = new Set(keywordsArray);

    if (uniqueKeywords.size !== keywordsArray.length) {
      errors.productKeywords = 'Duplicate keywords are not allowed';
    }
  }

  
      return errors
  }