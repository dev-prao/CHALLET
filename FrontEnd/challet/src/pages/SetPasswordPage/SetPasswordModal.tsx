interface ModalProps {
  message: string;
  onConfirm: () => void;
}

const Modal = ({ message, onConfirm }: ModalProps) => {
  return (
    <div
      className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'
      style={{ zIndex: 2000 }} // z-index와 top 조정
    >
      <div className='bg-white p-6 rounded-md shadow-md text-center'>
        <p className='text-lg mb-4'>{message}</p>
        <button
          onClick={onConfirm}
          className='bg-[#00cccc] text-white px-4 py-2 rounded-md'
        >
          확인
        </button>
      </div>
    </div>
  );
};

export default Modal;
