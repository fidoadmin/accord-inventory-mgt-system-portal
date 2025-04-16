import { CancelConfirmationModalPropsInterface } from "@/types/ComponentInterface";

const CancelConfirmationModal: React.FC<
  CancelConfirmationModalPropsInterface
> = ({ onConfirm, onCancel }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-surface border border-primary p-4 rounded-lg shadow-lg text-center">
      <p>Are you sure you want to cancel?</p>
      <div className="mt-4 space-x-2">
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-error text-white rounded-xl hover:opacity-80"
        >
          Yes
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-primary rounded-xl hover:opacity-80 text-white"
        >
          No
        </button>
      </div>
    </div>
  </div>
);

export default CancelConfirmationModal;
