import React, { useState } from 'react';
import { useSchool } from '../contexts/SchoolContext';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  School,
  User,
  Calendar,
  BarChart3,
  CheckCircle,
  XCircle,
  BookOpen,
  GraduationCap
} from 'lucide-react';

const ClassManagement: React.FC = () => {
  const { 
    classes,
    institutions,
    academicYears,
    currentAcademicYear,
    addClassroom,
    updateClassroom,
    deleteClassroom,
    getClassReport
  } = useSchool();
  
  const [showModal, setShowModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
  const [filterInstitution, setFilterInstitution] = useState('');
  const [filterLevel, setFilterLevel] = useState('');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  const filteredClasses = classes.filter(cls => {
    const matchesInstitution = filterInstitution === '' || cls.institutionId === filterInstitution;
    const matchesLevel = filterLevel === '' || cls.level === filterLevel;
    return matchesInstitution && matchesLevel;
  });

  const openModal = (mode: 'add' | 'edit' | 'view', classroom?: any) => {
    setModalMode(mode);
    setSelectedClass(classroom || null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedClass(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const classData = {
      name: formData.get('name') as string,
      code: formData.get('code') as string,
      institutionId: formData.get('institutionId') as string,
      academicYearId: formData.get('academicYearId') as string,
      level: formData.get('level') as string,
      section: formData.get('section') as string,
      capacity: parseInt(formData.get('capacity') as string),
      currentStrength: parseInt(formData.get('currentStrength') as string),
      classTeacherId: formData.get('classTeacherId') as string || undefined,
      status: formData.get('status') as 'active' | 'inactive'
    };

    if (modalMode === 'add') {
      addClassroom(classData);
    } else if (modalMode === 'edit' && selectedClass) {
      updateClassroom(selectedClass.id, classData);
    }
    
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus kelas ini?')) {
      deleteClassroom(id);
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getStatusIcon = (status: string) => {
    return status === 'active' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />;
  };

  const getCapacityColor = (current: number, capacity: number) => {
    const percentage = (current / capacity) * 100;
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-orange-600';
    return 'text-green-600';
  };

  const ClassModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            {modalMode === 'add' ? 'Tambah Kelas' : 
             modalMode === 'edit' ? 'Edit Kelas' : 'Detail Kelas'}
          </h2>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        {modalMode === 'view' && selectedClass ? (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-4">Informasi Kelas</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Nama Kelas</p>
                  <p className="font-medium">{selectedClass.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Kode Kelas</p>
                  <p className="font-medium">{selectedClass.code}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Institusi</p>
                  <p className="font-medium">
                    {institutions.find(i => i.id === selectedClass.institutionId)?.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tahun Akademik</p>
                  <p className="font-medium">
                    {academicYears.find(y => y.id === selectedClass.academicYearId)?.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tingkat</p>
                  <p className="font-medium">{selectedClass.level}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Jurusan/Bagian</p>
                  <p className="font-medium">{selectedClass.section}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Kapasitas</p>
                  <p className="font-medium">{selectedClass.capacity} siswa</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Jumlah Siswa Saat Ini</p>
                  <p className={`font-medium ${getCapacityColor(selectedClass.currentStrength, selectedClass.capacity)}`}>
                    {selectedClass.currentStrength} siswa
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-4">Statistik Keuangan</h3>
              {(() => {
                const report = getClassReport(selectedClass.id);
                return (
                  <div className="grid grid-cols-2 gap-4">
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
                    <div>
                      <p className="text-sm text-gray-600">Tingkat Pembayaran</p>
                      <p className="font-medium">{report.collectionRate.toFixed(1)}%</p>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Kelas
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={selectedClass?.name || ''}
                  placeholder="Contoh: X IPA 1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kode Kelas
                </label>
                <input
                  type="text"
                  name="code"
                  defaultValue={selectedClass?.code || ''}
                  placeholder="Contoh: X-IPA-1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Institusi
                </label>
                <select
                  name="institutionId"
                  defaultValue={selectedClass?.institutionId || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Pilih Institusi</option>
                  {institutions.filter(i => i.status === 'active').map(institution => (
                    <option key={institution.id} value={institution.id}>
                      {institution.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tahun Akademik
                </label>
                <select
                  name="academicYearId"
                  defaultValue={selectedClass?.academicYearId || currentAcademicYear?.id || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Pilih Tahun Akademik</option>
                  {academicYears.map(year => (
                    <option key={year.id} value={year.id}>
                      {year.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tingkat
                </label>
                <select
                  name="level"
                  defaultValue={selectedClass?.level || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Pilih Tingkat</option>
                  <option value="X">Kelas X</option>
                  <option value="XI">Kelas XI</option>
                  <option value="XII">Kelas XII</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jurusan/Bagian
                </label>
                <select
                  name="section"
                  defaultValue={selectedClass?.section || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Pilih Jurusan</option>
                  <option value="IPA 1">IPA 1</option>
                  <option value="IPA 2">IPA 2</option>
                  <option value="IPA 3">IPA 3</option>
                  <option value="IPS 1">IPS 1</option>
                  <option value="IPS 2">IPS 2</option>
                  <option value="IPS 3">IPS 3</option>
                  <option value="Bahasa">Bahasa</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kapasitas Maksimal
                </label>
                <input
                  type="number"
                  name="capacity"
                  defaultValue={selectedClass?.capacity || 36}
                  min="1"
                  max="50"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jumlah Siswa Saat Ini
                </label>
                <input
                  type="number"
                  name="currentStrength"
                  defaultValue={selectedClass?.currentStrength || 0}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Wali Kelas (Opsional)
              </label>
              <input
                type="text"
                name="classTeacherId"
                defaultValue={selectedClass?.classTeacherId || ''}
                placeholder="ID atau nama wali kelas"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                defaultValue={selectedClass?.status || 'active'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="active">Aktif</option>
                <option value="inactive">Tidak Aktif</option>
              </select>
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
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Kelas</h1>
          <p className="text-gray-600">Kelola kelas dan kapasitas siswa</p>
        </div>
        <button
          onClick={() => openModal('add')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Kelas
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-wrap gap-4">
          <select
            value={filterInstitution}
            onChange={(e) => setFilterInstitution(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Semua Institusi</option>
            {institutions.map(institution => (
              <option key={institution.id} value={institution.id}>
                {institution.name}
              </option>
            ))}
          </select>
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Semua Tingkat</option>
            <option value="X">Kelas X</option>
            <option value="XI">Kelas XI</option>
            <option value="XII">Kelas XII</option>
          </select>
        </div>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map((classroom) => {
          const institution = institutions.find(i => i.id === classroom.institutionId);
          const academicYear = academicYears.find(y => y.id === classroom.academicYearId);
          const report = getClassReport(classroom.id);
          const capacityPercentage = (classroom.currentStrength / classroom.capacity) * 100;
          
          return (
            <div key={classroom.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="bg-blue-100 rounded-full p-3 mr-3">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{classroom.name}</h3>
                      <p className="text-sm text-gray-600">{classroom.code}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(classroom.status)}`}>
                    <span className="flex items-center">
                      {getStatusIcon(classroom.status)}
                      <span className="ml-1 capitalize">{classroom.status}</span>
                    </span>
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <School className="w-4 h-4 mr-2" />
                    <span className="truncate">{institution?.name}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{academicYear?.name}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <GraduationCap className="w-4 h-4 mr-2" />
                    <span>Tingkat {classroom.level} - {classroom.section}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Kapasitas</span>
                    <span className={`text-sm font-medium ${getCapacityColor(classroom.currentStrength, classroom.capacity)}`}>
                      {classroom.currentStrength}/{classroom.capacity}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        capacityPercentage >= 90 ? 'bg-red-500' :
                        capacityPercentage >= 75 ? 'bg-orange-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(capacityPercentage, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Terkumpul</p>
                      <p className="text-lg font-semibold text-green-600">{formatCurrency(report.totalCollected)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Tunggakan</p>
                      <p className="text-lg font-semibold text-red-600">{formatCurrency(report.totalOutstanding)}</p>
                    </div>
                  </div>
                  
                  <div className="text-center mb-4">
                    <p className="text-sm text-gray-600">Tingkat Pembayaran</p>
                    <p className="text-lg font-semibold text-blue-600">{report.collectionRate.toFixed(1)}%</p>
                  </div>

                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => openModal('view', classroom)}
                      className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100 flex items-center justify-center"
                    >
                      <BarChart3 className="w-4 h-4 mr-1" />
                      Detail
                    </button>
                    <button
                      onClick={() => openModal('edit', classroom)}
                      className="flex-1 bg-green-50 text-green-600 px-3 py-2 rounded-lg hover:bg-green-100 flex items-center justify-center"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(classroom.id)}
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
              <p className="text-sm font-medium text-gray-600">Total Kelas</p>
              <p className="text-2xl font-bold text-gray-900">{filteredClasses.length}</p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Kelas Aktif</p>
              <p className="text-2xl font-bold text-green-600">
                {filteredClasses.filter(c => c.status === 'active').length}
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
              <p className="text-sm font-medium text-gray-600">Total Kapasitas</p>
              <p className="text-2xl font-bold text-blue-600">
                {filteredClasses.reduce((sum, c) => sum + c.capacity, 0)}
              </p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Siswa</p>
              <p className="text-2xl font-bold text-green-600">
                {filteredClasses.reduce((sum, c) => sum + c.currentStrength, 0)}
              </p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <User className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {showModal && <ClassModal />}
    </div>
  );
};

export default ClassManagement;