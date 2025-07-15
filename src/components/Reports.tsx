import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { 
  FileText, 
  Download, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Users,
  PieChart,
  BarChart3,
  Filter,
  Printer
} from 'lucide-react';

const Reports: React.FC = () => {
  const { students, payments, getDailyStats } = useData();
  const [selectedReport, setSelectedReport] = useState('daily');
  const [dateRange, setDateRange] = useState({
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  const stats = getDailyStats();

  const getPaymentsByMonth = () => {
    const months = {};
    payments.forEach(payment => {
      const month = payment.processedAt.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
      if (!months[month]) {
        months[month] = { total: 0, count: 0 };
      }
      months[month].total += payment.amount;
      months[month].count += 1;
    });
    return months;
  };

  const getPaymentsByClass = () => {
    const classes = {};
    students.forEach(student => {
      if (!classes[student.class]) {
        classes[student.class] = {
          total: 0,
          paid: 0,
          outstanding: 0,
          students: 0
        };
      }
      classes[student.class].total += student.totalFee;
      classes[student.class].paid += student.paidAmount;
      classes[student.class].outstanding += student.outstandingAmount;
      classes[student.class].students += 1;
    });
    return classes;
  };

  const getPaymentMethods = () => {
    const methods = {};
    payments.forEach(payment => {
      if (!methods[payment.paymentMethod]) {
        methods[payment.paymentMethod] = { count: 0, total: 0 };
      }
      methods[payment.paymentMethod].count += 1;
      methods[payment.paymentMethod].total += payment.amount;
    });
    return methods;
  };

  const monthlyPayments = getPaymentsByMonth();
  const classPayments = getPaymentsByClass();
  const paymentMethods = getPaymentMethods();

  const reportTypes = [
    { id: 'daily', label: 'Laporan Harian', icon: Calendar },
    { id: 'monthly', label: 'Laporan Bulanan', icon: BarChart3 },
    { id: 'class', label: 'Laporan Per Kelas', icon: Users },
    { id: 'outstanding', label: 'Laporan Tunggakan', icon: DollarSign },
    { id: 'payment-methods', label: 'Metode Pembayaran', icon: PieChart }
  ];

  const DailyReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Pembayaran</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(stats.totalCollected)}
              </p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Jumlah Transaksi</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalTransactions}</p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rata-rata Pembayaran</p>
              <p className="text-2xl font-bold text-purple-600">
                {formatCurrency(stats.totalTransactions > 0 ? stats.totalCollected / stats.totalTransactions : 0)}
              </p>
            </div>
            <div className="bg-purple-100 rounded-full p-3">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Siswa Aktif</p>
              <p className="text-2xl font-bold text-orange-600">{stats.activeStudents}</p>
            </div>
            <div className="bg-orange-100 rounded-full p-3">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Transaksi Hari Ini</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Waktu</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Siswa</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jenis Pembayaran</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jumlah</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Metode</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.filter(p => p.processedAt.toDateString() === new Date().toDateString()).map((payment) => (
                <tr key={payment.id}>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.processedAt.toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta' })}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{payment.studentName}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{payment.feeType}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(payment.amount)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                    {payment.paymentMethod}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const MonthlyReport = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Pembayaran Per Bulan</h3>
        <div className="space-y-4">
          {Object.entries(monthlyPayments).map(([month, data]) => (
            <div key={month} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">{month}</p>
                <p className="text-sm text-gray-600">{data.count} transaksi</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-green-600">{formatCurrency(data.total)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const ClassReport = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Pembayaran Per Kelas</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kelas</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jumlah Siswa</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Tagihan</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sudah Dibayar</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tunggakan</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Persentase</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(classPayments).map(([className, data]) => (
                <tr key={className}>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{className}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{data.students}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(data.total)}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-green-600">{formatCurrency(data.paid)}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-red-600">{formatCurrency(data.outstanding)}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {((data.paid / data.total) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const OutstandingReport = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Laporan Tunggakan</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Siswa</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kelas</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Tagihan</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sudah Dibayar</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tunggakan</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pembayaran Terakhir</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.filter(s => s.outstandingAmount > 0).map((student) => (
                <tr key={student.id}>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{student.name}</div>
                    <div className="text-sm text-gray-500">NIS: {student.nis}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{student.class}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(student.totalFee)}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-green-600">{formatCurrency(student.paidAmount)}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-red-600 font-medium">{formatCurrency(student.outstandingAmount)}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.lastPayment ? student.lastPayment.toLocaleDateString('id-ID') : 'Belum ada'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const PaymentMethodsReport = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Metode Pembayaran</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(paymentMethods).map(([method, data]) => (
            <div key={method} className="bg-gray-50 p-4 rounded-lg">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600 capitalize">{method}</p>
                <p className="text-2xl font-bold text-blue-600">{data.count}</p>
                <p className="text-sm text-gray-500">{formatCurrency(data.total)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderReport = () => {
    switch (selectedReport) {
      case 'daily':
        return <DailyReport />;
      case 'monthly':
        return <MonthlyReport />;
      case 'class':
        return <ClassReport />;
      case 'outstanding':
        return <OutstandingReport />;
      case 'payment-methods':
        return <PaymentMethodsReport />;
      default:
        return <DailyReport />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Laporan</h1>
          <p className="text-gray-600">Analisis dan laporan pembayaran SPP</p>
        </div>
        <div className="flex space-x-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center">
            <Printer className="w-4 h-4 mr-2" />
            Print
          </button>
        </div>
      </div>

      {/* Report Navigation */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-wrap gap-2">
          {reportTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => setSelectedReport(type.id)}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  selectedReport === type.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {type.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Periode:</span>
          </div>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <span className="text-gray-500">s/d</span>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
        </div>
      </div>

      {/* Report Content */}
      {renderReport()}

      {/* Summary Footer */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Siswa</p>
            <p className="text-2xl font-bold text-gray-800">{students.length}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Tagihan</p>
            <p className="text-2xl font-bold text-blue-600">
              {formatCurrency(students.reduce((sum, s) => sum + s.totalFee, 0))}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Sudah Dibayar</p>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(students.reduce((sum, s) => sum + s.paidAmount, 0))}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Tunggakan</p>
            <p className="text-2xl font-bold text-red-600">
              {formatCurrency(students.reduce((sum, s) => sum + s.outstandingAmount, 0))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;