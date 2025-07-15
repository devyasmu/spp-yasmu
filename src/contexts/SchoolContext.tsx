import React, { createContext, useContext, useState, useEffect } from 'react';

interface AcademicYear {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'inactive' | 'upcoming';
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Institution {
  id: string;
  name: string;
  code: string;
  address: string;
  phone: string;
  email: string;
  principalName: string;
  establishedYear: number;
  status: 'active' | 'inactive';
  settings: {
    currency: string;
    timezone: string;
    academicYearStart: number; // month (1-12)
    paymentDueDays: number;
    lateFeePercentage: number;
    enableAutoReminders: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface Class {
  id: string;
  name: string;
  code: string;
  institutionId: string;
  academicYearId: string;
  level: string; // X, XI, XII
  section: string; // A, B, C
  capacity: number;
  currentStrength: number;
  classTeacherId?: string;
  feeStructureId?: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

interface FeeStructure {
  id: string;
  name: string;
  institutionId: string;
  academicYearId: string;
  applicableFor: 'institution' | 'class' | 'student';
  targetId?: string; // classId or studentId if applicable
  fees: FeeItem[];
  totalAmount: number;
  paymentSchedule: PaymentSchedule[];
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

interface FeeItem {
  id: string;
  name: string;
  type: 'tuition' | 'admission' | 'development' | 'transport' | 'library' | 'lab' | 'sports' | 'other';
  amount: number;
  isRecurring: boolean;
  frequency?: 'monthly' | 'quarterly' | 'annually';
  dueDate?: Date;
  isOptional: boolean;
}

interface PaymentSchedule {
  id: string;
  installmentNumber: number;
  dueDate: Date;
  amount: number;
  feeItems: string[]; // fee item IDs
  status: 'upcoming' | 'due' | 'overdue';
}

interface StudentBilling {
  id: string;
  studentId: string;
  institutionId: string;
  academicYearId: string;
  classId: string;
  feeStructureId: string;
  totalFees: number;
  paidAmount: number;
  outstandingAmount: number;
  discountAmount: number;
  lateFeeAmount: number;
  paymentHistory: Payment[];
  nextDueDate: Date;
  status: 'current' | 'overdue' | 'paid' | 'defaulter';
  specialNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Payment {
  id: string;
  studentBillingId: string;
  studentId: string;
  amount: number;
  paymentMethod: 'cash' | 'card' | 'transfer' | 'cheque' | 'online';
  paymentDate: Date;
  receiptNumber: string;
  feeItems: string[];
  processedBy: string;
  status: 'completed' | 'pending' | 'failed' | 'cancelled';
  transactionId?: string;
  notes?: string;
  createdAt: Date;
}

interface SchoolContextType {
  // Academic Years
  academicYears: AcademicYear[];
  currentAcademicYear: AcademicYear | null;
  addAcademicYear: (year: Omit<AcademicYear, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateAcademicYear: (id: string, year: Partial<AcademicYear>) => void;
  deleteAcademicYear: (id: string) => void;
  setActiveAcademicYear: (id: string) => void;
  
  // Institutions
  institutions: Institution[];
  addInstitution: (institution: Omit<Institution, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateInstitution: (id: string, institution: Partial<Institution>) => void;
  deleteInstitution: (id: string) => void;
  getInstitutionById: (id: string) => Institution | undefined;
  
  // Classes
  classes: Class[];
  addClassroom: (classroom: Omit<Class, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateClassroom: (id: string, classroom: Partial<Class>) => void;
  deleteClassroom: (id: string) => void;
  getClassesByInstitution: (institutionId: string) => Class[];
  
  // Fee Structures
  feeStructures: FeeStructure[];
  addFeeStructure: (structure: Omit<FeeStructure, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateFeeStructure: (id: string, structure: Partial<FeeStructure>) => void;
  deleteFeeStructure: (id: string) => void;
  getFeeStructuresByInstitution: (institutionId: string) => FeeStructure[];
  
  // Student Billing
  studentBillings: StudentBilling[];
  addStudentBilling: (billing: Omit<StudentBilling, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateStudentBilling: (id: string, billing: Partial<StudentBilling>) => void;
  getBillingByStudent: (studentId: string, academicYearId: string) => StudentBilling | undefined;
  getOverduePayments: () => StudentBilling[];
  
  // Payments
  payments: Payment[];
  processPayment: (payment: Omit<Payment, 'id' | 'createdAt'>) => void;
  getPaymentHistory: (studentId: string) => Payment[];
  
  // Reports
  getAcademicYearReport: (yearId: string) => any;
  getInstitutionReport: (institutionId: string) => any;
  getClassReport: (classId: string) => any;
  getDefaultersList: (institutionId?: string) => StudentBilling[];
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

// Mock data
const mockAcademicYears: AcademicYear[] = [
  {
    id: '1',
    name: '2023/2024',
    startDate: new Date('2023-07-01'),
    endDate: new Date('2024-06-30'),
    status: 'inactive',
    isDefault: false,
    createdAt: new Date('2023-06-01'),
    updatedAt: new Date('2023-06-01')
  },
  {
    id: '2',
    name: '2024/2025',
    startDate: new Date('2024-07-01'),
    endDate: new Date('2025-06-30'),
    status: 'active',
    isDefault: true,
    createdAt: new Date('2024-06-01'),
    updatedAt: new Date('2024-06-01')
  }
];

const mockInstitutions: Institution[] = [
  {
    id: '1',
    name: 'SMA Negeri 1 Jakarta',
    code: 'SMAN1JKT',
    address: 'Jl. Budi Kemuliaan I No.2, Gambir, Jakarta Pusat',
    phone: '021-3441805',
    email: 'info@sman1jakarta.sch.id',
    principalName: 'Dr. Ahmad Suryadi, M.Pd',
    establishedYear: 1950,
    status: 'active',
    settings: {
      currency: 'IDR',
      timezone: 'Asia/Jakarta',
      academicYearStart: 7,
      paymentDueDays: 10,
      lateFeePercentage: 5,
      enableAutoReminders: true
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    name: 'SMA Negeri 2 Jakarta',
    code: 'SMAN2JKT',
    address: 'Jl. Gajah Mada No.175, Jakarta Pusat',
    phone: '021-6260038',
    email: 'info@sman2jakarta.sch.id',
    principalName: 'Dra. Siti Nurhasanah, M.Pd',
    establishedYear: 1952,
    status: 'active',
    settings: {
      currency: 'IDR',
      timezone: 'Asia/Jakarta',
      academicYearStart: 7,
      paymentDueDays: 15,
      lateFeePercentage: 3,
      enableAutoReminders: true
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

const mockClasses: Class[] = [
  {
    id: '1',
    name: 'X IPA 1',
    code: 'X-IPA-1',
    institutionId: '1',
    academicYearId: '2',
    level: 'X',
    section: 'IPA 1',
    capacity: 36,
    currentStrength: 34,
    status: 'active',
    createdAt: new Date('2024-07-01'),
    updatedAt: new Date('2024-07-01')
  },
  {
    id: '2',
    name: 'X IPA 2',
    code: 'X-IPA-2',
    institutionId: '1',
    academicYearId: '2',
    level: 'X',
    section: 'IPA 2',
    capacity: 36,
    currentStrength: 35,
    status: 'active',
    createdAt: new Date('2024-07-01'),
    updatedAt: new Date('2024-07-01')
  },
  {
    id: '3',
    name: 'XI IPS 1',
    code: 'XI-IPS-1',
    institutionId: '1',
    academicYearId: '2',
    level: 'XI',
    section: 'IPS 1',
    capacity: 36,
    currentStrength: 32,
    status: 'active',
    createdAt: new Date('2024-07-01'),
    updatedAt: new Date('2024-07-01')
  }
];

const mockFeeStructures: FeeStructure[] = [
  {
    id: '1',
    name: 'Struktur Biaya Kelas X IPA',
    institutionId: '1',
    academicYearId: '2',
    applicableFor: 'class',
    targetId: '1',
    fees: [
      {
        id: '1',
        name: 'SPP Bulanan',
        type: 'tuition',
        amount: 400000,
        isRecurring: true,
        frequency: 'monthly',
        isOptional: false
      },
      {
        id: '2',
        name: 'Uang Gedung',
        type: 'development',
        amount: 2000000,
        isRecurring: false,
        isOptional: false
      },
      {
        id: '3',
        name: 'Uang Buku',
        type: 'library',
        amount: 500000,
        isRecurring: false,
        isOptional: false
      },
      {
        id: '4',
        name: 'Uang Seragam',
        type: 'other',
        amount: 300000,
        isRecurring: false,
        isOptional: false
      }
    ],
    totalAmount: 7800000, // SPP 12 months + one-time fees
    paymentSchedule: [
      {
        id: '1',
        installmentNumber: 1,
        dueDate: new Date('2024-07-10'),
        amount: 3200000,
        feeItems: ['2', '3', '4', '1'],
        status: 'overdue'
      },
      {
        id: '2',
        installmentNumber: 2,
        dueDate: new Date('2024-08-10'),
        amount: 400000,
        feeItems: ['1'],
        status: 'due'
      }
    ],
    status: 'active',
    createdAt: new Date('2024-06-01'),
    updatedAt: new Date('2024-06-01')
  }
];

export const SchoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>(mockAcademicYears);
  const [institutions, setInstitutions] = useState<Institution[]>(mockInstitutions);
  const [classes, setClasses] = useState<Class[]>(mockClasses);
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>(mockFeeStructures);
  const [studentBillings, setStudentBillings] = useState<StudentBilling[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  const currentAcademicYear = academicYears.find(year => year.status === 'active') || null;

  // Academic Year Management
  const addAcademicYear = (year: Omit<AcademicYear, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newYear: AcademicYear = {
      ...year,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setAcademicYears(prev => [...prev, newYear]);
  };

  const updateAcademicYear = (id: string, year: Partial<AcademicYear>) => {
    setAcademicYears(prev => prev.map(y => 
      y.id === id ? { ...y, ...year, updatedAt: new Date() } : y
    ));
  };

  const deleteAcademicYear = (id: string) => {
    setAcademicYears(prev => prev.filter(y => y.id !== id));
  };

  const setActiveAcademicYear = (id: string) => {
    setAcademicYears(prev => prev.map(y => ({
      ...y,
      status: y.id === id ? 'active' as const : 'inactive' as const,
      isDefault: y.id === id
    })));
  };

  // Institution Management
  const addInstitution = (institution: Omit<Institution, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newInstitution: Institution = {
      ...institution,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setInstitutions(prev => [...prev, newInstitution]);
  };

  const updateInstitution = (id: string, institution: Partial<Institution>) => {
    setInstitutions(prev => prev.map(i => 
      i.id === id ? { ...i, ...institution, updatedAt: new Date() } : i
    ));
  };

  const deleteInstitution = (id: string) => {
    setInstitutions(prev => prev.filter(i => i.id !== id));
  };

  const getInstitutionById = (id: string) => {
    return institutions.find(i => i.id === id);
  };

  // Class Management
  const addClassroom = (classroom: Omit<Class, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newClass: Class = {
      ...classroom,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setClasses(prev => [...prev, newClass]);
  };

  const updateClassroom = (id: string, classroom: Partial<Class>) => {
    setClasses(prev => prev.map(c => 
      c.id === id ? { ...c, ...classroom, updatedAt: new Date() } : c
    ));
  };

  const deleteClassroom = (id: string) => {
    setClasses(prev => prev.filter(c => c.id !== id));
  };

  const getClassesByInstitution = (institutionId: string) => {
    return classes.filter(c => c.institutionId === institutionId);
  };

  // Fee Structure Management
  const addFeeStructure = (structure: Omit<FeeStructure, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newStructure: FeeStructure = {
      ...structure,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setFeeStructures(prev => [...prev, newStructure]);
  };

  const updateFeeStructure = (id: string, structure: Partial<FeeStructure>) => {
    setFeeStructures(prev => prev.map(s => 
      s.id === id ? { ...s, ...structure, updatedAt: new Date() } : s
    ));
  };

  const deleteFeeStructure = (id: string) => {
    setFeeStructures(prev => prev.filter(s => s.id !== id));
  };

  const getFeeStructuresByInstitution = (institutionId: string) => {
    return feeStructures.filter(s => s.institutionId === institutionId);
  };

  // Student Billing Management
  const addStudentBilling = (billing: Omit<StudentBilling, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newBilling: StudentBilling = {
      ...billing,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setStudentBillings(prev => [...prev, newBilling]);
  };

  const updateStudentBilling = (id: string, billing: Partial<StudentBilling>) => {
    setStudentBillings(prev => prev.map(b => 
      b.id === id ? { ...b, ...billing, updatedAt: new Date() } : b
    ));
  };

  const getBillingByStudent = (studentId: string, academicYearId: string) => {
    return studentBillings.find(b => b.studentId === studentId && b.academicYearId === academicYearId);
  };

  const getOverduePayments = () => {
    return studentBillings.filter(b => b.status === 'overdue' || b.status === 'defaulter');
  };

  // Payment Processing
  const processPayment = (payment: Omit<Payment, 'id' | 'createdAt'>) => {
    const newPayment: Payment = {
      ...payment,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setPayments(prev => [...prev, newPayment]);

    // Update student billing
    const billing = studentBillings.find(b => b.id === payment.studentBillingId);
    if (billing) {
      updateStudentBilling(billing.id, {
        paidAmount: billing.paidAmount + payment.amount,
        outstandingAmount: billing.outstandingAmount - payment.amount,
        status: billing.outstandingAmount - payment.amount <= 0 ? 'paid' : 'current'
      });
    }
  };

  const getPaymentHistory = (studentId: string) => {
    return payments.filter(p => p.studentId === studentId);
  };

  // Reporting
  const getAcademicYearReport = (yearId: string) => {
    const yearBillings = studentBillings.filter(b => b.academicYearId === yearId);
    const yearPayments = payments.filter(p => {
      const billing = studentBillings.find(b => b.id === p.studentBillingId);
      return billing?.academicYearId === yearId;
    });

    return {
      totalStudents: yearBillings.length,
      totalFees: yearBillings.reduce((sum, b) => sum + b.totalFees, 0),
      totalCollected: yearBillings.reduce((sum, b) => sum + b.paidAmount, 0),
      totalOutstanding: yearBillings.reduce((sum, b) => sum + b.outstandingAmount, 0),
      totalPayments: yearPayments.length,
      collectionRate: yearBillings.length > 0 ? 
        (yearBillings.reduce((sum, b) => sum + b.paidAmount, 0) / yearBillings.reduce((sum, b) => sum + b.totalFees, 0)) * 100 : 0
    };
  };

  const getInstitutionReport = (institutionId: string) => {
    const institutionBillings = studentBillings.filter(b => b.institutionId === institutionId);
    const institutionPayments = payments.filter(p => {
      const billing = studentBillings.find(b => b.id === p.studentBillingId);
      return billing?.institutionId === institutionId;
    });

    return {
      totalStudents: institutionBillings.length,
      totalFees: institutionBillings.reduce((sum, b) => sum + b.totalFees, 0),
      totalCollected: institutionBillings.reduce((sum, b) => sum + b.paidAmount, 0),
      totalOutstanding: institutionBillings.reduce((sum, b) => sum + b.outstandingAmount, 0),
      totalPayments: institutionPayments.length,
      overdueCount: institutionBillings.filter(b => b.status === 'overdue').length
    };
  };

  const getClassReport = (classId: string) => {
    const classBillings = studentBillings.filter(b => b.classId === classId);
    return {
      totalStudents: classBillings.length,
      totalFees: classBillings.reduce((sum, b) => sum + b.totalFees, 0),
      totalCollected: classBillings.reduce((sum, b) => sum + b.paidAmount, 0),
      totalOutstanding: classBillings.reduce((sum, b) => sum + b.outstandingAmount, 0),
      collectionRate: classBillings.length > 0 ? 
        (classBillings.reduce((sum, b) => sum + b.paidAmount, 0) / classBillings.reduce((sum, b) => sum + b.totalFees, 0)) * 100 : 0
    };
  };

  const getDefaultersList = (institutionId?: string) => {
    let defaulters = studentBillings.filter(b => b.status === 'defaulter' || b.status === 'overdue');
    if (institutionId) {
      defaulters = defaulters.filter(b => b.institutionId === institutionId);
    }
    return defaulters;
  };

  return (
    <SchoolContext.Provider value={{
      academicYears,
      currentAcademicYear,
      addAcademicYear,
      updateAcademicYear,
      deleteAcademicYear,
      setActiveAcademicYear,
      institutions,
      addInstitution,
      updateInstitution,
      deleteInstitution,
      getInstitutionById,
      classes,
      addClassroom,
      updateClassroom,
      deleteClassroom,
      getClassesByInstitution,
      feeStructures,
      addFeeStructure,
      updateFeeStructure,
      deleteFeeStructure,
      getFeeStructuresByInstitution,
      studentBillings,
      addStudentBilling,
      updateStudentBilling,
      getBillingByStudent,
      getOverduePayments,
      payments,
      processPayment,
      getPaymentHistory,
      getAcademicYearReport,
      getInstitutionReport,
      getClassReport,
      getDefaultersList
    }}>
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (context === undefined) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
};