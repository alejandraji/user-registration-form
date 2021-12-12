import './App.css';


import { useState } from 'react';


function validateEmail(value) {
  if (value.length === 0) {
    return "This is required*";
  }
  const emailPattern = /\S+@\S+/ // a very basic pattern
  if (!emailPattern.test(value)) {
    return `'${value} is not a valid email address`;
  }
  return null;
}

function validatePassword(value) {
  if (value.length === 0) {
    return "Password is required*";
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

function validatePhone (value) {
  if (value.length === 0) {
    return "This is required";
  }
  return null;
}


function validateUsername(value) {
  if (value.length === 0) {
    return "This is required";
  }

  return null;
};

function postRegistration(data) {
  // expects "email" in JSON request body
  return fetch(
    "https://jsonplaceholder.typicode.com/users",
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
  const [isSuccess, setIsSucess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setValue = (key, value) => setValues({...values, [key]: value});
  const setValidationMessage = (key, validationMessage) => setValidationMessages({...validationMessages, [key]: validationMessage});

  function submitHandler(e) {
    e.preventDefault();
    const hasValidationMessages = Object.values(validationMessages).some(validationMessage => validationMessage !== null);
    if (hasValidationMessages) {
      return;
    }
    setIsSubmitting(true);
    postRegistration(values).then(() => {
      setIsSucess(true);
      setIsSubmitting(false);
      setValues({}); // clear form
    })
  };

  return (
    <div className="bg-yellow-100 container md:m-auto md:w-1/2 mx-autoborder-black flex flex-col items-center mt-12">
      <h1 className="uppercase self-center font-bold text-slate-800 mb-6 mt-6"> Registration Form </h1>
      <div className="sign-up">
        {isSuccess && <div className="bg-red-700 text-white text-center w-24">Submitted!</div>}
      <form className="flex flex-col w-80 m:w-full"onSubmit={submitHandler}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          className="w-full caret-pink-500 border border-gray-300 font-light rounded-md"
          name="email"
          value={values.email || ''}
          onChange={e => setValue('email', e.target.value)}
          onBlur={e => setValidationMessage('email',  validateEmail(e.target.value))}
        />
        {validationMessages.email && (
          <div className="validationmsg">
            {validationMessages.email}
          </div>
        )}
         <label htmlFor="username">Username:</label>
        <input 
          type="text"
          className="w-full font-light border border-gray-300 rounded-md"
          name="username" 
          value={values.username || ''} 
          onChange={e => setValue('username', e.target.value)}
          onBlur={e => setValidationMessage('username', validateUsername(e.target.value))}
        />
        {validationMessages.username && (
          <div className="validationmsg">
            {validationMessages.username}
          </div>
        )}
        <label htmlFor="password">Password: </label>
        <input 
          type="password"
          className="w-full font-light border border-gray-300 rounded-md"
          name="password" 
          value={values.password || ''}
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
          className="w-full font-light border border-gray-300 rounded-md"
          name="confirmPassword" 
          value={values.confirmPassword || ''} 
          onChange={e => setValue('confirmPassword', e.target.value)}
          onBlur={e => setValidationMessage('confirmPassword',  validateConfirmPassword(e.target.value, values.password))}
        />
        {validationMessages.confirmPassword && (
          <div className="validationmsg">
            {validationMessages.confirmPassword}
          </div>
        )}
        <label htmlFor="phone">Phone:</label>
        <input 
          type="text" 
          className="w-full font-light border border-gray-300 rounded-md"
          name="phone" 
          value={values.phone || ''} 
          onChange={e => setValue('phone', e.target.value)}
          onBlur={e => setValidationMessage('phone', validatePhone(e.target.value))}
        />
        {validationMessages.phone && (
          <div className="validationmsg">
            {validationMessages.phone}
          </div>
        )}
        <input className="self-center w-32 m-8 border border-gray-300 text-white hover:ring-4 bg-blue-500 shadow-lg shadow-indigo-500/50 shadow-lg shadow-indigo-500/50 rounded-md cursor-pointer" disabled={isSubmitting} type="submit" value="Submit" />
      </form>
      </div> 
    </div>
  );
}

export default App;
