import { useEffect, useState } from 'react';
import { Transaction, TransactionCategory } from '../types/finance';
import { Form, Input, Select, DatePicker, Button } from 'antd';
import dayjs from 'dayjs';

interface TransactionFormProps {
  transaction?: Transaction;
  onSubmit: (transaction: Omit<Transaction, 'id'>) => void;
  onCancel: () => void;
}

interface FormValues {
  type: 'income' | 'expense';
  description: string;
  amount: string;
  category: TransactionCategory;
  date: dayjs.Dayjs;
}

const INCOME_CATEGORIES = [
  { value: 'Work', label: 'Work' },
  { value: 'Allowance', label: 'Allowance' },
  { value: 'Part-time Job', label: 'Part-time Job' },
  { value: 'Gift', label: 'Gift' },
  { value: 'Other Income', label: 'Other Income' },
];

const EXPENSE_CATEGORIES = [
  { value: 'Food', label: 'Food' },
  { value: 'Transportation', label: 'Transportation' },
  { value: 'Entertainment', label: 'Entertainment' },
  { value: 'Clothing', label: 'Clothing' },
  { value: 'Education', label: 'Education' },
  { value: 'Savings', label: 'Savings' },
  { value: 'Other Expense', label: 'Other Expense' },
];

const TransactionForm: React.FC<TransactionFormProps> = ({
  transaction,
  onSubmit,
  onCancel,
}) => {
  const [form] = Form.useForm<FormValues>();
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>(
    transaction?.type || 'expense'
  );

  useEffect(() => {
    if (transaction) {
      form.setFieldsValue({
        ...transaction,
        amount: transaction.amount.toString(),
        date: dayjs(transaction.date),
      });
    }
  }, [transaction, form]);

  const handleSubmit = (values: FormValues) => {
    onSubmit({
      ...values,
      date: values.date.toISOString(),
      amount: parseFloat(values.amount),
    });
  };

  const handleTypeChange = (value: 'income' | 'expense') => {
    setTransactionType(value);
    // Reset category when type changes
    form.setFieldValue('category', undefined);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      className="space-y-4"
      initialValues={{
        type: transactionType,
        date: dayjs(),
      }}
    >
      <Form.Item
        name="type"
        label={<span className="text-[var(--color-night)] font-medium">Transaction Type</span>}
        rules={[{ required: true, message: 'Please select a transaction type' }]}
      >
        <Select
          className="h-[38px]"
          options={[
            { value: 'income', label: 'Income' },
            { value: 'expense', label: 'Expense' },
          ]}
          onChange={handleTypeChange}
          style={{ fontFamily: 'Libre Franklin' }}
        />
      </Form.Item>

      <Form.Item
        name="description"
        label={<span className="text-[var(--color-night)] font-medium">Description</span>}
        rules={[{ required: true, message: 'Please enter a description' }]}
      >
        <Input 
          placeholder="Enter transaction description"
          className="h-[38px]"
          style={{ fontFamily: 'Libre Franklin' }}
        />
      </Form.Item>

      <Form.Item
        name="amount"
        label={<span className="text-[var(--color-night)] font-medium">Amount</span>}
        rules={[
          { required: true, message: 'Please enter an amount' },
          { pattern: /^\d+(\.\d{0,2})?$/, message: 'Please enter a valid amount' },
        ]}
      >
        <Input
          prefix="$"
          type="number"
          step="0.01"
          placeholder="0.00"
          className="h-[38px]"
          style={{ fontFamily: 'Libre Franklin' }}
        />
      </Form.Item>

      <Form.Item
        name="category"
        label={<span className="text-[var(--color-night)] font-medium">Category</span>}
        rules={[{ required: true, message: 'Please select a category' }]}
      >
        <Select
          className="h-[38px]"
          placeholder="Select a category"
          options={[
            {
              label: transactionType === 'income' ? 'Income Categories' : 'Expense Categories',
              options: transactionType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES,
            },
          ]}
          style={{ fontFamily: 'Libre Franklin' }}
        />
      </Form.Item>

      <Form.Item
        name="date"
        label={<span className="text-[var(--color-night)] font-medium">Date</span>}
        rules={[{ required: true, message: 'Please select a date' }]}
      >
        <DatePicker 
          className="w-full h-[38px]"
          style={{ fontFamily: 'Libre Franklin' }}
        />
      </Form.Item>

      <div className="flex justify-end space-x-4 pt-4">
        <Button onClick={onCancel} className="h-[38px]">
          Cancel
        </Button>
        <Button type="primary" htmlType="submit" className="h-[38px]">
          {transaction ? 'Update' : 'Add'} Transaction
        </Button>
      </div>
    </Form>
  );
};

export default TransactionForm; 