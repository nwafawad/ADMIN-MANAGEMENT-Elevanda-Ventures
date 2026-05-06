import Modal from './Modal';
import Button from './Button';

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  confirmColor = 'danger',
  onConfirm,
  onCancel,
  loading = false,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title} size="sm">
      <div className="mb-6">
        <p className="text-sm text-gray-600">{message}</p>
      </div>
      <div className="flex justify-end gap-3">
        <Button variant="ghost" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button variant={confirmColor} onClick={onConfirm} loading={loading}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
