import { FC, useRef } from 'react';
import PrimaryButton from '../../buttons/PrimaryButton';
import SecondaryButton from '../../buttons/SecondaryButton';

const NewFileModal: FC<{
  onDone: (fileType: 'flow' | 'js', fileName: string) => void;
  onCancel: () => void;
}> = ({ onDone, onCancel }) => {
  const fileNameRef = useRef<HTMLInputElement>(null);
  const fileTypeRef = useRef<HTMLSelectElement>(null);

  return (
    <div>
      <label className="block mb-4">
        <span className="block">File Type</span>
        <select defaultValue="flow" ref={fileTypeRef}>
          <option value="flow">Flow</option>
          <option value="js">JavaScript</option>
        </select>
      </label>
      <label className="block mb-4">
        <span className="block">File Name</span> <input ref={fileNameRef} type="text" />
      </label>
      <SecondaryButton text="Cancel" onClick={onCancel} />
      <PrimaryButton
        type="button"
        onClick={() => {
          if (fileTypeRef.current && fileNameRef.current) {
            onDone(fileTypeRef.current.value as 'flow' | 'js', fileNameRef.current.value);
          }
        }}
        text="Done"
      />
    </div>
  );
};

export default NewFileModal;
