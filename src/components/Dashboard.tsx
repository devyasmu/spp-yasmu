import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import {
  DollarSign,
  Users,
  CreditCard,
  TrendingUp,
  AlertCircle,
  Calendar,
  PieChart,
  Activity
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { getDailyStats, students, payments } = useData();
  
  const stats = getDailyStats();
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  const recentPayments = payments.slice(-5).reverse();
  const pendingPayments = students.filter(s => s.outstandingAmount > 0).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              {getGreeting()}, {user?.name}!
            </h1>
            <p className="text-blue-100 mt-2">
              Selamat datang di Sistem Pembayaran SPP {user?.institution}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-blue-100">Waktu Indonesia Barat</p>
            <p className="text-lg font-semibold">
              {new Date().toLocaleString('id-ID', {
                timeZone: 'Asia/Jakarta',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pembayaran Hari Ini</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.totalCollected)}
              </p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">
              {stats.totalTransactions} transaksi
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Siswa Aktif</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeStudents}</p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <Users className="w-4 h-4 text-blue-500 mr-1" />
            <span className="text-sm text-blue-600">
              Total siswa terdaftar
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tunggakan</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.outstandingAmount)}
              </p>
            </div>
            <div className="bg-orange-100 rounded-full p-3">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <AlertCircle className="w-4 h-4 text-orange-500 mr-1" />
            <span className="text-sm text-orange-600">
              Perlu ditagih
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Transaksi Bulan Ini</p>
              <p className="text-2xl font-bold text-gray-900">{payments.length}</p>
            </div>
            <div className="bg-purple-100 rounded-full p-3">
              <CreditCard className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <Activity className="w-4 h-4 text-purple-500 mr-1" />
            <span className="text-sm text-purple-600">
              Total transaksi
            </span>
          </div>
        </div>
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Payments */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Pembayaran Terbaru</h3>
            <Calendar className="w-5 h-5 text-gray-500" />
          </div>
          <div className="space-y-3">
            {recentPayments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{payment.studentName}</p>
                  <p className="text-sm text-gray-600">{payment.feeType}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">
                    {formatCurrency(payment.amount)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {payment.processedAt.toLocaleDateString('id-ID')}
                  </p>
                </div>
              </div>
            ))}
            {recentPayments.length === 0 && (
              <p className="text-center text-gray-500 py-8">
                Belum ada pembayaran hari ini
              </p>
            )}
          </div>
        </div>

        {/* Pending Payments */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Tunggakan SPP</h3>
            <AlertCircle className="w-5 h-5 text-orange-500" />
          </div>
          <div className="space-y-3">
            {pendingPayments.map((student) => (
              <div key={student.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{student.name}</p>
                  <p className="text-sm text-gray-600">{student.class}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-red-600">
                    {formatCurrency(student.outstandingAmount)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {student.lastPayment ? 
                      `Terakhir: ${student.lastPayment.toLocaleDateString('id-ID')}` : 
                      'Belum ada pembayaran'
                    }
                  </p>
                </div>
              </div>
            ))}
            {pendingPayments.length === 0 && (
              <p className="text-center text-gray-500 py-8">
                Semua pembayaran up to date
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Aksi Cepat</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
            <CreditCard className="w-6 h-6 mb-2" />
            <p className="font-medium">Proses Pembayaran</p>
          </button>
          <button className="p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
            <Users className="w-6 h-6 mb-2" />
            <p className="font-medium">Tambah Siswa</p>
          </button>
          <button className="p-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
            <PieChart className="w-6 h-6 mb-2" />
            <p className="font-medium">Lihat Laporan</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;