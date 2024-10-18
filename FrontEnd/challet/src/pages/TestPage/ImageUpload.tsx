import React, { useState } from 'react';
import useFile2URL from '../../hooks/useFile2URL'; // 파일 경로를 맞게 설정하세요.

const ImageUpload: React.FC = () => {
  const { file2URL } = useFile2URL(); // 커스텀 훅 사용
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB 이상일 경우 경고
        alert('File is too large. Maximum size is 5MB.');
      } else {
        setSelectedFile(file);
      }
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      setIsUploading(true);
      try {
        const url = await file2URL(selectedFile);
        setImageURL(url); // 업로드된 이미지 URL 저장
        alert('File uploaded successfully!');
      } catch (error) {
        console.error('Error uploading file:', error);
        alert('File upload failed.');
      }
      setIsUploading(false);
    }
  };

  return (
    <div>
      <h2>Image Upload</h2>
      <input type='file' accept='image/*' onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!selectedFile || isUploading}>
        {isUploading ? 'Uploading...' : 'Upload Image'}
      </button>

      {/* 업로드 완료 후 이미지 URL을 출력하거나 이미지를 보여줌 */}
      {imageURL && (
        <div>
          <h3>Uploaded Image:</h3>
          <img
            src={imageURL}
            alt='Uploaded file'
            style={{ maxWidth: '300px' }}
          />
          <p>Image URL: {imageURL}</p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
