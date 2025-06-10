import { FC } from 'react';

const PrimaryButton: FC<{
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  text: string;
  type: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>['type'];
}> = ({ onClick, text, type }) => {
  return (
    <button
      className="bg-primary text-white border-2 border-primary px-4 py-0.5 rounded-sm"
      onClick={onClick}
      type={type}
    >
      {text}
    </button>
  );
};

export default PrimaryButton;
