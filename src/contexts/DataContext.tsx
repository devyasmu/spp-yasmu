import React, { createContext, useContext, useState, useEffect } from 'react';

interface Student {
  id: string;
  nis: string;
  name: string;
  class: string;
  academicYear: string;
  institution: string;
  status: 'active' | 'inactive';
  phone: string;
  email: string;
  address: string;
  totalFee: number;
  paidAmount: number;
  outstandingAmount: number;
  lastPayment: Date | null;
  createdAt: Date;
}

interface Payment {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  feeType: string;
  paymentMethod: 'tunai' | 'transfer' | 'kartu';
  status: 'pending' | 'completed' | 'failed';
  processedBy: string;
  processedAt: Date;
  receiptNumber: string;
  notes?: string;
}

interface Transaction {
  id: string;
  date: Date;
  totalAmount: number;
  totalTransactions: number;
  cashier: string;
  status: 'open' | 'closed';
  payments: Payment[];
}

interface DataContextType {
  students: Student[];
  payments: Payment[];
  transactions: Transaction[];
  addStudent: (student: Omit<Student, 'id' | 'createdAt'>) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  addPayment: (payment: Omit<Payment, 'id' | 'processedAt'>) => void;
  getStudentById: (id: string) => Student | undefined;
  getPaymentsByStudent: (studentId: string) => Payment[];
  getDailyStats: () => {
    totalCollected: number;
    totalTransactions: number;
    outstandingAmount: number;
    activeStudents: number;
  };
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Mock data
const mockStudents: Student[] = [
  {
    id: '1',
    nis: '2021001',
    name: 'Ahmad Fauzi',
    class: 'X IPA 1',
    academicYear: '2024/2025',
    institution: 'SMA Negeri 1 Jakarta',
    status: 'active',
    phone: '081234567890',
    email: 'ahmad.fauzi@email.com',
    address: 'Jl. Sudirman No. 123, Jakarta',
    totalFee: 2400000,
    paidAmount: 800000,
    outstandingAmount: 1600000,
    lastPayment: new Date('2024-01-15'),
    createdAt: new Date('2024-01-01')
  },
  {
    id: '2',
    nis: '2021002',
    name: 'Siti Nurhaliza',
    class: 'X IPA 2',
    academicYear: '2024/2025',
    institution: 'SMA Negeri 1 Jakarta',
    status: 'active',
    phone: '081234567891',
    email: 'siti.nurhaliza@email.com',
    address: 'Jl. Thamrin No. 456, Jakarta',
    totalFee: 2400000,
    paidAmount: 1200000,
    outstandingAmount: 1200000,
    lastPayment: new Date('2024-01-20'),
    createdAt: new Date('2024-01-01')
  },
  {
    id: '3',
    nis: '2021003',
    name: 'Budi Santoso',
    class: 'XI IPS 1',
    academicYear: '2024/2025',
    institution: 'SMA Negeri 1 Jakarta',
    status: 'active',
    phone: '081234567892',
    email: 'budi.santoso@email.com',
    address: 'Jl. Gatot Subroto No. 789, Jakarta',
    totalFee: 2400000,
    paidAmount: 2400000,
    outstandingAmount: 0,
    lastPayment: new Date('2024-01-25'),
    createdAt: new Date('2024-01-01')
  }
];

const mockPayments: Payment[] = [
  {
    id: '1',
    studentId: '1',
    studentName: 'Ahmad Fauzi',
    amount: 400000,
    feeType: 'SPP Januari',
    paymentMethod: 'tunai',
    status: 'completed',
    processedBy: 'Kasir Satu',
    processedAt: new Date('2024-01-15'),
    receiptNumber: 'RCP-2024-001',
    notes: 'Pembayaran SPP bulan Januari'
  },
  {
    id: '2',
    studentId: '2',
    studentName: 'Siti Nurhaliza',
    amount: 800000,
    feeType: 'SPP Januari-Februari',
    paymentMethod: 'transfer',
    status: 'completed',
    processedBy: 'Kasir Dua',
    processedAt: new Date('2024-01-20'),
    receiptNumber: 'RCP-2024-002',
    notes: 'Pembayaran SPP 2 bulan'
  }
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const addStudent = (student: Omit<Student, 'id' | 'createdAt'>) => {
    const newStudent: Student = {
      ...student,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setStudents(prev => [...prev, newStudent]);
  };

  const updateStudent = (id: string, updatedStudent: Partial<Student>) => {
    setStudents(prev => prev.map(student => 
      student.id === id ? { ...student, ...updatedStudent } : student
    ));
  };

  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(student => student.id !== id));
  };

  const addPayment = (payment: Omit<Payment, 'id' | 'processedAt'>) => {
    const newPayment: Payment = {
      ...payment,
      id: Date.now().toString(),
      processedAt: new Date()
    };
    setPayments(prev => [...prev, newPayment]);
    
    // Update student's payment info
    updateStudent(payment.studentId, {
      paidAmount: students.find(s => s.id === payment.studentId)!.paidAmount + payment.amount,
      outstandingAmount: students.find(s => s.id === payment.studentId)!.outstandingAmount - payment.amount,
      lastPayment: new Date()
    });
  };

  const getStudentById = (id: string) => {
    return students.find(student => student.id === id);
  };

  const getPaymentsByStudent = (studentId: string) => {
    return payments.filter(payment => payment.studentId === studentId);
  };

  const getDailyStats = () => {
    const today = new Date();
    const todayPayments = payments.filter(p => 
      p.processedAt.toDateString() === today.toDateString()
    );
    
    return {
      totalCollected: todayPayments.reduce((sum, p) => sum + p.amount, 0),
      totalTransactions: todayPayments.length,
      outstandingAmount: students.reduce((sum, s) => sum + s.outstandingAmount, 0),
      activeStudents: students.filter(s => s.status === 'active').length
    };
  };

  return (
    <DataContext.Provider value={{
      students,
      payments,
      transactions,
      addStudent,
      updateStudent,
      deleteStudent,
      addPayment,
      getStudentById,
      getPaymentsByStudent,
      getDailyStats
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};