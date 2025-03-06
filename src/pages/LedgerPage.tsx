import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import Layout from '../components/Layout';
import { useFinance } from '../context/FinanceContext';
import { Transaction, TransactionType, TransactionCategory } from '../types/finance';
import TransactionForm from '../components/TransactionForm';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import { Button, Input, Table, Space, Modal, Card, Radio, DatePicker } from 'antd';
import { SearchOutlined, FilterOutlined, DownloadOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs';

const ITEMS_PER_PAGE = 10;

// Colors for charts using CSS variables
const COLORS = [
  'var(--color-pistachio)',
  'var(--color-cerulean)',
  'var(--color-darkgreen)',
  '#FFBB28',
  '#FF8042',
  '#8884d8',
  '#82ca9d'
];

interface ChartData {
  date: string;
  income: number;
  expense: number;
}

interface PieData {
  name: string;
  value: number;
}

const LedgerPage = () => {
  const { transactions, deleteTransaction, updateTransaction, addTransaction } = useFinance();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<TransactionCategory | ''>('');
  const [selectedType, setSelectedType] = useState<TransactionType | ''>('');
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [timeFrame, setTimeFrame] = useState<'custom' | 'all'>('all');
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([null, null]);
  const [barChartData, setBarChartData] = useState<ChartData[]>([]);
  const [pieChartData, setPieChartData] = useState<PieData[]>([]);

  // Filter transactions based on search term and filters
  useEffect(() => {
    let filtered = [...transactions];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(transaction =>
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(transaction => transaction.category === selectedCategory);
    }

    // Apply type filter
    if (selectedType) {
      filtered = filtered.filter(transaction => transaction.type === selectedType);
    }

    // Apply date range filter
    if (dateRange[0] && dateRange[1]) {
      const startDate = dateRange[0].toDate();
      const endDate = dateRange[1].toDate();
      filtered = filtered.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= startDate && transactionDate <= endDate;
      });
    }

    setFilteredTransactions(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [transactions, searchTerm, selectedCategory, selectedType, dateRange]);

  // Prepare data for charts
  const prepareChartData = useCallback(() => {
    console.log('Preparing chart data...');
    console.log('Current timeFrame:', timeFrame);
    console.log('Total transactions:', transactions.length);

    // For bar chart
    let filteredTransactions = [...transactions];
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Set to start of day
    
    if (timeFrame === 'custom' && dateRange[0] && dateRange[1]) {
      const startDate = dateRange[0].toDate();
      const endDate = dateRange[1].toDate();
      filteredTransactions = filteredTransactions.filter(t => {
        const transactionDate = new Date(t.date);
        transactionDate.setHours(0, 0, 0, 0);
        return transactionDate >= startDate && transactionDate <= endDate;
      });
    }

    console.log('Filtered transactions for bar chart:', filteredTransactions.length);

    // Group by date
    const dateMap: { [key: string]: { income: number; expense: number } } = {};
    
    filteredTransactions.forEach(t => {
      const dateStr = format(new Date(t.date), 'MM/dd');
      if (!dateMap[dateStr]) {
        dateMap[dateStr] = { income: 0, expense: 0 };
      }
      if (t.type === 'income') {
        dateMap[dateStr].income += t.amount;
      } else {
        dateMap[dateStr].expense += t.amount;
      }
    });

    const barData = Object.entries(dateMap)
      .map(([date, data]) => ({
        date,
        income: data.income,
        expense: data.expense
      }))
      .sort((a, b) => {
        const dateA = new Date(now.getFullYear() + '/' + a.date);
        const dateB = new Date(now.getFullYear() + '/' + b.date);
        return dateA.getTime() - dateB.getTime();
      });

    console.log('Bar chart data:', barData);
    setBarChartData(barData);

    // For pie chart
    const pieFilteredTransactions = filteredTransactions;
    
    const expenseTransactions = pieFilteredTransactions.filter(t => t.type === 'expense');
    console.log('Expense transactions:', expenseTransactions.length);

    const categoryMap: { [key: string]: number } = {};
    
    expenseTransactions.forEach(t => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
    });

    const pieData = Object.entries(categoryMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    console.log('Pie chart data:', pieData);
    setPieChartData(pieData);
  }, [transactions, timeFrame, dateRange]);

  // Update chart data when dependencies change
  useEffect(() => {
    prepareChartData();
  }, [prepareChartData]);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(id);
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingTransaction(null);
    setShowForm(true);
  };

  const handleFormSubmit = (formData: Omit<Transaction, 'id'>) => {
    if (editingTransaction) {
      updateTransaction({ ...formData, id: editingTransaction.id });
    } else {
      addTransaction({ ...formData, id: Date.now().toString() });
    }
    setShowForm(false);
    setEditingTransaction(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingTransaction(null);
  };

  const handleDownloadPDF = () => {
    // TODO: Implement PDF export functionality
    alert('PDF export functionality coming soon!');
  };

  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => format(new Date(date), 'MM/dd/yyyy'),
      width: 100,
      sorter: (a: Transaction, b: Transaction) => new Date(a.date).getTime() - new Date(b.date).getTime()
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      width: 150
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 120
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      width: 100,
      render: (amount: number, record: Transaction) => (
        <span className={record.type === 'income' ? 'text-[var(--color-pistachio)]' : 'text-[var(--color-cerulean)]'}>
          {record.type === 'income' ? '+' : '-'}${amount.toFixed(2)}
        </span>
      ),
      sorter: (a: Transaction, b: Transaction) => a.amount - b.amount
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_: unknown, record: Transaction) => (
        <Space>
          <Button 
            type="text" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            className="text-[var(--color-cerulean)] hover:text-[var(--color-darkgreen)]"
          />
          <Button 
            type="text" 
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            className="text-red-500 hover:text-red-700"
          />
        </Space>
      )
    }
  ];

  return (
    <Layout>
      <div className="h-full flex flex-col">
        {/* Header Section */}
        <div className="mb-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xs font-bold text-[var(--color-night)]">Transaction Ledger</h1>
            <Button 
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
              className="bg-[var(--color-darkgreen)] hover:bg-[var(--color-darkgreen)] hover:opacity-80"
            >
              Add Transaction
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex gap-4 overflow-hidden">
          {/* Left Half - Transaction History */}
          <div className="w-1/2 flex flex-col overflow-hidden">
            {/* Search and Filter Section */}
            <div className="bg-[var(--color-white)] p-4 rounded-lg mb-4">
              <div className="flex flex-wrap gap-2 items-center">
                <div className="flex-1 min-w-[200px]">
                  <Input
                    placeholder="Search transactions..."
                    prefix={<SearchOutlined className="text-[var(--color-cerulean)]" />}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    size="small"
                  />
                </div>
                <Space>
                  <Button 
                    type="text"
                    icon={<FilterOutlined />}
                    onClick={() => setShowFilters(!showFilters)}
                    className="text-[var(--color-cerulean)] hover:text-[var(--color-cerulean)] hover:opacity-80"
                  />
                  <Button 
                    type="text"
                    icon={<DownloadOutlined />}
                    onClick={handleDownloadPDF}
                    className="text-[var(--color-cerulean)] hover:text-[var(--color-cerulean)] hover:opacity-80"
                  />
                </Space>
              </div>

              {/* Filter Panel */}
              {showFilters && (
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-night)] mb-1">Transaction Type</label>
                    <Radio.Group 
                      value={selectedType} 
                      onChange={(e) => setSelectedType(e.target.value as TransactionType)}
                      size="small"
                      buttonStyle="solid"
                      className="flex flex-wrap gap-1"
                    >
                      <Radio.Button value="">All</Radio.Button>
                      <Radio.Button value="income">Income</Radio.Button>
                      <Radio.Button value="expense">Expense</Radio.Button>
                    </Radio.Group>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[var(--color-night)] mb-1">Category</label>
                    <Radio.Group 
                      value={selectedCategory} 
                      onChange={(e) => setSelectedCategory(e.target.value as TransactionCategory)}
                      size="small"
                      buttonStyle="solid"
                      className="flex flex-wrap gap-1"
                    >
                      <Radio.Button value="">All</Radio.Button>
                      <Radio.Button value="Food">Food & Dining</Radio.Button>
                      <Radio.Button value="Transportation">Transportation</Radio.Button>
                      <Radio.Button value="Entertainment">Entertainment</Radio.Button>
                      <Radio.Button value="Utilities">Utilities</Radio.Button>
                      <Radio.Button value="Salary">Salary</Radio.Button>
                      <Radio.Button value="Other">Other</Radio.Button>
                    </Radio.Group>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[var(--color-night)] mb-1">Date Range</label>
                    <DatePicker.RangePicker
                      size="small"
                      onChange={(dates: [Dayjs | null, Dayjs | null] | null) => {
                        if (dates && dates[0] && dates[1]) {
                          setDateRange([dates[0], dates[1]]);
                        } else {
                          setDateRange([null, null]);
                        }
                      }}
                      className="w-full"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Transaction Table */}
            <div className="bg-[var(--color-white)] p-4 rounded-lg flex-1 flex flex-col overflow-hidden">
              <Table
                columns={columns}
                dataSource={paginatedTransactions}
                pagination={false}
                size="small"
                rowKey="id"
                scroll={{ y: 'calc(100% - 60px)' }}
              />

              {/* Pagination */}
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                <div className="text-xs text-gray-600">
                  Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredTransactions.length)} of {filteredTransactions.length} transactions
                </div>
                <Space>
                  <Button 
                    type="text"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="text-[var(--color-cerulean)] hover:text-[var(--color-cerulean)] hover:opacity-80"
                  >
                    Previous
                  </Button>
                  <Button 
                    type="text"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="text-[var(--color-cerulean)] hover:text-[var(--color-cerulean)] hover:opacity-80"
                  >
                    Next
                  </Button>
                </Space>
              </div>
            </div>
          </div>

          {/* Right Half - Charts */}
          <div className="w-1/2 flex flex-col gap-4 overflow-auto">
            {/* Income vs Expenses Chart */}
            <Card className="rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xs font-bold text-[var(--color-night)]">Income vs. Expenses</h2>
                <Space>
                  <Radio.Group 
                    value={timeFrame} 
                    onChange={(e) => setTimeFrame(e.target.value)}
                    size="small"
                    buttonStyle="solid"
                    className="flex-nowrap"
                  >
                    <Radio.Button value="all">All Time</Radio.Button>
                    <Radio.Button value="custom">Custom</Radio.Button>
                  </Radio.Group>
                  
                  {timeFrame === 'custom' && (
                    <DatePicker.RangePicker
                      size="small"
                      value={[dateRange[0] || null, dateRange[1] || null]}
                      onChange={(dates) => {
                        setDateRange(dates || [null, null]);
                      }}
                    />
                  )}
                </Space>
              </div>
              <div className="h-64">
                {barChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#666"
                        fontSize={10}
                        tickFormatter={(value) => value}
                      />
                      <YAxis 
                        stroke="#666"
                        fontSize={10}
                        tickFormatter={(value) => `$${value}`}
                        domain={['auto', 'auto']}
                      />
                      <Tooltip 
                        formatter={(value: number, name: string) => [`$${value.toFixed(2)}`, name]}
                        contentStyle={{ backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '4px', fontSize: '10px' }}
                      />
                      <Legend wrapperStyle={{ fontSize: '10px' }} />
                      <Bar 
                        dataKey="income" 
                        fill="var(--color-pistachio)" 
                        name="Income"
                      />
                      <Bar 
                        dataKey="expense" 
                        fill="var(--color-cerulean)" 
                        name="Expense"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-[var(--color-cerulean)] text-xs">
                    No data available
                  </div>
                )}
              </div>
            </Card>

            {/* Category Distribution Chart */}
            <Card className="rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xs font-bold text-[var(--color-night)]">Category Distribution</h2>
                <Space>
                  <Radio.Group 
                    value={timeFrame} 
                    onChange={(e) => setTimeFrame(e.target.value)}
                    size="small"
                    buttonStyle="solid"
                    className="flex-nowrap"
                  >
                    <Radio.Button value="all">All Time</Radio.Button>
                    <Radio.Button value="custom">Custom</Radio.Button>
                  </Radio.Group>
                  
                  {timeFrame === 'custom' && (
                    <DatePicker.RangePicker
                      size="small"
                      value={[dateRange[0] || null, dateRange[1] || null]}
                      onChange={(dates) => {
                        setDateRange(dates || [null, null]);
                      }}
                    />
                  )}
                </Space>
              </div>
              <div className="h-64">
                {pieChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ percent }) => (
                          <text 
                            x={0} 
                            y={0} 
                            fill="var(--color-night)"
                            textAnchor="middle"
                            dominantBaseline="central"
                            style={{ fontSize: '10px' }}
                          >
                            {`${(percent * 100).toFixed(0)}%`}
                          </text>
                        )}
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number, name: string) => [`$${value.toFixed(2)}`, name]}
                        contentStyle={{ backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '4px', fontSize: '10px' }}
                      />
                      <Legend 
                        wrapperStyle={{ fontSize: '10px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-[var(--color-cerulean)] text-xs">
                    No category data available
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Transaction Form Modal */}
      <Modal
        title={editingTransaction ? "Edit Transaction" : "Add Transaction"}
        open={showForm}
        onCancel={handleFormCancel}
        footer={null}
        width={500}
      >
        <TransactionForm
          transaction={editingTransaction || undefined}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      </Modal>
    </Layout>
  );
};

export default LedgerPage;