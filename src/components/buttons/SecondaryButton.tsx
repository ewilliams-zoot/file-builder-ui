import { FC } from 'react';

const SecondaryButton: FC<{ text: string; onClick: () => void; type?: 'button' | 'submit' }> = ({
  text,
  onClick,
  type = 'button'
}) => {
  return (
    <button className="bg-white border-2 border-primary px-4 py-0.5 rounded-sm" onClick={onClick} type={type}>
      {text}
    </button>
  );
};

export default SecondaryButton;
