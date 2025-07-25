import React, { useState } from 'react';
import { useSchool } from '../contexts/SchoolContext';
import { useData } from '../contexts/DataContext';
import { 
  CreditCard, 
  Plus, 
  Edit, 
  Trash2, 
  DollarSign,
  Calendar,
  Users,
  AlertCircle,
  CheckCircle,
  XCircle,
  FileText,
  Calculator,
  Clock,
  TrendingUp,
  Download
} from 'lucide-react';

const BillingManagement: React.FC = () => {
  const { 
    feeStructures,
    institutions,
    academicYears,
    classes,
    getClassesByInstitution,
    currentAcademicYear,
    addFeeStructure,
    updateFeeStructure,
    deleteFeeStructure,
    studentBillings,
    addStudentBilling,
    getOverduePayments,
    getDefaultersList
  } = useSchool();
  
  const { students } = useData();
  
  const [showModal, setShowModal] = useState(false);
  const [selectedStructure, setSelectedStructure] = useState<any>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
  const [activeTab, setActiveTab] = useState('structures');
  const [filterInstitution, setFilterInstitution] = useState('');
  const [selectedInstitution, setSelectedInstitution] = useState('');
  const [applicableFor, setApplicableFor] = useState('institution');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  const filteredStructures = feeStructures.filter(structure => {
    return filterInstitution === '' || structure.institutionId === filterInstitution;
  });

  const overduePayments = getOverduePayments();
  const defaultersList = getDefaultersList(filterInstitution || undefined);

  const openModal = (mode: 'add' | 'edit' | 'view', structure?: any) => {
    setModalMode(mode);
    setSelectedStructure(structure || null);
    if (structure) {
      setSelectedInstitution(structure.institutionId || '');
      setApplicableFor(structure.applicableFor || 'institution');
    } else {
      setSelectedInstitution('');
      setApplicableFor('institution');
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedStructure(null);
    setSelectedInstitution('');
    setApplicableFor('institution');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    // Parse fee items from form
    const feeItems = [];
    let index = 0;
    while (formData.get(`feeItem_${index}_name`)) {
      feeItems.push({
        id: Date.now().toString() + index,
        name: formData.get(`feeItem_${index}_name`) as string,
        type: formData.get(`feeItem_${index}_type`) as any,
        amount: parseInt(formData.get(`feeItem_${index}_amount`) as string),
        isRecurring: formData.get(`feeItem_${index}_isRecurring`) === 'on',
        frequency: formData.get(`feeItem_${index}_frequency`) as any,
        isOptional: formData.get(`feeItem_${index}_isOptional`) === 'on'
      });
      index++;
    }

    const totalAmount = feeItems.reduce((sum, item) => {
      if (item.isRecurring && item.frequency === 'monthly') {
        return sum + (item.amount * 12);
      }
      return sum + item.amount;
    }, 0);

    const structureData = {
      name: formData.get('name') as string,
      institutionId: formData.get('institutionId') as string,
      academicYearId: formData.get('academicYearId') as string,
      applicableFor: formData.get('applicableFor') as 'institution' | 'class' | 'student',
      targetId: formData.get('targetId') as string || undefined,
      fees: feeItems,
      totalAmount,
      paymentSchedule: [], // Will be generated based on fees
      status: formData.get('status') as 'active' | 'inactive'
    };

    if (modalMode === 'add') {
      addFeeStructure(structureData);
    } else if (modalMode === 'edit' && selectedStructure) {
      updateFeeStructure(selectedStructure.id, structureData);
    }
    
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus struktur biaya ini?')) {
      deleteFeeStructure(id);
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getStatusIcon = (status: string) => {
    return status === 'active' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />;
  };

  const handleInstitutionChange = (institutionId: string) => {
    setSelectedInstitution(institutionId);
  };

  const handleApplicableForChange = (value: string) => {
    setApplicableFor(value);
  };

  const getAvailableClasses = () => {
    if (!selectedInstitution) return [];
    return getClassesByInstitution(selectedInstitution);
  };

  const getTargetLabel = () => {
    switch (applicableFor) {
      case 'class':
        return 'Pilih Kelas';
      case 'student':
        return 'Pilih Siswa';
      default:
        return 'Target';
    }
  };
  const FeeStructureModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            {modalMode === 'add' ? 'Tambah Struktur Biaya' : 
             modalMode === 'edit' ? 'Edit Struktur Biaya' : 'Detail Struktur Biaya'}
          </h2>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        {modalMode === 'view' && selectedStructure ? (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-4">Informasi Struktur Biaya</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Nama Struktur</p>
                  <p className="font-medium">{selectedStructure.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Biaya</p>
                  <p className="font-medium text-green-600">{formatCurrency(selectedStructure.totalAmount)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Institusi</p>
                  <p className="font-medium">
                    {institutions.find(i => i.id === selectedStructure.institutionId)?.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tahun Akademik</p>
                  <p className="font-medium">
                    {academicYears.find(y => y.id === selectedStructure.academicYearId)?.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Berlaku Untuk</p>
                  <p className="font-medium capitalize">{selectedStructure.applicableFor}</p>
                </div>
                {selectedStructure.targetId && (
                  <div>
                    <p className="text-sm text-gray-600">Target</p>
                    <p className="font-medium">
                      {selectedStructure.applicableFor === 'class' 
                        ? classes.find(c => c.id === selectedStructure.targetId)?.name
                        : selectedStructure.targetId}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedStructure.status)}`}>
                    <span className="flex items-center">
                      {getStatusIcon(selectedStructure.status)}
                      <span className="ml-1 capitalize">{selectedStructure.status}</span>
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-4">Rincian Biaya</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nama Biaya</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Jenis</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Jumlah</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Berulang</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Opsional</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {selectedStructure.fees.map((fee: any) => (
                      <tr key={fee.id}>
                        <td className="px-4 py-2 text-sm text-gray-900">{fee.name}</td>
                        <td className="px-4 py-2 text-sm text-gray-600 capitalize">{fee.type}</td>
                        <td className="px-4 py-2 text-sm font-medium text-gray-900">{formatCurrency(fee.amount)}</td>
                        <td className="px-4 py-2 text-sm text-gray-600">
                          {fee.isRecurring ? `Ya (${fee.frequency})` : 'Tidak'}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-600">
                          {fee.isOptional ? 'Ya' : 'Tidak'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Struktur Biaya
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={selectedStructure?.name || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  defaultValue={selectedStructure?.status || 'active'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="active">Aktif</option>
                  <option value="inactive">Tidak Aktif</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Institusi
                </label>
                <select
                  name="institutionId"
                  defaultValue={selectedStructure?.institutionId || ''}
                  onChange={(e) => handleInstitutionChange(e.target.value)}
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
                  defaultValue={selectedStructure?.academicYearId || currentAcademicYear?.id || ''}
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
                  Berlaku Untuk
                </label>
                <select
                  name="applicableFor"
                  defaultValue={selectedStructure?.applicableFor || 'institution'}
                  onChange={(e) => handleApplicableForChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="institution">Seluruh Institusi</option>
                  <option value="class">Kelas Tertentu</option>
                  <option value="student">Siswa Tertentu</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {getTargetLabel()}
                  Target (Opsional)
                </label>
                {applicableFor === 'class' ? (
                  <select
                    name="targetId"
                    defaultValue={selectedStructure?.targetId || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={!selectedInstitution}
                  >
                    <option value="">
                      {selectedInstitution ? 'Pilih Kelas' : 'Pilih Institusi Terlebih Dahulu'}
                    </option>
                    {getAvailableClasses().map(cls => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name}
                      </option>
                    ))}
                  </select>
                ) : applicableFor === 'student' ? (
                  <select
                    name="targetId"
                    defaultValue={selectedStructure?.targetId || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={!selectedInstitution}
                  >
                    <option value="">
                      {selectedInstitution ? 'Pilih Siswa' : 'Pilih Institusi Terlebih Dahulu'}
                    </option>
                    {students.filter(s => s.institution === institutions.find(i => i.id === selectedInstitution)?.name).map(student => (
                      <option key={student.id} value={student.id}>
                        {student.name} - {student.nis}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    name="targetId"
                    defaultValue={selectedStructure?.targetId || ''}
                    placeholder="Tidak diperlukan untuk seluruh institusi"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                    disabled
                  />
                )}
                <input
                  type="text"
                  name="targetId"
                  defaultValue={selectedStructure?.targetId || ''}
                  placeholder="ID kelas atau siswa jika diperlukan"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Rincian Biaya</h3>
              <div id="fee-items" className="space-y-4">
                <div className="fee-item border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nama Biaya
                      </label>
                      <input
                        type="text"
                        name="feeItem_0_name"
                        placeholder="Contoh: SPP Bulanan"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Jenis Biaya
                      </label>
                      <select
                        name="feeItem_0_type"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="tuition">SPP/Uang Sekolah</option>
                        <option value="admission">Uang Masuk</option>
                        <option value="development">Uang Gedung</option>
                        <option value="transport">Uang Transport</option>
                        <option value="library">Uang Perpustakaan</option>
                        <option value="lab">Uang Laboratorium</option>
                        <option value="sports">Uang Olahraga</option>
                        <option value="other">Lainnya</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Jumlah (Rp)
                      </label>
                      <input
                        type="number"
                        name="feeItem_0_amount"
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Frekuensi
                      </label>
                      <select
                        name="feeItem_0_frequency"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Sekali Bayar</option>
                        <option value="monthly">Bulanan</option>
                        <option value="quarterly">Per Semester</option>
                        <option value="annually">Tahunan</option>
                      </select>
                    </div>
                    <div className="flex items-center space-x-4 pt-6">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="feeItem_0_isRecurring"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Berulang</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="feeItem_0_isOptional"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Opsional</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="mt-4 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center"
                onClick={() => {
                  // Add new fee item functionality would go here
                  alert('Fitur tambah item biaya akan dikembangkan lebih lanjut');
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Item Biaya
              </button>
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

  const FeeStructuresTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Struktur Biaya</h2>
        <button
          onClick={() => openModal('add')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Struktur Biaya
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStructures.map((structure) => {
          const institution = institutions.find(i => i.id === structure.institutionId);
          const academicYear = academicYears.find(y => y.id === structure.academicYearId);
          const targetName = structure.targetId && structure.applicableFor === 'class' 
            ? classes.find(c => c.id === structure.targetId)?.name 
            : structure.targetId;
          
          return (
            <div key={structure.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="bg-green-100 rounded-full p-3 mr-3">
                      <Calculator className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{structure.name}</h3>
                      <p className="text-sm text-gray-600">{institution?.name}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(structure.status)}`}>
                    <span className="flex items-center">
                      {getStatusIcon(structure.status)}
                      <span className="ml-1 capitalize">{structure.status}</span>
                    </span>
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Tahun Akademik:</span>
                    <span className="text-sm font-medium">{academicYear?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Berlaku Untuk:</span>
                    <span className="text-sm font-medium capitalize">{structure.applicableFor}</span>
                  </div>
                  {structure.targetId && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Target:</span>
                      <span className="text-sm font-medium">{targetName}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Jumlah Item:</span>
                    <span className="text-sm font-medium">{structure.fees.length} item</span>
                  </div>
                </div>

                <div className="border-t pt-4 mb-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Total Biaya</p>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(structure.totalAmount)}</p>
                  </div>
                </div>

                <div className="flex justify-center space-x-2">
                  <button
                    onClick={() => openModal('view', structure)}
                    className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100 flex items-center justify-center"
                  >
                    <FileText className="w-4 h-4 mr-1" />
                    Detail
                  </button>
                  <button
                    onClick={() => openModal('edit', structure)}
                    className="flex-1 bg-green-50 text-green-600 px-3 py-2 rounded-lg hover:bg-green-100 flex items-center justify-center"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(structure.id)}
                    className="bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const OutstandingTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Tunggakan Pembayaran</h2>
        <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center">
          <Download className="w-4 h-4 mr-2" />
          Export Tunggakan
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Siswa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Institusi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Tagihan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tunggakan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jatuh Tempo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {defaultersList.map((billing) => {
                const student = students.find(s => s.id === billing.studentId);
                const institution = institutions.find(i => i.id === billing.institutionId);
                
                return (
                  <tr key={billing.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{student?.name}</div>
                      <div className="text-sm text-gray-500">NIS: {student?.nis}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {institution?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(billing.totalFees)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                      {formatCurrency(billing.outstandingAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {billing.nextDueDate.toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        billing.status === 'overdue' ? 'bg-red-100 text-red-800' : 
                        billing.status === 'defaulter' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {billing.status === 'overdue' ? 'Terlambat' : 
                         billing.status === 'defaulter' ? 'Menunggak' : 'Jatuh Tempo'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Billing</h1>
          <p className="text-gray-600">Kelola struktur biaya dan tunggakan pembayaran</p>
        </div>
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
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Struktur Biaya</p>
              <p className="text-2xl font-bold text-blue-600">{filteredStructures.length}</p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <Calculator className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tunggakan</p>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(defaultersList.reduce((sum, b) => sum + b.outstandingAmount, 0))}
              </p>
            </div>
            <div className="bg-red-100 rounded-full p-3">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Siswa Menunggak</p>
              <p className="text-2xl font-bold text-orange-600">{defaultersList.length}</p>
            </div>
            <div className="bg-orange-100 rounded-full p-3">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Terkumpul Bulan Ini</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(studentBillings.reduce((sum, b) => sum + b.paidAmount, 0))}
              </p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('structures')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'structures'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Calculator className="w-4 h-4 mr-2 inline" />
            Struktur Biaya
          </button>
          <button
            onClick={() => setActiveTab('outstanding')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'outstanding'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <AlertCircle className="w-4 h-4 mr-2 inline" />
            Tunggakan ({defaultersList.length})
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'structures' && <FeeStructuresTab />}
      {activeTab === 'outstanding' && <OutstandingTab />}

      {showModal && <FeeStructureModal />}
    </div>
  );
};

export default BillingManagement;