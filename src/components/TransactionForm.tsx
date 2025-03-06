import { useEffect } from 'react';
import { Transaction, TransactionCategory } from '../types/finance';
import { Form, Input, Select, DatePicker, Button, Space } from 'antd';
import dayjs from 'dayjs';

interface TransactionFormProps {
  transaction?: Transaction;
  onSubmit: (transaction: Omit<Transaction, 'id'>) => void;
  onCancel: () => void;
}

interface FormValues {
  date: dayjs.Dayjs;
  amount: string | number;
  type: 'income' | 'expense';
  category: TransactionCategory;
  description: string;
}

const TransactionForm = ({ transaction, onSubmit, onCancel }: TransactionFormProps) => {
  const [form] = Form.useForm<FormValues>();

  useEffect(() => {
    if (transaction) {
      form.setFieldsValue({
        ...transaction,
        amount: transaction.amount.toString(),
        date: dayjs(transaction.date)
      });
    }
  }, [transaction, form]);

  const handleSubmit = (values: FormValues) => {
    onSubmit({
      ...values,
      amount: Number(values.amount),
      date: values.date.format('YYYY-MM-DD')
    });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        date: transaction ? dayjs(transaction.date) : dayjs(),
        amount: transaction ? transaction.amount.toString() : '',
        type: transaction?.type || 'expense',
        category: transaction?.category || 'Food',
        description: transaction?.description || ''
      }}
    >
      <Form.Item
        label="Date"
        name="date"
        rules={[{ required: true, message: 'Please select a date' }]}
      >
        <DatePicker className="w-full" />
      </Form.Item>

      <Form.Item
        label="Amount"
        name="amount"
        rules={[
          { required: true, message: 'Please enter an amount' },
          { 
            pattern: /^\d*\.?\d{0,2}$/,
            message: 'Please enter a valid amount with up to 2 decimal places'
          },
          {
            validator: (_, value) => {
              if (value && Number(value) <= 0) {
                return Promise.reject('Amount must be greater than 0');
              }
              return Promise.resolve();
            }
          }
        ]}
      >
        <Input 
          type="text"
          prefix="$"
          onChange={(e) => {
            const value = e.target.value.replace(/[^\d.]/g, '');
            if (/^\d*\.?\d{0,2}$/.test(value)) {
              form.setFieldsValue({ amount: value });
            }
          }}
        />
      </Form.Item>

      <Form.Item
        label="Type"
        name="type"
        rules={[{ required: true, message: 'Please select a type' }]}
      >
        <Select>
          <Select.Option value="income">Income</Select.Option>
          <Select.Option value="expense">Expense</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Category"
        name="category"
        rules={[{ required: true, message: 'Please select a category' }]}
      >
        <Select>
          <Select.Option value="Food">Food & Dining</Select.Option>
          <Select.Option value="Transportation">Transportation</Select.Option>
          <Select.Option value="Entertainment">Entertainment</Select.Option>
          <Select.Option value="Utilities">Utilities</Select.Option>
          <Select.Option value="Salary">Salary</Select.Option>
          <Select.Option value="Other">Other</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Description"
        name="description"
        rules={[{ required: true, message: 'Please enter a description' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item>
        <Space className="w-full justify-end">
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="primary" htmlType="submit">
            {transaction ? 'Update Transaction' : 'Add Transaction'}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default TransactionForm; 