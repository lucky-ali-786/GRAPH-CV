import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import RoasterView from './components/RoasterView';
import EnhancerView from './components/EnhancerView';
import ATSMatcherView from './components/ATSMatcherView';
import RoasterHistory from './components/history/RoasterHistory';
import EnhancerHistory from './components/history/EnhancerHistory';
import ATSMatchHistory from './components/history/ATSMatchHistory';
import RoastResultDetail from './components/history/RoastResultDetail';
import ATSEvalResultDetail from './components/history/ATSEvalResultDetail';
import EnhancementResultDetail from './components/history/EnhancementResultDetail';
import Login from './components/Login';
import Signup from './components/Signup';
import ResumeBuilder from './components/ResumeBuilder';
import { AuthProvider, useAuth } from './context/AuthContext';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function AppContent() {
  return (
    <Layout>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Protected Views */}
        <Route path="/roaster" element={
          <ProtectedRoute>
            <RoasterView />
          </ProtectedRoute>
        } />
        <Route path="/enhancer" element={
          <ProtectedRoute>
            <EnhancerView />
          </ProtectedRoute>
        } />
        <Route path="/ats-match" element={
          <ProtectedRoute>
            <ATSMatcherView />
          </ProtectedRoute>
        } />
        <Route path="/resume-builder" element={
          <ProtectedRoute>
            <ResumeBuilder />
          </ProtectedRoute>
        } />
        
        <Route path="/roaster-history" element={
          <ProtectedRoute>
            <RoasterHistory />
          </ProtectedRoute>
        } />
        <Route path="/enhancer-history" element={
          <ProtectedRoute>
            <EnhancerHistory />
          </ProtectedRoute>
        } />
        <Route path="/ats-match-history" element={
          <ProtectedRoute>
            <ATSMatchHistory />
          </ProtectedRoute>
        } />
        
        <Route path="/roast-result-detail" element={
          <ProtectedRoute>
            <RoastResultDetail />
          </ProtectedRoute>
        } />
        
        <Route path="/atseval-result-detail" element={
          <ProtectedRoute>
            <ATSEvalResultDetail />
          </ProtectedRoute>
        } />
        
        <Route path="/enhancement-result-detail" element={
          <ProtectedRoute>
            <EnhancementResultDetail />
          </ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}
