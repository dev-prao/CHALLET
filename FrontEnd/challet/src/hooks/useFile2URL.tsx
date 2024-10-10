import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid'; // uuid import

const useFile2URL = () => {
  const region = 'ap-northeast-2';
  const bucket = 'challetbucket';

  const s3 = new S3Client({
    region: region,
    credentials: {
      accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
      secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
    },
  });

  const file2URL = async (file: File) => {
    // 고유한 UUID를 생성하고 파일의 확장자를 유지
    const uniqueId = uuidv4(); // 고유 ID 생성
    const fileExtension = file.name.split('.').pop(); // 파일 확장자 추출
    const uniqueFileName = `${uniqueId}.${fileExtension}`; // 고유 파일명 생성

    const params = {
      Bucket: bucket,
      Key: uniqueFileName, // 고유한 파일 이름 사용
      Body: file,
    };

    try {
      const command = new PutObjectCommand(params);
      const data = await s3.send(command);
      const fileURL = `https://${bucket}.s3.${region}.amazonaws.com/${uniqueFileName}`;
      console.log(data);
      // console.log('File URL:', fileURL);
      return fileURL;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  return { file2URL };
};

export default useFile2URL;
