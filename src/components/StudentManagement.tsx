import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload,
  Edit,
  Trash2,
  Eye,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign
} from 'lucide-react';

const StudentManagement: React.FC = () => {
  const { students, addStudent, updateStudent, deleteStudent } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.nis.includes(searchTerm);
    const matchesClass = filterClass === '' || student.class === filterClass;
    const matchesStatus = filterStatus === '' || student.status === filterStatus;
    
    return matchesSearch && matchesClass && matchesStatus;
  });

  const classes = [...new Set(students.map(s => s.class))];
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  const openModal = (mode: 'add' | 'edit' | 'view', student?: any) => {
    setModalMode(mode);
    setSelectedStudent(student || null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedStudent(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const studentData = {
      nis: formData.get('nis') as string,
      name: formData.get('name') as string,
      class: formData.get('class') as string,
      academicYear: formData.get('academicYear') as string,
      institution: formData.get('institution') as string,
      status: formData.get('status') as 'active' | 'inactive',
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      address: formData.get('address') as string,
      totalFee: parseInt(formData.get('totalFee') as string),
      paidAmount: parseInt(formData.get('paidAmount') as string),
      outstandingAmount: parseInt(formData.get('totalFee') as string) - parseInt(formData.get('paidAmount') as string),
      lastPayment: formData.get('lastPayment') ? new Date(formData.get('lastPayment') as string) : null
    };

    if (modalMode === 'add') {
      addStudent(studentData);
    } else if (modalMode === 'edit' && selectedStudent) {
      updateStudent(selectedStudent.id, studentData);
    }
    
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus siswa ini?')) {
      deleteStudent(id);
    }
  };

  const StudentModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            {modalMode === 'add' ? 'Tambah Siswa' : 
             modalMode === 'edit' ? 'Edit Siswa' : 'Detail Siswa'}
          </h2>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        {modalMode === 'view' && selectedStudent ? (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Informasi Siswa</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">NIS</p>
                  <p className="font-medium">{selectedStudent.nis}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Nama</p>
                  <p className="font-medium">{selectedStudent.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Kelas</p>
                  <p className="font-medium">{selectedStudent.class}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    selectedStudent.status === 'active' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {selectedStudent.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Informasi Pembayaran</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Total Tagihan</p>
                  <p className="font-medium">{formatCurrency(selectedStudent.totalFee)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Sudah Dibayar</p>
                  <p className="font-medium text-green-600">{formatCurrency(selectedStudent.paidAmount)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tunggakan</p>
                  <p className="font-medium text-red-600">{formatCurrency(selectedStudent.outstandingAmount)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pembayaran Terakhir</p>
                  <p className="font-medium">
                    {selectedStudent.lastPayment 
                      ? selectedStudent.lastPayment.toLocaleDateString('id-ID')
                      : 'Belum ada pembayaran'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NIS
                </label>
                <input
                  type="text"
                  name="nis"
                  defaultValue={selectedStudent?.nis || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={selectedStudent?.name || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kelas
                </label>
                <select
                  name="class"
                  defaultValue={selectedStudent?.class || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Pilih Kelas</option>
                  <option value="X IPA 1">X IPA 1</option>
                  <option value="X IPA 2">X IPA 2</option>
                  <option value="X IPS 1">X IPS 1</option>
                  <option value="XI IPA 1">XI IPA 1</option>
                  <option value="XI IPA 2">XI IPA 2</option>
                  <option value="XI IPS 1">XI IPS 1</option>
                  <option value="XII IPA 1">XII IPA 1</option>
                  <option value="XII IPA 2">XII IPA 2</option>
                  <option value="XII IPS 1">XII IPS 1</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  defaultValue={selectedStudent?.status || 'active'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="active">Aktif</option>
                  <option value="inactive">Tidak Aktif</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alamat
              </label>
              <textarea
                name="address"
                defaultValue={selectedStudent?.address || ''}
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
                  defaultValue={selectedStudent?.phone || ''}
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
                  defaultValue={selectedStudent?.email || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total SPP (Rp)
                </label>
                <input
                  type="number"
                  name="totalFee"
                  defaultValue={selectedStudent?.totalFee || 2400000}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sudah Dibayar (Rp)
                </label>
                <input
                  type="number"
                  name="paidAmount"
                  defaultValue={selectedStudent?.paidAmount || 0}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <input type="hidden" name="academicYear" value="2024/2025" />
            <input type="hidden" name="institution" value="SMA Negeri 1 Jakarta" />

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
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Siswa</h1>
          <p className="text-gray-600">Kelola data siswa dan pembayaran SPP</p>
        </div>
        <button
          onClick={() => openModal('add')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Siswa
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Cari siswa (nama atau NIS)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Semua Kelas</option>
            {classes.map(cls => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="inactive">Tidak Aktif</option>
          </select>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </button>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Siswa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kelas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total SPP
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tunggakan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                        <User className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                        <div className="text-sm text-gray-500">NIS: {student.nis}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.class}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      student.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {student.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(student.totalFee)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${
                      student.outstandingAmount > 0 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {formatCurrency(student.outstandingAmount)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openModal('view', student)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openModal('edit', student)}
                        className="text-green-600 hover:text-green-900"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(student.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Siswa</p>
            <p className="text-2xl font-bold text-blue-600">{filteredStudents.length}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Siswa Aktif</p>
            <p className="text-2xl font-bold text-green-600">
              {filteredStudents.filter(s => s.status === 'active').length}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Tunggakan</p>
            <p className="text-2xl font-bold text-red-600">
              {formatCurrency(filteredStudents.reduce((sum, s) => sum + s.outstandingAmount, 0))}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Sudah Dibayar</p>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(filteredStudents.reduce((sum, s) => sum + s.paidAmount, 0))}
            </p>
          </div>
        </div>
      </div>

      {showModal && <StudentModal />}
    </div>
  );
};

export default StudentManagement;