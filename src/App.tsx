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
import './index.css'

export default function App() {
  return (
    <BrowserRouter>
      <div className="relative min-h-screen" style={{ background: '#03020a' }}>
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
            </Routes>
          </main>
        </div>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'rgba(10,10,20,0.95)',
              color: '#e2e8f0',
              border: '1px solid rgba(168,216,234,0.2)',
            },
          }}
        />
      </div>
    </BrowserRouter>
  )
}
