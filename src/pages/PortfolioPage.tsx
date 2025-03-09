// src/pages/PortfolioPage.tsx
import { useState, useEffect, useCallback } from 'react';
import { format, subDays, startOfMonth } from 'date-fns';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useFinance } from '../context/FinanceContext';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Radio, Card, Statistic } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

// Finance tips for the AI section
const FINANCE_TIPS = [
  "Save at least 20% of your income for future goals.",
  "Track your spending to identify areas where you can cut back.",
  "Set specific financial goals to stay motivated.",
  "Consider opening a student savings account with no fees.",
  "Try the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings.",
  "Reduce impulse purchases by waiting 24 hours before buying non-essentials.",
  "Start building your emergency fund with small regular deposits.",
  "Learn about compound interest - it's the eighth wonder of the world!",
  "Shop around for the best prices on big purchases.",
  "Consider using cash instead of cards for discretionary spending."
];

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

const PortfolioPage = () => {
  const { currentUser } = useAuth();
  const { 
    transactions, 
    currentBalance, 
    totalIncome, 
    totalExpenses
  } = useFinance();
  
  const [timeFrame, setTimeFrame] = useState<'week' | 'month' | 'all'>('month');
  const [lineChartData, setLineChartData] = useState<ChartData[]>([]);
  const [pieChartData, setPieChartData] = useState<PieData[]>([]);
  const [randomTip, setRandomTip] = useState('');
  const [biggestExpense, setBiggestExpense] = useState<{ category: string; amount: number }>({ category: '', amount: 0 });
  const [mostProfitableMonth, setMostProfitableMonth] = useState<{ month: string; amount: number }>({ month: '', amount: 0 });
  const [savingsRate, setSavingsRate] = useState<number>(0);

  // Calculate additional stats
  const calculateStats = useCallback(() => {
    // Find biggest expense category
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    const categoryMap: { [key: string]: number } = {};
    expenseTransactions.forEach(t => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
    });
    const biggest = Object.entries(categoryMap)
      .reduce((max, [category, amount]) => 
        amount > max.amount ? { category, amount } : max,
        { category: '', amount: 0 }
      );
    setBiggestExpense(biggest);

    // Find most profitable month
    const monthlyProfits: { [key: string]: number } = {};
    transactions.forEach(t => {
      const month = format(new Date(t.date), 'MMMM yyyy');
      monthlyProfits[month] = (monthlyProfits[month] || 0) + (t.type === 'income' ? t.amount : -t.amount);
    });
    const mostProfitable = Object.entries(monthlyProfits)
      .reduce((max, [month, amount]) => 
        amount > max.amount ? { month, amount } : max,
        { month: '', amount: -Infinity }
      );
    setMostProfitableMonth(mostProfitable);

    // Calculate savings rate
    const savings = totalIncome - totalExpenses;
    setSavingsRate((savings / totalIncome) * 100);
  }, [transactions, totalIncome, totalExpenses]);

  // Modified prepareChartData function to handle simpler date ranges
  const prepareChartData = useCallback(() => {
    // For line chart
    const lineData: { [key: string]: { date: string, income: number, expense: number } } = {};
    const dateFormat = 'MM/dd';
    
    let startDate: Date;
    const endDate = new Date();
    
    // Determine date range based on selection
    if (timeFrame === 'week') {
      startDate = subDays(new Date(), 6); // Last 7 days
      
      // Initialize dates for week view
      const days = 7;
      for (let i = 0; i < days; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        const dateKey = format(date, dateFormat);
        lineData[dateKey] = {
          date: dateKey,
          income: 0,
          expense: 0
        };
      }
    } else if (timeFrame === 'month') {
      startDate = startOfMonth(new Date());
      
      // Initialize dates for month view
      const days = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      for (let i = 0; i <= days; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        const dateKey = format(date, dateFormat);
        lineData[dateKey] = {
          date: dateKey,
          income: 0,
          expense: 0
        };
      }
    } else {
      // For all time, only include dates with transactions
      startDate = new Date(0); // All time
    }

    // Filter transactions for the line chart based on date range
    const filteredTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
    
    // For all time view, create entries only for dates with transactions
    if (timeFrame === 'all') {
      filteredTransactions.forEach(transaction => {
        const dateKey = format(new Date(transaction.date), dateFormat);
        if (!lineData[dateKey]) {
          lineData[dateKey] = {
            date: dateKey,
            income: 0,
            expense: 0
          };
        }
      });
    }
    
    // Populate with filtered transaction data
    filteredTransactions.forEach(transaction => {
      const dateKey = format(new Date(transaction.date), dateFormat);
      if (transaction.type === 'income') {
        lineData[dateKey].income += transaction.amount;
      } else {
        lineData[dateKey].expense += transaction.amount;
      }
    });

    // Convert to array and sort by date
    const sortedData = Object.values(lineData).sort((a, b) => {
      const [monthA, dayA] = a.date.split('/').map(Number);
      const [monthB, dayB] = b.date.split('/').map(Number);
      
      const currentYear = new Date().getFullYear();
      const dateA = new Date(currentYear, monthA - 1, dayA);
      const dateB = new Date(currentYear, monthB - 1, dayB);
      
      return dateA.getTime() - dateB.getTime();
    });

    setLineChartData(sortedData);

    // Pie chart data preparation
    let pieFilteredTransactions;
    
    if (timeFrame === 'week') {
      startDate = subDays(new Date(), 6); // Last 7 days
      pieFilteredTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= startDate && transactionDate <= endDate;
      });
    } else if (timeFrame === 'month') {
      startDate = startOfMonth(new Date());
      pieFilteredTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= startDate && transactionDate <= endDate;
      });
    } else {
      // 'all' timeframe
      pieFilteredTransactions = transactions;
    }

    const expenseTransactions = pieFilteredTransactions.filter(t => t.type === 'expense');
    const categoryMap: { [key: string]: number } = {};

    expenseTransactions.forEach(transaction => {
      const category = transaction.category || 'Uncategorized';
      categoryMap[category] = (categoryMap[category] || 0) + transaction.amount;
    });

    const pieData = Object.entries(categoryMap)
      .map(([category, amount]) => ({
        name: category,
        value: amount
      }))
      .sort((a, b) => b.value - a.value);

    setPieChartData(pieData);
  }, [transactions, timeFrame]);

  // Get random finance tip
  useEffect(() => {
    const tipIndex = Math.floor(Math.random() * FINANCE_TIPS.length);
    setRandomTip(FINANCE_TIPS[tipIndex]);
  }, []);

  // Prepare chart data based on transactions
  useEffect(() => {
    console.log('Transactions changed:', transactions.length);
    console.log('Time frame:', timeFrame);
    
    if (transactions.length > 0) {
      prepareChartData();
      calculateStats();
    } else {
      console.warn('No transactions available');
    }
  }, [transactions, timeFrame, prepareChartData, calculateStats]);

  return (
    <Layout>
      <div className="portfolio-page-container">
        {/* Welcome Section - Fixed height */}
        <div className="page-header">
          <h1 className="page-title">
            Welcome back, {currentUser?.name || 'Student'}
          </h1>
        </div>

        {/* Quick Stats */}
        <div className="quick-stats">
          <Card className="rounded-lg border-l-4 border-[var(--color-darkgreen)]">
            <Statistic
              title={<span className="text-sm font-semibold text-[var(--color-night)]">Current Balance</span>}
              value={currentBalance}
              precision={2}
              prefix="$"
              valueStyle={{ color: 'var(--color-darkgreen)' }}
            />
            <p className="text-xs text-gray-500 mt-1">Real-time net worth</p>
          </Card>
          <Card className="rounded-lg border-l-4 border-[var(--color-pistachio)]">
            <Statistic
              title={<span className="text-sm font-semibold text-[var(--color-night)]">Total Income</span>}
              value={totalIncome}
              precision={2}
              prefix="$"
              suffix={<ArrowUpOutlined style={{ color: 'var(--color-pistachio)' }} />}
              valueStyle={{ color: 'var(--color-pistachio)' }}
            />
            <p className="text-xs text-gray-500 mt-1">YTD earnings</p>
          </Card>
          <Card className="rounded-lg border-l-4 border-[var(--color-cerulean)]">
            <Statistic
              title={<span className="text-sm font-semibold text-[var(--color-night)]">Total Expenses</span>}
              value={totalExpenses}
              precision={2}
              prefix="$"
              suffix={<ArrowDownOutlined style={{ color: 'var(--color-cerulean)' }} />}
              valueStyle={{ color: 'var(--color-cerulean)' }}
            />
            <p className="text-xs text-gray-500 mt-1">YTD spending</p>
          </Card>
          <Card className="rounded-lg border-l-4 border-[var(--color-pistachio)]">
            <Statistic
              title={<span className="text-sm font-semibold text-[var(--color-night)]">Net Balance</span>}
              value={totalIncome - totalExpenses}
              precision={2}
              prefix="$"
              valueStyle={{ color: 'var(--color-pistachio)' }}
            />
            <p className="text-xs text-gray-500 mt-1">Financial health indicator</p>
          </Card>
        </div>

          {/* Charts Section - 70% */}
          <div className="charts-section">
            {/* Left Column - Line Chart */}
            <Card className="w-full h-full" bodyStyle={{ height: '100%', padding: '16px' }}>
              <div className="h-full flex flex-col">
                <div className="flex sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <h2 className="text-lg font-bold text-[var(--color-night)]" style={{ fontFamily: 'Fraunces' }}>Income vs. Expenses</h2>
                  <Radio.Group 
                    value={timeFrame} 
                    onChange={(e) => setTimeFrame(e.target.value)}
                    size="small"
                    buttonStyle="solid"
                    className="flex-nowrap"
                  >
                    <Radio.Button value="week">Week</Radio.Button>
                    <Radio.Button value="month">Month</Radio.Button>
                    <Radio.Button value="all">All</Radio.Button>
                  </Radio.Group>
                </div>
                <div className="flex-1 min-h-0">
                  {lineChartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={lineChartData} margin={{ top: 20, right: 30, left: 10, bottom: 40 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
                        <XAxis 
                          dataKey="date" 
                          stroke="#666"
                          fontSize={12}
                          tickFormatter={(value) => value}
                          angle={-45}
                          textAnchor="end"
                          height={60}
                          interval={0}
                        />
                        <YAxis 
                          stroke="#666"
                          fontSize={12}
                          tickFormatter={(value) => `$${value}`}
                          width={80}
                        />
                        <Tooltip 
                          formatter={(value: number, name: string) => [`$${value.toFixed(2)}`, name]}
                          contentStyle={{ backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px' }}
                        />
                        <Legend 
                          verticalAlign="top"
                          height={36}
                          wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="income" 
                          stroke="var(--color-pistachio)" 
                          strokeWidth={2}
                          dot={{ r: 3 }}
                          activeDot={{ r: 5 }} 
                          name="Income"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="expense" 
                          stroke="var(--color-cerulean)" 
                          strokeWidth={2}
                          dot={{ r: 3 }}
                          activeDot={{ r: 5 }}
                          name="Expense"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-[var(--color-cerulean)] text-xs">
                      No data available for selected time period
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Right Column - Pie Chart */}
            <Card className="w-full h-full" bodyStyle={{ height: '100%', padding: '16px' }}>
              <div className="h-full flex flex-col">
                <div className="flex sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <h2 className="text-lg font-bold text-[var(--color-night)]" style={{ fontFamily: 'Fraunces' }}>Expense Category Distribution</h2>
                  <Radio.Group 
                    value={timeFrame} 
                    onChange={(e) => setTimeFrame(e.target.value)}
                    size="small"
                    buttonStyle="solid"
                    className="flex-nowrap"
                  >
                    <Radio.Button value="week">Week</Radio.Button>
                    <Radio.Button value="month">Month</Radio.Button>
                    <Radio.Button value="all">All</Radio.Button>
                  </Radio.Group>
                </div>
                <div className="flex-1 min-h-0">
                  {pieChartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart margin={{ top: 20, right: 30, left: 10, bottom: 40 }}>
                        <Pie
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          innerRadius={60}
                          outerRadius="70%"
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
                          contentStyle={{ backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px' }}
                        />
                        <Legend 
                          verticalAlign="bottom"
                          height={36}
                          wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-[var(--color-cerulean)] text-xs">
                      No expense data available
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Bottom Stats - 15% */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card 
              className="rounded-lg w-full h-full"
            >
              <Statistic
                title={<span className="text-sm font-semibold text-[var(--color-night)]">Biggest Expense</span>}
                value={biggestExpense.amount}
                precision={2}
                prefix="$"
                valueStyle={{ color: 'var(--color-cerulean)', fontSize: '1.25rem' }}
              />
              <p className="text-sm text-[var(--color-cerulean)]">{biggestExpense.category}</p>
              <p className="text-xs text-gray-500 mt-1">Primary spending category</p>
            </Card>
            <Card 
              className="rounded-lg w-full h-full"
            >
              <Statistic
                title={<span className="text-sm font-semibold text-[var(--color-night)]">Most Profitable Month</span>}
                value={mostProfitableMonth.amount}
                precision={2}
                prefix="$"
                valueStyle={{ color: 'var(--color-pistachio)', fontSize: '1.25rem' }}
              />
              <p className="text-sm text-[var(--color-pistachio)]">{mostProfitableMonth.month}</p>
              <p className="text-xs text-gray-500 mt-1">Peak financial performance</p>
            </Card>
            <Card 
              className="rounded-lg w-full h-full"
            >
              <Statistic
                title={<span className="text-sm font-semibold text-[var(--color-night)]">Savings Rate</span>}
                value={savingsRate}
                precision={1}
                suffix="%"
                valueStyle={{ color: 'var(--color-darkgreen)', fontSize: '1.25rem' }}
              />
              <p className="text-xs text-[var(--color-night)]">of total income</p>
              <p className="text-xs text-gray-500 mt-1">Financial discipline metric</p>
            </Card>
            <Card 
              className="rounded-lg w-full h-full border border-[var(--color-cerulean)]"
            >
              <h2 className="text-md font-semibold text-[var(--color-cerulean)] mb-2">💡 Financial Intelligence</h2>
              <p className="text-sm text-[var(--color-night)]">{randomTip}</p>
            </Card>
          </div>
        </div>
    </Layout>
  );
};

export default PortfolioPage;