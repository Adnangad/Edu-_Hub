import React, { useState } from "react";

function FileUpload() {
  const [file, setFile] = useState(null);
  const [date, setDate] = useState("");

  const getFile = (event) => {
    setFile(event.target.files[0]);
  };

  const upload = async (event) => {
    event.preventDefault();

    if (!file) {
      console.error('No file selected');
      return;
    }

    console.log(date);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('course', 'Chemistry');
    formData.append('due', date);

    try {
      const response = await fetch('http://127.0.0.1:8000/edu/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        console.log('File uploaded successfully:', data);
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={upload}>
      <input type="file" onChange={getFile} />
      <input
        type="date"
        value={date} 
        onChange={(e) => setDate(e.target.value)} 
        placeholder="year-month-day"
      />
      <button type="submit">Upload File</button>
    </form>
  );
}

export default FileUpload;