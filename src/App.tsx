import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import SparkleField from './components/SparkleField'
import HomePage from './pages/HomePage'
import AnalyzerPage from './pages/AnalyzerPage'
import GalleryPage from './pages/GalleryPage'
import ValuationPage from './pages/ValuationPage'
import HistoryPage from './pages/HistoryPage'
import DesignerPage from './pages/DesignerPage'
import ComparePage from './pages/ComparePage'
import DiamondChatbot from './components/DiamondChatbot'
import './index.css'

export default function App() {
  return (
    <BrowserRouter>
      <div className="relative min-h-screen" style={{ background: '#f8f5f0' }}>
        <SparkleField />
        <div className="relative z-10">
          <Navbar />
          <main>
            <Routes>
              <Route path="/"          element={<HomePage />} />
              <Route path="/analyzer"  element={<AnalyzerPage />} />
              <Route path="/gallery"   element={<GalleryPage />} />
              <Route path="/valuation" element={<ValuationPage />} />
              <Route path="/history"   element={<HistoryPage />} />
              <Route path="/designer"  element={<DesignerPage />} />
              <Route path="/compare"   element={<ComparePage />} />
            </Routes>
          </main>
        </div>
        <DiamondChatbot />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#fff',
              color: '#1a1a2e',
              border: '1px solid #e5e7eb',
              boxShadow: '0 4px 16px rgba(0,0,0,.1)',
            },
          }}
        />
      </div>
    </BrowserRouter>
  )
}
