import { useState, useEffect, useCallback, useRef } from 'react';
import { format } from 'date-fns';
import Layout from '../components/Layout';
import { useFinance } from '../context/FinanceContext';
import { Transaction, TransactionType, TransactionCategory } from '../types/finance';
import TransactionForm from '../components/TransactionForm';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import { Button, Input, Table, Space, Modal, Radio, DatePicker } from 'antd';
import { SearchOutlined, FilterOutlined, DownloadOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import '../styles/components.css';

const ITEMS_PER_PAGE = 7;

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
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);

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

  useEffect(() => {
    if (!tableContainerRef.current) return;
    
    const calculateItemsPerPage = () => {
      const container = tableContainerRef.current!;
      const table = container.querySelector('.ant-table');
      const header = container.querySelector('.ant-table-thead');
      const row = container.querySelector('.ant-table-row');
      const footer = container.parentElement?.querySelector('.table-footer');
      
      if (!table || !header || !row || !footer) return;
      
      const containerHeight = container.clientHeight;
      const headerHeight = header.clientHeight;
      const rowHeight = row.clientHeight;
      const footerHeight = footer.clientHeight;
      
      const availableHeight = containerHeight - headerHeight - footerHeight;
      const calculatedItems = Math.max(1, Math.floor(availableHeight / rowHeight));
      
      if (calculatedItems !== itemsPerPage) {
        setItemsPerPage(calculatedItems);
      }
    };
    
    // Initial calculation after a short delay to ensure elements are rendered
    setTimeout(calculateItemsPerPage, 100);
    
    const handleResize = () => {
      calculateItemsPerPage();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [itemsPerPage]);

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

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => format(new Date(date), 'MM/dd/yyyy'),
      width: '15%',
      sorter: (a: Transaction, b: Transaction) => new Date(a.date).getTime() - new Date(b.date).getTime()
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: {
        showTitle: true,
      },
      width: '25%'
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: '15%'
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      width: '15%',
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
      width: '10%',
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
      <div className="page-container">
        {/* Header Section */}
        <div className="page-header">
          <div className="flex-col flex-row-sm items-center justify-between gap-4">
            <h1 className="page-title">Transaction Ledger</h1>
            <Button 
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
              className="primary-button"
            >
              Add Transaction
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="ledger-content">
          {/* Left Half - Transaction History */}
          <div className="content-section">
            {/* Search and Filter Section */}
            <div className="card search-filter-section">
              <div className="flex-row items-center gap-2">
                <div className="search-input-container">
                  <Input
                    placeholder="Search transactions..."
                    prefix={<SearchOutlined />}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    size="middle"
                  />
                </div>
                <Space>
                  <Button 
                    type="text"
                    icon={<FilterOutlined />}
                    onClick={() => setShowFilters(!showFilters)}
                    className="icon-button"
                  />
                  <Button 
                    type="text"
                    icon={<DownloadOutlined />}
                    onClick={handleDownloadPDF}
                    className="icon-button"
                  />
                </Space>
              </div>

              {/* Filter Panel */}
              {showFilters && (
                <div className="filter-panel">
                  <div className="form-group">
                    <label className="form-label">Transaction Type</label>
                    <Radio.Group 
                      value={selectedType} 
                      onChange={(e) => setSelectedType(e.target.value as TransactionType)}
                      size="small"
                      buttonStyle="solid"
                      className="filter-group"
                    >
                      <Radio.Button value="">All</Radio.Button>
                      <Radio.Button value="income">Income</Radio.Button>
                      <Radio.Button value="expense">Expense</Radio.Button>
                    </Radio.Group>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <Radio.Group 
                      value={selectedCategory} 
                      onChange={(e) => setSelectedCategory(e.target.value as TransactionCategory)}
                      size="small"
                      buttonStyle="solid"
                      className="filter-group"
                    >
                      <Radio.Button value="">All</Radio.Button>
                      <Radio.Button value="Work">Work</Radio.Button>
                      <Radio.Button value="Allowance">Allowance</Radio.Button>
                      <Radio.Button value="Part-time Job">Part-time Job</Radio.Button>
                      <Radio.Button value="Gift">Gift</Radio.Button>
                      <Radio.Button value="Other Income">Other Income</Radio.Button>
                      <Radio.Button value="Food">Food</Radio.Button>
                      <Radio.Button value="Transportation">Transportation</Radio.Button>
                      <Radio.Button value="Entertainment">Entertainment</Radio.Button>
                      <Radio.Button value="Clothing">Clothing</Radio.Button>
                      <Radio.Button value="Education">Education</Radio.Button>
                      <Radio.Button value="Savings">Savings</Radio.Button>
                      <Radio.Button value="Other Expense">Other Expense</Radio.Button>
                    </Radio.Group>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Date Range</label>
                    <DatePicker.RangePicker
                      className="date-picker"
                      size="small"
                      value={[dateRange[0] || null, dateRange[1] || null]}
                      onChange={(dates) => {
                        setDateRange(dates || [null, null]);
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Transaction Table */}
            <div className="card table-container">
              <div className="table-content" ref={tableContainerRef}>
                <Table
                  dataSource={paginatedTransactions}
                  columns={columns}
                  className="transaction-table"
                  style={{
                    width: '100%'
                  }}
                  size="small"
                  pagination={false}
                  scroll={{ x: 'max-content' }}
                />
              </div>

              {/* Pagination */}
              <div className="table-footer">
              <div className="table-pagination-info">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} transactions
              </div>
                <Space>
                  <Button 
                    type="text"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="pagination-button"
                  >
                    Previous
                  </Button>
                  <Button 
                    type="text"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="pagination-button"
                  >
                    Next
                  </Button>
                </Space>
              </div>
            </div>
          </div>

          {/* Right Half - Charts */}
          <div className="content-section">
            {/* Income vs Expenses Chart */}
            <div className="card chart-container">
              <div className="chart-header">
                <h2 className="chart-title">Income vs. Expenses</h2>
                <Space className="chart-controls" size="small">
                  <Radio.Group 
                    value={timeFrame} 
                    onChange={(e) => setTimeFrame(e.target.value)}
                    size="small"
                    buttonStyle="solid"
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
              <div className="chart-content">
                {barChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barChartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#666"
                        angle={-45}
                        textAnchor="end"
                        height={40}
                        interval={0}
                      />
                      <YAxis 
                        stroke="#666"
                        tickFormatter={(value) => `$${value}`}
                        width={50}
                      />
                      <Tooltip 
                        formatter={(value: number, name: string) => [`$${value.toFixed(2)}`, name]}
                        contentStyle={{ backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '4px' }}
                      />
                      <Legend 
                        verticalAlign="top"
                        height={20}
                      />
                      <Bar dataKey="income" fill="var(--color-pistachio)" name="Income" />
                      <Bar dataKey="expense" fill="var(--color-cerulean)" name="Expense" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="empty-chart-message">
                    No data available
                  </div>
                )}
              </div>
            </div>

            {/* Category Distribution Chart */}
            <div className="card chart-container">
              <div className="chart-header">
                <h2 className="chart-title">Category Distribution</h2>
                <Space className="chart-controls" size="small">
                  <Radio.Group 
                    value={timeFrame} 
                    onChange={(e) => setTimeFrame(e.target.value)}
                    size="small"
                    buttonStyle="solid"
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
              <div className="chart-content">
                {pieChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        innerRadius={40}
                        outerRadius="60%"
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number, name: string) => [`$${value.toFixed(2)}`, name]}
                        contentStyle={{ backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '4px' }}
                      />
                      <Legend 
                        verticalAlign="bottom"
                        height={20}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="empty-chart-message">
                    No category data available
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Form Modal */}
      <Modal
        title={
          <span className="modal-title">
            {editingTransaction ? "Edit Transaction" : "Add Transaction"}
          </span>
        }
        open={showForm}
        onCancel={handleFormCancel}
        footer={null}
        width={500}
        className="transaction-modal"
        styles={{
          content: {
            borderRadius: '8px',
            padding: '24px',
          },
          header: {
            paddingBottom: '16px',
            borderBottom: '1px solid var(--color-offwhite)',
          },
          body: {
            padding: '24px 0',
            fontSize: '1em'
          },
        }}
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