import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { SchoolProvider } from './contexts/SchoolContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import StudentManagement from './components/StudentManagement';
import PaymentManagement from './components/PaymentManagement';
import Reports from './components/Reports';
import Settings from './components/Settings';
import AcademicYearManagement from './components/AcademicYearManagement';
import InstitutionManagement from './components/InstitutionManagement';
import ClassManagement from './components/ClassManagement';
import BillingManagement from './components/BillingManagement';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import './utils/datetime';

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <SchoolProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/academic-years" element={
                  <ProtectedRoute roles={['admin']}>
                    <Layout>
                      <AcademicYearManagement />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/institutions" element={
                  <ProtectedRoute roles={['admin']}>
                    <Layout>
                      <InstitutionManagement />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/classes" element={
                  <ProtectedRoute>
                    <Layout>
                      <ClassManagement />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/billing" element={
                  <ProtectedRoute>
                    <Layout>
                      <BillingManagement />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/students" element={
                  <ProtectedRoute>
                    <Layout>
                      <StudentManagement />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/payments" element={
                  <ProtectedRoute>
                    <Layout>
                      <PaymentManagement />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/reports" element={
                  <ProtectedRoute>
                    <Layout>
                      <Reports />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute roles={['admin']}>
                    <Layout>
                      <Settings />
                    </Layout>
                  </ProtectedRoute>
                } />
              </Routes>
            </div>
          </Router>
        </SchoolProvider>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;