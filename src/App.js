import './App.css';


import { useState } from 'react';

/*
POTENTIAL AREAS FOR IMPROVEMENT
 - Pull out validation logic, maybe even separating error messages from logic
 - Pull out API request logic
 - Pull out components
 - Make email validation more sophisticated
 - Make error messaging more sophisticated
*/

function validateEmail(value) {
  if (value.length === 0) {
    return "This is required";
  }
  const emailPattern = /\S+@\S+/ // a very basic pattern
  if (!emailPattern.test(value)) {
    return `'${value} is not a valid email address`;
  }
  return null;
}
function validatePassword(value) {
  if (value.length === 0) {
    return "Password is required";
  }

  const minimumLength = 8
  const meetsLength = value.length >= minimumLength;

  const hasAtLeastOneNumber = /\d+/.test(value);
  const hasAtLeastOneLetter = /\w+/.test(value);
  const hasAtLeastOneSpecialCharacter = /\W+/.test(value); // super basic

  // TODO - make dynamic based on what's wrong
  if (!meetsLength || !hasAtLeastOneNumber || !hasAtLeastOneSpecialCharacter || !hasAtLeastOneLetter) {
    return "Password must have at least 8 characters, at least 1 number, at least 1 letter, and at least 1 special character"
  }

  return null;
}
function validateConfirmPassword(value, password) {
  if (value.length === 0) {
    return "This is required";
  }
  if ( value !== password) {
    return "Must Match Password";
  }
  return null;
}

function validatePetName (value) {
  if (value.length === 0) {
    return "This is required";
  }
  return null;
}

function validateIdealPetWeight(value) {
  const weight = parseFloat(value);
  if (!isNaN(weight) && !(weight >= 3 && weight <= 180)) {
    return "Please enter a number between 3 and 180";
  }
  return null;
};

function validatePetWeight(value) {
  if (value.length === 0) {
    return "This is required";
  }

  return validateIdealPetWeight(value);
};

function postRegistration(data) {
  // expects "email" in JSON request body
  return fetch(
    "https://5r2cql08l4.execute-api.us-east-1.amazonaws.com/register",
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }
  )
    .then(response => {
      if (response.status === 500) {
        throw new Error("Something bad happened");
      }

      return response.json();
    });
}

function App() {
  const [values, setValues] = useState({});
  const [validationMessages, setValidationMessages] = useState({});

  const setValidationMessage = (key, validationMessage) => setValidationMessages({...validationMessages, [key]: validationMessage});

  const setValue = (key, value) => setValues({...values, [key]: value});

  function submitHandler(e) {
    e.preventDefault();
    // TODO: validate unvalidated data
    const hasValidationMessages = Object.values(validationMessages).some(validationMessage => validationMessage !== null);
    console.log("Submitted");
    if (hasValidationMessages) {
      return;
    }

    // TODO: some kind of feedback based on the response
    postRegistration(values);
  };

  return (
    <div className="container">
      <img className="image" role="presentation" src="https://via.placeholder.com/600" alt="placeholder"/>
      <div className="sign-up">
      <form onSubmit={submitHandler}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          defaultValue={values.email || ''}
          onChange={e => setValue('email', e.target.value)}
          onBlur={e => setValidationMessage('email',  validateEmail(e.target.value))}
        />
        {validationMessages.email && (
          <div className="validationmsg">
            {validationMessages.email}
          </div>
        )}
        <label htmlFor="password">Password: </label>
        <input 
          type="password" 
          name="password" 
          defaultValue={values.password || ''}
          onChange={e => setValue('password', e.target.value)}
          onBlur={e => setValidationMessage('password',  validatePassword(e.target.value))}
        />
        {validationMessages.password && (
          <div className="validationmsg">
            {validationMessages.password}
          </div>
        )}
        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input 
          type="password" 
          name="confirmPassword" 
          defaultValue={values.confirmPassword || ''} 
          onChange={e => setValue('confirmPassword', e.target.value)}
          onBlur={e => setValidationMessage('confirmPassword',  validateConfirmPassword(e.target.value))}
        />
        {validationMessages.confirmPassword && (
          <div className="validationmsg">
            {validationMessages.confirmPassword}
          </div>
        )}
        <label htmlFor="petName">Pet Name</label>
        <input 
          type="text" 
          name="petName" 
          defaultValue={values.petName || ''} 
          onChange={e => setValue('petName', e.target.value)}
          onBlur={e => setValidationMessage('petName', validatePetName(e.target.value))}
        />
        {validationMessages.petName && (
          <div className="validationmsg">
            {validationMessages.petName}
          </div>
        )}
        <label htmlFor="petWeight">Pet Weight</label>
        <input 
          type="number" 
          name="petWeight" 
          defaultValue={values.petWeight || ''} 
          onChange={e => setValue('petWeight', e.target.value)}
          onBlur={e => setValidationMessage('petWeight', validatePetWeight(e.target.value))}
        />
        {validationMessages.petWeight && (
          <div className="validationmsg">
            {validationMessages.petWeight}
          </div>
        )}
        <label htmlFor="petIdealWeight">Pet Ideal Weight</label>
        <input 
          type="number" 
          name="petIdealWeight" 
          defaultValue={values.petIdealWeight || ''}
          onChange={e => setValue('petIdealWeight', e.target.value)}
          onBlur={e => setValidationMessage('petIdealWeight', validateIdealPetWeight(e.target.value))} 
        />
        <input type="submit" value="Submit" />
      </form>
      </div> 
    </div>
  );
}

export default App;
