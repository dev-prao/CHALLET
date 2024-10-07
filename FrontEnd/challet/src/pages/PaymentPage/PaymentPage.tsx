import { useEffect, useRef } from 'react';
import { BrowserQRCodeReader, IScannerControls } from '@zxing/browser';
import { useNavigate } from 'react-router-dom';
import { TopBar } from '../../components/topbar/topbar';

const PaymentPage = () => {
  const navigate = useNavigate();
  const controlsRef = useRef<IScannerControls | null>(null);

  useEffect(() => {
    const startScanning = async () => {
      try {
        const codeReader = new BrowserQRCodeReader();
        const videoDevices = (
          await navigator.mediaDevices.enumerateDevices()
        ).filter((device) => device.kind === 'videoinput');

        if (videoDevices.length === 0) {
          throw new Error('No video input devices found.');
        }

        // 후면 카메라를 우선적으로 선택, 없으면 첫 번째 장치 선택
        const preferredDevice =
          videoDevices.find((device) =>
            device.label.toLowerCase().includes('back')
          ) || videoDevices[0];

        if (preferredDevice) {
          controlsRef.current = await codeReader.decodeFromVideoDevice(
            preferredDevice.deviceId,
            'video',
            (result, err) => {
              if (result) {
                const text = result.getText();
                controlsRef.current?.stop();
                navigate('/payreview', { state: { qrData: text } });
              } else if (err && err.name !== 'NotFoundException') {
                console.error('Error during scanning:', err);
              }
            }
          );
        }
      } catch (error) {
        console.error('Error starting scan:', error);
      }
    };

    startScanning();

    // 컴포넌트가 언마운트될 때 스캔 중지
    return () => {
      controlsRef.current?.stop();
    };
  }, [navigate]);

  return (
    <div className='min-h-screen bg-white flex flex-col items-center p-2'>
      <TopBar title='QR 스캔' />
      <div className='flex flex-col items-center justify-center flex-grow'>
        <div
          className='relative'
          style={{
            width: '70vw',
            height: '70vw',
            maxWidth: '600px',
            maxHeight: '600px',
            border: '4px solid white',
          }}
        >
          <video
            id='video'
            width='100%'
            height='100%'
            autoPlay
            className='absolute top-0 left-0 w-full h-full object-cover'
          ></video>
        </div>
        <p className='text-gray-500 text-sm mt-4 text-center'>
          QR코드를 화면에 비추면 <br />
          자동으로 인식 후 다음 화면으로 전환됩니다.
        </p>
      </div>
    </div>
  );
};

export default PaymentPage;
