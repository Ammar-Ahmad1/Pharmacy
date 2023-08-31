import React, { useState } from 'react';

export default function ImageUpload() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = () => {
    // You can implement the logic for uploading the image here
    if (selectedFile) {
      const formData = new FormData();
      formData.append('image', selectedFile);
      // Make a POST request to your server to upload the image
    }
  };


  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {selectedFile && (
        <img
          src={URL.createObjectURL(selectedFile)}
          alt="Selected"
          style={{ maxWidth: '300px', marginTop: '10px' }}
        />
      )}
      <br />
      <button onClick={handleUpload} className="btn btn-fill-out submit font-weight-bold">Upload</button>
    </div>
  );
}
