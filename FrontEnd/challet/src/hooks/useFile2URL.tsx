import useAuthStore from '../store/useAuthStore';

const useFile2URL = () => {
  const file2URL = async (file: File) => {
    try {
      const api = import.meta.env.VITE_API_URL + '/api/challet/upload';
      const token = useAuthStore.getState().accessToken;
      const formData = new FormData();
      formData.append('file', file);
      const fileURL = await fetch(api, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`, // 필요한 경우 토큰을 헤더에 추가
        },
      }).then((res) => res.text());
      console.log('Uploaded file URL:', fileURL);
      return fileURL;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  return { file2URL };
};

export default useFile2URL;
