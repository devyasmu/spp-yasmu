import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Settings as SettingsIcon, 
  User, 
  School, 
  CreditCard, 
  Shield, 
  Bell, 
  Database,
  Mail,
  Printer,
  Download,
  Upload,
  Save,
  Eye,
  EyeOff
} from 'lucide-react';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    general: {
      schoolName: 'SMA Negeri 1 Jakarta',
      schoolAddress: 'Jl. Budi Kemuliaan I No.2, RT.2/RW.2, Gambir, Jakarta Pusat',
      schoolPhone: '021-3441805',
      schoolEmail: 'info@sman1jakarta.sch.id',
      academicYear: '2024/2025',
      semester: 'Ganjil',
      timezone: 'Asia/Jakarta'
    },
    payment: {
      sppAmount: 400000,
      uangGedung: 500000,
      uangBuku: 300000,
      uangSeragam: 200000,
      uangKegiatan: 150000,
      lateFee: 50000,
      lateFeeDays: 7,
      paymentMethods: {
        cash: true,
        transfer: true,
        card: true
      }
    },
    notification: {
      emailNotifications: true,
      smsNotifications: false,
      reminderDays: 7,
      autoReminder: true,
      paymentConfirmation: true
    },
    system: {
      autoBackup: true,
      backupFrequency: 'daily',
      dataRetention: 365,
      auditLog: true,
      sessionTimeout: 30
    }
  });

  const tabs = [
    { id: 'general', label: 'Umum', icon: SettingsIcon },
    { id: 'payment', label: 'Pembayaran', icon: CreditCard },
    { id: 'notification', label: 'Notifikasi', icon: Bell },
    { id: 'system', label: 'Sistem', icon: Database },
    { id: 'users', label: 'Pengguna', icon: User },
    { id: 'backup', label: 'Backup', icon: Download }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  const handleSave = () => {
    // Simulate saving settings
    alert('Pengaturan berhasil disimpan!');
  };

  const GeneralSettings = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center mb-4">
          <School className="w-5 h-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">Informasi Sekolah</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Sekolah
            </label>
            <input
              type="text"
              value={settings.general.schoolName}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                general: { ...prev.general, schoolName: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tahun Akademik
            </label>
            <input
              type="text"
              value={settings.general.academicYear}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                general: { ...prev.general, academicYear: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alamat Sekolah
            </label>
            <textarea
              value={settings.general.schoolAddress}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                general: { ...prev.general, schoolAddress: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nomor Telepon
            </label>
            <input
              type="tel"
              value={settings.general.schoolPhone}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                general: { ...prev.general, schoolPhone: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={settings.general.schoolEmail}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                general: { ...prev.general, schoolEmail: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const PaymentSettings = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center mb-4">
          <CreditCard className="w-5 h-5 text-green-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">Struktur Biaya</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SPP Bulanan (Rp)
            </label>
            <input
              type="number"
              value={settings.payment.sppAmount}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                payment: { ...prev.payment, sppAmount: parseInt(e.target.value) }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Uang Gedung (Rp)
            </label>
            <input
              type="number"
              value={settings.payment.uangGedung}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                payment: { ...prev.payment, uangGedung: parseInt(e.target.value) }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Uang Buku (Rp)
            </label>
            <input
              type="number"
              value={settings.payment.uangBuku}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                payment: { ...prev.payment, uangBuku: parseInt(e.target.value) }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Uang Seragam (Rp)
            </label>
            <input
              type="number"
              value={settings.payment.uangSeragam}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                payment: { ...prev.payment, uangSeragam: parseInt(e.target.value) }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Denda Keterlambatan (Rp)
            </label>
            <input
              type="number"
              value={settings.payment.lateFee}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                payment: { ...prev.payment, lateFee: parseInt(e.target.value) }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hari Toleransi Keterlambatan
            </label>
            <input
              type="number"
              value={settings.payment.lateFeeDays}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                payment: { ...prev.payment, lateFeeDays: parseInt(e.target.value) }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Metode Pembayaran</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Tunai</label>
            <input
              type="checkbox"
              checked={settings.payment.paymentMethods.cash}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                payment: {
                  ...prev.payment,
                  paymentMethods: {
                    ...prev.payment.paymentMethods,
                    cash: e.target.checked
                  }
                }
              }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Transfer Bank</label>
            <input
              type="checkbox"
              checked={settings.payment.paymentMethods.transfer}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                payment: {
                  ...prev.payment,
                  paymentMethods: {
                    ...prev.payment.paymentMethods,
                    transfer: e.target.checked
                  }
                }
              }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Kartu Debit/Kredit</label>
            <input
              type="checkbox"
              checked={settings.payment.paymentMethods.card}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                payment: {
                  ...prev.payment,
                  paymentMethods: {
                    ...prev.payment.paymentMethods,
                    card: e.target.checked
                  }
                }
              }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const NotificationSettings = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center mb-4">
          <Bell className="w-5 h-5 text-orange-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">Pengaturan Notifikasi</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Email Notifikasi</label>
              <p className="text-xs text-gray-500">Kirim notifikasi pembayaran via email</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notification.emailNotifications}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                notification: { ...prev.notification, emailNotifications: e.target.checked }
              }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">SMS Notifikasi</label>
              <p className="text-xs text-gray-500">Kirim notifikasi pembayaran via SMS</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notification.smsNotifications}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                notification: { ...prev.notification, smsNotifications: e.target.checked }
              }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Konfirmasi Pembayaran</label>
              <p className="text-xs text-gray-500">Kirim konfirmasi setelah pembayaran berhasil</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notification.paymentConfirmation}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                notification: { ...prev.notification, paymentConfirmation: e.target.checked }
              }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const SystemSettings = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center mb-4">
          <Database className="w-5 h-5 text-purple-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">Pengaturan Sistem</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Auto Backup</label>
              <p className="text-xs text-gray-500">Backup otomatis database sistem</p>
            </div>
            <input
              type="checkbox"
              checked={settings.system.autoBackup}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                system: { ...prev.system, autoBackup: e.target.checked }
              }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Frekuensi Backup
              </label>
              <select
                value={settings.system.backupFrequency}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  system: { ...prev.system, backupFrequency: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="daily">Harian</option>
                <option value="weekly">Mingguan</option>
                <option value="monthly">Bulanan</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Session Timeout (menit)
              </label>
              <input
                type="number"
                value={settings.system.sessionTimeout}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  system: { ...prev.system, sessionTimeout: parseInt(e.target.value) }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const UsersSettings = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <User className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Manajemen Pengguna</h3>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
            <User className="w-4 h-4 mr-2" />
            Tambah Pengguna
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Administrator</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">admin</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">Admin</td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Aktif
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                  <button className="text-red-600 hover:text-red-900">Hapus</button>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Kasir Satu</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">kasir1</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">Kasir</td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Aktif
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                  <button className="text-red-600 hover:text-red-900">Hapus</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const BackupSettings = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center mb-4">
          <Database className="w-5 h-5 text-green-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">Backup & Restore</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-md font-medium text-gray-800 mb-3">Backup Database</h4>
            <p className="text-sm text-gray-600 mb-4">
              Lakukan backup manual database untuk menjaga keamanan data
            </p>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Backup Sekarang
            </button>
          </div>
          <div>
            <h4 className="text-md font-medium text-gray-800 mb-3">Restore Database</h4>
            <p className="text-sm text-gray-600 mb-4">
              Pulihkan database dari file backup sebelumnya
            </p>
            <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center">
              <Upload className="w-4 h-4 mr-2" />
              Restore Database
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Riwayat Backup</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-800">backup_2024-01-15.sql</p>
              <p className="text-xs text-gray-600">15 Januari 2024 - 10:30 WIB</p>
            </div>
            <div className="flex space-x-2">
              <button className="text-blue-600 hover:text-blue-800 text-sm">Download</button>
              <button className="text-red-600 hover:text-red-800 text-sm">Hapus</button>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-800">backup_2024-01-14.sql</p>
              <p className="text-xs text-gray-600">14 Januari 2024 - 10:30 WIB</p>
            </div>
            <div className="flex space-x-2">
              <button className="text-blue-600 hover:text-blue-800 text-sm">Download</button>
              <button className="text-red-600 hover:text-red-800 text-sm">Hapus</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralSettings />;
      case 'payment':
        return <PaymentSettings />;
      case 'notification':
        return <NotificationSettings />;
      case 'system':
        return <SystemSettings />;
      case 'users':
        return <UsersSettings />;
      case 'backup':
        return <BackupSettings />;
      default:
        return <GeneralSettings />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Pengaturan Sistem</h1>
          <p className="text-gray-600">Konfigurasi sistem pembayaran SPP</p>
        </div>
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Save className="w-4 h-4 mr-2" />
          Simpan Pengaturan
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      {renderTabContent()}

      {/* User Info */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center">
          <Shield className="w-5 h-5 text-gray-600 mr-2" />
          <div>
            <p className="text-sm font-medium text-gray-800">
              Logged in as: {user?.name} ({user?.role})
            </p>
            <p className="text-xs text-gray-500">
              Last login: {user?.lastLogin?.toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;