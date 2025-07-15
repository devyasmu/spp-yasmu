import React, { useState } from 'react';
import { useSchool } from '../contexts/SchoolContext';
import { 
  Calendar, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle,
  BarChart3,
  Users,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Download
} from 'lucide-react';

const AcademicYearManagement: React.FC = () => {
  const { 
    academicYears, 
    currentAcademicYear,
    addAcademicYear, 
    updateAcademicYear, 
    deleteAcademicYear,
    setActiveAcademicYear,
    getAcademicYearReport
  } = useSchool();
  
  const [showModal, setShowModal] = useState(false);
  const [selectedYear, setSelectedYear] = useState<any>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  const openModal = (mode: 'add' | 'edit' | 'view', year?: any) => {
    setModalMode(mode);
    setSelectedYear(year || null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedYear(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const yearData = {
      name: formData.get('name') as string,
      startDate: new Date(formData.get('startDate') as string),
      endDate: new Date(formData.get('endDate') as string),
      status: formData.get('status') as 'active' | 'inactive' | 'upcoming',
      isDefault: formData.get('isDefault') === 'on'
    };

    if (modalMode === 'add') {
      addAcademicYear(yearData);
    } else if (modalMode === 'edit' && selectedYear) {
      updateAcademicYear(selectedYear.id, yearData);
    }
    
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus tahun akademik ini?')) {
      deleteAcademicYear(id);
    }
  };

  const handleSetActive = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin mengaktifkan tahun akademik ini?')) {
      setActiveAcademicYear(id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'upcoming':
        return <Calendar className="w-4 h-4" />;
      case 'inactive':
        return <XCircle className="w-4 h-4" />;
      default:
        return <XCircle className="w-4 h-4" />;
    }
  };

  const YearModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            {modalMode === 'add' ? 'Tambah Tahun Akademik' : 
             modalMode === 'edit' ? 'Edit Tahun Akademik' : 'Detail Tahun Akademik'}
          </h2>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        {modalMode === 'view' && selectedYear ? (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Informasi Tahun Akademik</h3>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-600">Nama</p>
                  <p className="font-medium">{selectedYear.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Tanggal Mulai</p>
                    <p className="font-medium">{selectedYear.startDate.toLocaleDateString('id-ID')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tanggal Selesai</p>
                    <p className="font-medium">{selectedYear.endDate.toLocaleDateString('id-ID')}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedYear.status)}`}>
                    <span className="flex items-center">
                      {getStatusIcon(selectedYear.status)}
                      <span className="ml-1 capitalize">{selectedYear.status}</span>
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Statistik Keuangan</h3>
              {(() => {
                const report = getAcademicYearReport(selectedYear.id);
                return (
                  <div className="grid grid-cols-2 gap-4">
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
                    <div>
                      <p className="text-sm text-gray-600">Tunggakan</p>
                      <p className="font-medium text-red-600">{formatCurrency(report.totalOutstanding)}</p>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Tahun Akademik
              </label>
              <input
                type="text"
                name="name"
                defaultValue={selectedYear?.name || ''}
                placeholder="Contoh: 2024/2025"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal Mulai
                </label>
                <input
                  type="date"
                  name="startDate"
                  defaultValue={selectedYear?.startDate?.toISOString().split('T')[0] || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal Selesai
                </label>
                <input
                  type="date"
                  name="endDate"
                  defaultValue={selectedYear?.endDate?.toISOString().split('T')[0] || ''}
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
                defaultValue={selectedYear?.status || 'upcoming'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="upcoming">Akan Datang</option>
                <option value="active">Aktif</option>
                <option value="inactive">Tidak Aktif</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isDefault"
                defaultChecked={selectedYear?.isDefault || false}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label className="ml-2 text-sm text-gray-700">
                Jadikan sebagai tahun akademik default
              </label>
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
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Tahun Akademik</h1>
          <p className="text-gray-600">Kelola tahun akademik dan periode pembayaran</p>
        </div>
        <button
          onClick={() => openModal('add')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Tahun Akademik
        </button>
      </div>

      {/* Current Academic Year Card */}
      {currentAcademicYear && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">Tahun Akademik Aktif</h2>
              <p className="text-blue-100">{currentAcademicYear.name}</p>
              <p className="text-sm text-blue-200">
                {currentAcademicYear.startDate.toLocaleDateString('id-ID')} - {currentAcademicYear.endDate.toLocaleDateString('id-ID')}
              </p>
            </div>
            <div className="text-right">
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <Calendar className="w-8 h-8 mb-2" />
                <p className="text-sm">Aktif</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Academic Years List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Daftar Tahun Akademik</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tahun Akademik
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Periode
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statistik
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {academicYears.map((year) => {
                const report = getAcademicYearReport(year.id);
                return (
                  <tr key={year.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{year.name}</div>
                          {year.isDefault && (
                            <div className="text-xs text-blue-600">Default</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {year.startDate.toLocaleDateString('id-ID')} - {year.endDate.toLocaleDateString('id-ID')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(year.status)}`}>
                        <span className="flex items-center">
                          {getStatusIcon(year.status)}
                          <span className="ml-1 capitalize">{year.status}</span>
                        </span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 text-gray-400 mr-1" />
                          <span>{report.totalStudents} siswa</span>
                        </div>
                        <div className="flex items-center mt-1">
                          <DollarSign className="w-4 h-4 text-green-500 mr-1" />
                          <span className="text-green-600">{formatCurrency(report.totalCollected)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openModal('view', year)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Lihat Detail"
                        >
                          <BarChart3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openModal('edit', year)}
                          className="text-green-600 hover:text-green-900"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {year.status !== 'active' && (
                          <button
                            onClick={() => handleSetActive(year.id)}
                            className="text-orange-600 hover:text-orange-900"
                            title="Aktifkan"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(year.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tahun Akademik</p>
              <p className="text-2xl font-bold text-gray-900">{academicYears.length}</p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tahun Aktif</p>
              <p className="text-2xl font-bold text-green-600">
                {academicYears.filter(y => y.status === 'active').length}
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
              <p className="text-sm font-medium text-gray-600">Akan Datang</p>
              <p className="text-2xl font-bold text-blue-600">
                {academicYears.filter(y => y.status === 'upcoming').length}
              </p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tidak Aktif</p>
              <p className="text-2xl font-bold text-gray-600">
                {academicYears.filter(y => y.status === 'inactive').length}
              </p>
            </div>
            <div className="bg-gray-100 rounded-full p-3">
              <XCircle className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {showModal && <YearModal />}
    </div>
  );
};

export default AcademicYearManagement;