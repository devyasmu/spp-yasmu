import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  CreditCard, 
  Search, 
  Plus, 
  Receipt, 
  Calendar,
  User,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  Printer
} from 'lucide-react';

const PaymentManagement: React.FC = () => {
  const { students, payments, addPayment, getPaymentsByStudent } = useData();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'tunai' | 'transfer' | 'kartu'>('tunai');
  const [feeType, setFeeType] = useState('');
  const [notes, setNotes] = useState('');

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.nis.includes(searchTerm);
    return matchesSearch && student.outstandingAmount > 0;
  });

  const recentPayments = payments.slice(-10).reverse();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  const openPaymentModal = (student: any) => {
    setSelectedStudent(student);
    setPaymentAmount(student.outstandingAmount.toString());
    setShowPaymentModal(true);
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedStudent(null);
    setPaymentAmount('');
    setFeeType('');
    setNotes('');
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStudent || !paymentAmount || !feeType) {
      alert('Mohon lengkapi semua field yang diperlukan');
      return;
    }

    const amount = parseInt(paymentAmount);
    if (amount <= 0 || amount > selectedStudent.outstandingAmount) {
      alert('Jumlah pembayaran tidak valid');
      return;
    }

    const payment = {
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      amount,
      feeType,
      paymentMethod,
      status: 'completed' as const,
      processedBy: user?.name || '',
      receiptNumber: `RCP-${Date.now()}`,
      notes
    };

    addPayment(payment);
    closePaymentModal();
    
    // Show success message
    alert('Pembayaran berhasil diproses!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'failed':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const PaymentModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Proses Pembayaran</h2>
          <button
            onClick={closePaymentModal}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        {selectedStudent && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center mb-2">
              <User className="w-5 h-5 text-blue-600 mr-2" />
              <span className="font-medium">{selectedStudent.name}</span>
            </div>
            <div className="text-sm text-gray-600">
              <p>NIS: {selectedStudent.nis}</p>
              <p>Kelas: {selectedStudent.class}</p>
              <p>Tunggakan: {formatCurrency(selectedStudent.outstandingAmount)}</p>
            </div>
          </div>
        )}

        <form onSubmit={handlePayment} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jenis Pembayaran
            </label>
            <select
              value={feeType}
              onChange={(e) => setFeeType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Pilih jenis pembayaran</option>
              <option value="SPP Januari">SPP Januari</option>
              <option value="SPP Februari">SPP Februari</option>
              <option value="SPP Maret">SPP Maret</option>
              <option value="SPP April">SPP April</option>
              <option value="SPP Mei">SPP Mei</option>
              <option value="SPP Juni">SPP Juni</option>
              <option value="SPP Juli">SPP Juli</option>
              <option value="SPP Agustus">SPP Agustus</option>
              <option value="SPP September">SPP September</option>
              <option value="SPP Oktober">SPP Oktober</option>
              <option value="SPP November">SPP November</option>
              <option value="SPP Desember">SPP Desember</option>
              <option value="Uang Gedung">Uang Gedung</option>
              <option value="Uang Buku">Uang Buku</option>
              <option value="Uang Seragam">Uang Seragam</option>
              <option value="Uang Kegiatan">Uang Kegiatan</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jumlah Pembayaran (Rp)
            </label>
            <input
              type="number"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="1"
              max={selectedStudent?.outstandingAmount || 0}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Metode Pembayaran
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as 'tunai' | 'transfer' | 'kartu')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="tunai">Tunai</option>
              <option value="transfer">Transfer Bank</option>
              <option value="kartu">Kartu Debit/Kredit</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Catatan (Opsional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Tambahkan catatan pembayaran..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={closePaymentModal}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Proses Pembayaran
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Pembayaran</h1>
          <p className="text-gray-600">Proses pembayaran SPP siswa</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Kasir: {user?.name}</p>
          <p className="text-sm text-gray-500">
            {new Date().toLocaleDateString('id-ID', { 
              timeZone: 'Asia/Jakarta',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pembayaran Hari Ini</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(payments.filter(p => 
                  p.processedAt.toDateString() === new Date().toDateString()
                ).reduce((sum, p) => sum + p.amount, 0))}
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
              <p className="text-sm font-medium text-gray-600">Transaksi Hari Ini</p>
              <p className="text-2xl font-bold text-blue-600">
                {payments.filter(p => 
                  p.processedAt.toDateString() === new Date().toDateString()
                ).length}
              </p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Siswa Belum Bayar</p>
              <p className="text-2xl font-bold text-red-600">
                {students.filter(s => s.outstandingAmount > 0).length}
              </p>
            </div>
            <div className="bg-red-100 rounded-full p-3">
              <User className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Payment Processing */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Proses Pembayaran</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Cari siswa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          {filteredStudents.map((student) => (
            <div key={student.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center">
                <div className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{student.name}</p>
                  <p className="text-sm text-gray-600">{student.class} - NIS: {student.nis}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-gray-600">Tunggakan</p>
                  <p className="font-semibold text-red-600">
                    {formatCurrency(student.outstandingAmount)}
                  </p>
                </div>
                <button
                  onClick={() => openPaymentModal(student)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Bayar
                </button>
              </div>
            </div>
          ))}
          {filteredStudents.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? 'Tidak ada siswa yang ditemukan' : 'Semua siswa sudah melunasi pembayaran'}
            </div>
          )}
        </div>
      </div>

      {/* Recent Payments */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Transaksi Terbaru</h2>
          <button className="text-blue-600 hover:text-blue-800 text-sm">
            Lihat Semua
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Siswa
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jenis Pembayaran
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jumlah
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Metode
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.processedAt.toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{payment.studentName}</div>
                    <div className="text-sm text-gray-500">ID: {payment.studentId}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.feeType}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(payment.amount)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                    {payment.paymentMethod}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                      <span className="flex items-center">
                        {getStatusIcon(payment.status)}
                        <span className="ml-1 capitalize">{payment.status}</span>
                      </span>
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 flex items-center">
                      <Printer className="w-4 h-4 mr-1" />
                      Cetak
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showPaymentModal && <PaymentModal />}
    </div>
  );
};

export default PaymentManagement;