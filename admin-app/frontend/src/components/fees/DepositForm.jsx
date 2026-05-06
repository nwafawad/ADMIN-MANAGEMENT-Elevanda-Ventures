import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '../ui/Input';
import Button from '../ui/Button';

const depositSchema = z.object({
  amount: z
    .string()
    .min(1, 'Amount is required')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Amount must be a positive number'),
  description: z.string().max(500, 'Description cannot exceed 500 characters').optional(),
});

export default function DepositForm({ onSubmit, isLoading }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(depositSchema),
    defaultValues: { amount: '', description: '' },
  });

  const onFormSubmit = async (data) => {
    await onSubmit({ amount: Number(data.amount), description: data.description || '' });
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <Input
        id="deposit-amount"
        label="Amount (RWF)"
        type="number"
        placeholder="Enter amount"
        error={errors.amount?.message}
        {...register('amount')}
      />
      <div className="space-y-1">
        <label htmlFor="deposit-description" className="block text-sm font-medium text-gray-700">
          Description (optional)
        </label>
        <textarea
          id="deposit-description"
          rows={3}
          placeholder="e.g., Term 2 school fees payment"
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-all duration-200"
          {...register('description')}
        />
        {errors.description && (
          <p className="text-xs text-red-600">{errors.description.message}</p>
        )}
      </div>
      <Button type="submit" loading={isLoading} className="w-full">
        Submit Deposit
      </Button>
    </form>
  );
}
