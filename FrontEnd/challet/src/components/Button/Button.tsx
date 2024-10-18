import './Button.css';

interface ButtonProps {
  text: string; // 버튼에 표시할 텍스트
  disabled?: boolean; // 버튼 활성화/비활성화 여부
  className?: string; // 추가로 적용할 클래스명
  onClick?: () => void; // 클릭 이벤트 핸들러
}

const Button = ({
  text,
  disabled = false,
  className = '',
  onClick,
}: ButtonProps) => {
  return (
    <button
      className={`custom-button ${className} ${disabled ? 'disabled' : ''}`}
      disabled={disabled}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;
