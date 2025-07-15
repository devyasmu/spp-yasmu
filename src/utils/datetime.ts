// Indonesian datetime utilities for timezone +7 (WIB)

export const formatDateTimeWIB = (date: Date): string => {
  return date.toLocaleString('id-ID', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

export const formatDateWIB = (date: Date): string => {
  return date.toLocaleDateString('id-ID', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatTimeWIB = (date: Date): string => {
  return date.toLocaleTimeString('id-ID', {
    timeZone: 'Asia/Jakarta',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getCurrentDateTimeWIB = (): Date => {
  return new Date();
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  }).format(amount);
};

export const getAcademicYear = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  
  // Academic year starts in July (month 6)
  if (month >= 6) {
    return `${year}/${year + 1}`;
  } else {
    return `${year - 1}/${year}`;
  }
};

export const getSemester = (): string => {
  const now = new Date();
  const month = now.getMonth();
  
  // Semester 1 (Ganjil): July - December
  // Semester 2 (Genap): January - June
  if (month >= 6) {
    return 'Ganjil';
  } else {
    return 'Genap';
  }
};