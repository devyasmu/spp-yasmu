import React, { useState } from 'react';
import { useSchool } from '../contexts/SchoolContext';
import { 
  School, 
  Plus, 
  Edit, 
  Trash2, 
  MapPin,
  Phone,
  Mail,
  User,
  Calendar,
  Settings,
  BarChart3,
  Users,
  DollarSign,
  CheckCircle,
  XCircle
} from 'lucide-react';

const InstitutionManagement: React.FC = () => {
  const { 
    institutions, 
    addInstitution, 
    updateInstitution, 
    deleteInstitution,
    getInstitutionReport,
    getClassesByInstitution
  } = useSchool();
  
  const [showModal, setShowModal] = useState(false);
  const [selectedInstitution, setSelectedInstitution] = useState<any>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  const openModal = (mode: 'add' | 'edit' | 'view', institution?: any) => {
    setModalMode(mode);
    setSelectedInstitution(institution || null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedInstitution(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const institutionData = {
      name: formData.get('name') as string,
      code: formData.get('code') as string,
      address: formData.get('address') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      principalName: formData.get('principalName') as string,
      establishedYear: parseInt(formData.get('establishedYear') as string),
      status: formData.get('status') as 'active' | 'inactive',
      settings: {
        currency: formData.get('currency') as string,
        timezone: formData.get('timezone') as string,
        academicYearStart: parseInt(formData.get('academicYearStart') as string),
        paymentDueDays: parseInt(formData.get('paymentDueDays') as string),
        lateFeePercentage: parseFloat(formData.get('lateFeePercentage') as string),
        enableAutoReminders: formData.get('enableAutoReminders') === 'on'
      }
    };

    if (modalMode === 'add') {
      addInstitution(institutionData);
    } else if (modalMode === 'edit' && selectedInstitution) {
      updateInstitution(selectedInstitution.id, institutionData);
    }
    
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus institusi ini?')) {
      deleteInstitution(id);
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getStatusIcon = (status: string) => {
    return status === 'active' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />;
  };

  const InstitutionModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            {modalMode === 'add' ? 'Tambah Institusi' : 
             modalMode === 'edit' ? 'Edit Institusi' : 'Detail Institusi'}
          </h2>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        {modalMode === 'view' && selectedInstitution ? (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-4">Informasi Institusi</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Nama Institusi</p>
                  <p className="font-medium">{selectedInstitution.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Kode</p>
                  <p className="font-medium">{selectedInstitution.code}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">Alamat</p>
                  <p className="font-medium">{selectedInstitution.address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Telepon</p>
                  <p className="font-medium">{selectedInstitution.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{selectedInstitution.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Kepala Sekolah</p>
                  <p className="font-medium">{selectedInstitution.principalName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tahun Berdiri</p>
                  <p className="font-medium">{selectedInstitution.establishedYear}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-4">Pengaturan Sistem</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Mata Uang</p>
                  <p className="font-medium">{selectedInstitution.settings.currency}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Zona Waktu</p>
                  <p className="font-medium">{selectedInstitution.settings.timezone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Mulai Tahun Akademik</p>
                  <p className="font-medium">Bulan {selectedInstitution.settings.academicYearStart}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Batas Pembayaran</p>
                  <p className="font-medium">{selectedInstitution.settings.paymentDueDays} hari</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Denda Keterlambatan</p>
                  <p className="font-medium">{selectedInstitution.settings.lateFeePercentage}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Auto Reminder</p>
                  <p className="font-medium">
                    {selectedInstitution.settings.enableAutoReminders ? 'Aktif' : 'Tidak Aktif'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-4">Statistik</h3>
              {(() => {
                const report = getInstitutionReport(selectedInstitution.id);
                const classes = getClassesByInstitution(selectedInstitution.id);
                return (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Total Kelas</p>
                      <p className="font-medium">{classes.length}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Siswa</p>
                      <p className="font-medium">{report.totalStudents}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Tagihan</p>
                      <p className="font-medium">{formatCurrency(report.totalFees)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Terkumpul</p>
                      <p className="font-medium text-green-600">{formatCurrency(report.totalCollected)}</p>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Institusi
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={selectedInstitution?.name || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kode Institusi
                </label>
                <input
                  type="text"
                  name="code"
                  defaultValue={selectedInstitution?.code || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alamat
              </label>
              <textarea
                name="address"
                defaultValue={selectedInstitution?.address || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nomor Telepon
                </label>
                <input
                  type="tel"
                  name="phone"
                  defaultValue={selectedInstitution?.phone || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  defaultValue={selectedInstitution?.email || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Kepala Sekolah
                </label>
                <input
                  type="text"
                  name="principalName"
                  defaultValue={selectedInstitution?.principalName || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tahun Berdiri
                </label>
                <input
                  type="number"
                  name="establishedYear"
                  defaultValue={selectedInstitution?.establishedYear || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                defaultValue={selectedInstitution?.status || 'active'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="active">Aktif</option>
                <option value="inactive">Tidak Aktif</option>
              </select>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Pengaturan Sistem</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mata Uang
                  </label>
                  <select
                    name="currency"
                    defaultValue={selectedInstitution?.settings?.currency || 'IDR'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="IDR">IDR (Rupiah)</option>
                    <option value="USD">USD (Dollar)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Zona Waktu
                  </label>
                  <select
                    name="timezone"
                    defaultValue={selectedInstitution?.settings?.timezone || 'Asia/Jakarta'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Asia/Jakarta">Asia/Jakarta (WIB)</option>
                    <option value="Asia/Makassar">Asia/Makassar (WITA)</option>
                    <option value="Asia/Jayapura">Asia/Jayapura (WIT)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mulai Tahun Akademik (Bulan)
                  </label>
                  <select
                    name="academicYearStart"
                    defaultValue={selectedInstitution?.settings?.academicYearStart || 7}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {new Date(2024, i, 1).toLocaleDateString('id-ID', { month: 'long' })}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Batas Pembayaran (Hari)
                  </label>
                  <input
                    type="number"
                    name="paymentDueDays"
                    defaultValue={selectedInstitution?.settings?.paymentDueDays || 10}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="1"
                    max="30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Denda Keterlambatan (%)
                  </label>
                  <input
                    type="number"
                    name="lateFeePercentage"
                    defaultValue={selectedInstitution?.settings?.lateFeePercentage || 5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="enableAutoReminders"
                    defaultChecked={selectedInstitution?.settings?.enableAutoReminders || true}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Aktifkan Pengingat Otomatis
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {modalMode === 'add' ? 'Tambah' : 'Simpan'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Institusi</h1>
          <p className="text-gray-600">Kelola institusi pendidikan dan pengaturannya</p>
        </div>
        <button
          onClick={() => openModal('add')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Institusi
        </button>
      </div>

      {/* Institutions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {institutions.map((institution) => {
          const report = getInstitutionReport(institution.id);
          const classes = getClassesByInstitution(institution.id);
          
          return (
            <div key={institution.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="bg-blue-100 rounded-full p-3 mr-3">
                      <School className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{institution.name}</h3>
                      <p className="text-sm text-gray-600">{institution.code}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(institution.status)}`}>
                    <span className="flex items-center">
                      {getStatusIcon(institution.status)}
                      <span className="ml-1 capitalize">{institution.status}</span>
                    </span>
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="truncate">{institution.address}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2" />
                    <span>{institution.phone}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="w-4 h-4 mr-2" />
                    <span className="truncate">{institution.email}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="w-4 h-4 mr-2" />
                    <span className="truncate">{institution.principalName}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Berdiri {institution.establishedYear}</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Kelas</p>
                      <p className="text-lg font-semibold text-blue-600">{classes.length}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Siswa</p>
                      <p className="text-lg font-semibold text-green-600">{report.totalStudents}</p>
                    </div>
                  </div>
                  
                  <div className="text-center mb-4">
                    <p className="text-sm text-gray-600">Total Terkumpul</p>
                    <p className="text-lg font-semibold text-green-600">{formatCurrency(report.totalCollected)}</p>
                  </div>

                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => openModal('view', institution)}
                      className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100 flex items-center justify-center"
                    >
                      <BarChart3 className="w-4 h-4 mr-1" />
                      Detail
                    </button>
                    <button
                      onClick={() => openModal('edit', institution)}
                      className="flex-1 bg-green-50 text-green-600 px-3 py-2 rounded-lg hover:bg-green-100 flex items-center justify-center"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(institution.id)}
                      className="bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Institusi</p>
              <p className="text-2xl font-bold text-gray-900">{institutions.length}</p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <School className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Institusi Aktif</p>
              <p className="text-2xl font-bold text-green-600">
                {institutions.filter(i => i.status === 'active').length}
              </p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Siswa</p>
              <p className="text-2xl font-bold text-blue-600">
                {institutions.reduce((sum, inst) => sum + getInstitutionReport(inst.id).totalStudents, 0)}
              </p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Terkumpul</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(institutions.reduce((sum, inst) => sum + getInstitutionReport(inst.id).totalCollected, 0))}
              </p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {showModal && <InstitutionModal />}
    </div>
  );
};

export default InstitutionManagement;