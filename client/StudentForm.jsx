// StringForm.jsx
import React, { useState } from 'react';
import axios from 'axios';

const StudentForm = () => {
  const [text, setText] = useState('');

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/strings', { text });
      console.log(response.data.message); // Log success message from backend
      setText(''); // Clear input field after successful submission
    } catch (error) {
      console.error('Error submitting string:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Enter a String:</label>
      <input
        type="text"
        value={text}
        onChange={handleChange}
        required
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default StudentForm;
