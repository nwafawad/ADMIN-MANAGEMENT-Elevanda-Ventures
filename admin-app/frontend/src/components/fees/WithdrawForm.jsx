import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { formatCurrency } from '../../utils/formatCurrency';

export default function WithdrawForm({ onSubmit, isLoading, currentBalance = 0 }) {
  const withdrawSchema = z.object({
    amount: z
      .string()
      .min(1, 'Amount is required')
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Amount must be a positive number')
      .refine((val) => Number(val) <= currentBalance, `Amount cannot exceed balance (${formatCurrency(currentBalance)})`),
    description: z.string().max(500, 'Description cannot exceed 500 characters').optional(),
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(withdrawSchema),
    defaultValues: { amount: '', description: '' },
  });

  const watchAmount = watch('amount');
  const isOverBalance = Number(watchAmount) > currentBalance;

  const onFormSubmit = async (data) => {
    await onSubmit({ amount: Number(data.amount), description: data.description || '' });
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div>
        <Input
          id="withdraw-amount"
          label="Amount (RWF)"
          type="number"
          placeholder="Enter amount"
          error={errors.amount?.message}
          {...register('amount')}
        />
        <p className="mt-1 text-xs text-gray-500">
          Available balance: {formatCurrency(currentBalance)}
        </p>
      </div>
      <div className="space-y-1">
        <label htmlFor="withdraw-description" className="block text-sm font-medium text-gray-700">
          Description (optional)
        </label>
        <textarea
          id="withdraw-description"
          rows={3}
          placeholder="e.g., Book purchase refund"
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-all duration-200"
          {...register('description')}
        />
        {errors.description && (
          <p className="text-xs text-red-600">{errors.description.message}</p>
        )}
      </div>
      <Button
        type="submit"
        loading={isLoading}
        disabled={isOverBalance}
        variant={isOverBalance ? 'danger' : 'primary'}
        className="w-full"
      >
        {isOverBalance ? 'Insufficient Balance' : 'Submit Withdrawal'}
      </Button>
    </form>
  );
}
