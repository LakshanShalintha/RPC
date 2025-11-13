'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { SliderService } from '@/lib/sliderService'
import { Slider } from '@/lib/supabase'
import { useAdminAuth } from '@/lib/useAdminAuth'

export default function SliderManagementPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAdminAuth()
  const [sliders, setSliders] = useState<Slider[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  
  // New popup system states
  const [showPopup, setShowPopup] = useState(false)
  const [popupMessage, setPopupMessage] = useState('')
  const [popupType, setPopupType] = useState<'success' | 'error' | 'loading' | 'confirm'>('success')
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)
  const [deleteConfirmImageUrl, setDeleteConfirmImageUrl] = useState<string | null>(null)

  const MAX_SLIDERS = 5

  useEffect(() => {
    if (isAuthenticated) {
      loadSliders()
    }
  }, [isAuthenticated])

  const showMessage = (message: string, type: 'success' | 'error' | 'loading' | 'confirm') => {
    setPopupMessage(message)
    setPopupType(type)
    setShowPopup(true)
    if (type !== 'loading' && type !== 'confirm') {
      setTimeout(() => setShowPopup(false), 3000)
    }
  }

  const confirmDelete = async () => {
    if (deleteConfirmId === null || deleteConfirmImageUrl === null) return
    
    setShowPopup(false)
    setTimeout(() => showMessage('Deleting slider...', 'loading'), 100)

    try {
      await SliderService.deleteSlider(deleteConfirmId, deleteConfirmImageUrl)
      setShowPopup(false)
      setTimeout(() => {
        showMessage('Slider deleted successfully!', 'success')
      }, 100)
      setDeleteConfirmId(null)
      setDeleteConfirmImageUrl(null)
      await loadSliders()
    } catch (error) {
      console.error('Failed to delete slider:', error)
      setShowPopup(false)
      setTimeout(() => {
        showMessage('Failed to delete slider', 'error')
      }, 100)
      setDeleteConfirmId(null)
      setDeleteConfirmImageUrl(null)
    }
  }

  const cancelDelete = () => {
    setShowPopup(false)
    setDeleteConfirmId(null)
    setDeleteConfirmImageUrl(null)
  }

  const loadSliders = async () => {
    try {
      setLoading(true)
      const data = await SliderService.getAllSliders()
      setSliders(data)
    } catch (err) {
      // Silently handle error on page load - don't show error popup
      console.error('Failed to load sliders:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Clear any previous errors
    setError(null)

    // Just validate and set the file, don't show errors yet
    // Validation will happen on upload button click
    if (file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024) {
      setSelectedFile(file)
      
      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      // Clear selection if invalid
      setSelectedFile(null)
      setPreviewUrl(null)
      e.target.value = ''
    }
  }

  const handleUpload = async () => {
    // Clear previous messages
    setError(null)
    setSuccess(null)

    // Validate on upload button click
    if (!selectedFile) {
      setError('Please select an image first')
      return
    }

    // Check if max limit reached
    if (sliders.length >= MAX_SLIDERS) {
      setError(`Maximum ${MAX_SLIDERS} slider images allowed. Please delete an image first.`)
      return
    }

    // Validate file type
    if (!selectedFile.type.startsWith('image/')) {
      setError('Please select a valid image file (JPG, PNG, GIF, WEBP)')
      return
    }

    // Validate file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB. Please choose a smaller image.')
      return
    }

    try {
      setUploading(true)
      showMessage('Uploading slider image...', 'loading')
      
      await SliderService.addSlider(selectedFile)
      setShowPopup(false)
      setTimeout(() => {
        showMessage('Slider image uploaded successfully!', 'success')
      }, 100)
      await loadSliders()
      
      // Reset file input and preview
      setSelectedFile(null)
      setPreviewUrl(null)
      const fileInput = document.getElementById('file-upload') as HTMLInputElement
      if (fileInput) fileInput.value = ''
    } catch (err) {
      setShowPopup(false)
      setTimeout(() => {
        showMessage('Failed to upload slider image. Please try again.', 'error')
      }, 100)
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  const handleCancelSelection = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setError(null)
    const fileInput = document.getElementById('file-upload') as HTMLInputElement
    if (fileInput) fileInput.value = ''
  }

  const handleDelete = (id: number, imageUrl: string) => {
    setDeleteConfirmId(id)
    setDeleteConfirmImageUrl(imageUrl)
    showMessage('Are you sure you want to delete this slider?', 'confirm')
  }

  const moveSlider = async (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= sliders.length) return

    try {
      setError(null)
      setSuccess(null)
      const newSliders = [...sliders]
      const temp = newSliders[index]
      newSliders[index] = newSliders[newIndex]
      newSliders[newIndex] = temp

      // Update order_index for both sliders
      await SliderService.updateSliderOrder(newSliders[index].id, index)
      await SliderService.updateSliderOrder(newSliders[newIndex].id, newIndex)

      setSliders(newSliders)
      setSuccess('Slider order updated successfully!')
    } catch (err) {
      setError('Failed to update slider order. Please try again.')
      console.error(err)
    }
  }

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1f1508] via-[#3b2f1e] to-[#2a1d0b] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-300"></div>
      </div>
    )
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1f1508] via-[#3b2f1e] to-[#2a1d0b] text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with Back Button */}
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={() => router.push('/admin')}
            className="bg-white/10 hover:bg-white/20 border border-yellow-300/30 rounded-xl p-3 transition-all group"
            title="Back to Admin Panel"
          >
            <svg className="w-6 h-6 text-yellow-500 group-hover:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">Home Page Slider Management</h1>
            <p className="text-amber-200">Upload and manage your slider images (Max {MAX_SLIDERS} images)</p>
          </div>
        </div>

        {/* Popup Messages */}
        {showPopup && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className={`${
              popupType === 'success' ? 'bg-gradient-to-br from-green-500/20 to-green-600/20 border-2 border-green-500' :
              popupType === 'error' ? 'bg-gradient-to-br from-red-500/20 to-red-600/20 border-2 border-red-500' :
              popupType === 'confirm' ? 'bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border-2 border-yellow-500' :
              'bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-2 border-blue-500'
            } rounded-2xl p-6 max-w-md w-full shadow-2xl animate-scale-in`}>
              <div className="flex flex-col items-center text-center">
                {popupType === 'loading' ? (
                  <>
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-400 mb-4"></div>
                    <h3 className="text-2xl font-bold text-blue-200 mb-2">Processing...</h3>
                    <p className="text-blue-100">{popupMessage}</p>
                  </>
                ) : popupType === 'confirm' ? (
                  <>
                    <div className="bg-yellow-500/20 p-4 rounded-full mb-4">
                      <svg className="w-16 h-16 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-yellow-200 mb-2">Confirm Delete</h3>
                    <p className="text-yellow-100 mb-6">{popupMessage}</p>
                    <div className="flex gap-3 w-full">
                      <button 
                        onClick={cancelDelete}
                        className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-all"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={confirmDelete}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className={`${
                      popupType === 'success' ? 'bg-green-500/20' : 'bg-red-500/20'
                    } p-4 rounded-full mb-4`}>
                      <svg className={`w-16 h-16 ${
                        popupType === 'success' ? 'text-green-400' : 'text-red-400'
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {popupType === 'success' ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        )}
                      </svg>
                    </div>
                    <h3 className={`text-2xl font-bold mb-2 ${
                      popupType === 'success' ? 'text-green-200' : 'text-red-200'
                    }`}>
                      {popupType === 'success' ? 'Success!' : 'Error!'}
                    </h3>
                    <p className={`mb-6 ${
                      popupType === 'success' ? 'text-green-100' : 'text-red-100'
                    }`}>{popupMessage}</p>
                    <button 
                      onClick={() => setShowPopup(false)} 
                      className={`${
                        popupType === 'success' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
                      } text-white px-8 py-3 rounded-xl font-semibold transition-all`}
                    >
                      Close
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Keep old error/success/uploading popups for backward compatibility */}
        {error && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 border-2 border-red-500 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-scale-in">
              <div className="flex flex-col items-center text-center">
                <div className="bg-red-500/20 p-4 rounded-full mb-4">
                  <svg className="w-16 h-16 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-red-200 mb-2">Error!</h3>
                <p className="text-red-100 mb-6">{error}</p>
                <button 
                  onClick={() => setError(null)} 
                  className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-xl font-semibold transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
        {success && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-2 border-green-500 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-scale-in">
              <div className="flex flex-col items-center text-center">
                <div className="bg-green-500/20 p-4 rounded-full mb-4">
                  <svg className="w-16 h-16 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-green-200 mb-2">Success!</h3>
                <p className="text-green-100 mb-6">{success}</p>
                <button 
                  onClick={() => setSuccess(null)} 
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl font-semibold transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
        {uploading && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-2 border-blue-500 rounded-2xl p-8 max-w-md w-full shadow-2xl">
              <div className="flex flex-col items-center text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-400 mb-4"></div>
                <h3 className="text-2xl font-bold text-blue-200 mb-2">Uploading...</h3>
                <p className="text-blue-100">Please wait while we upload your image</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-xl border border-yellow-300/30 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-amber-200">Current Images</p>
                <p className="text-2xl font-bold">{sliders.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl border border-yellow-300/30 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div className="bg-green-500/20 p-3 rounded-lg">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-amber-200">Available Slots</p>
                <p className="text-2xl font-bold">{MAX_SLIDERS - sliders.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl border border-yellow-300/30 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div className="bg-purple-500/20 p-3 rounded-lg">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-amber-200">Max Allowed</p>
                <p className="text-2xl font-bold">{MAX_SLIDERS}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        {sliders.length < MAX_SLIDERS && (
          <div className="bg-white/10 backdrop-blur-xl border border-yellow-300/30 rounded-2xl p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <svg className="w-7 h-7 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Upload New Slider Image
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Side - File Selection */}
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <label htmlFor="file-upload" className="block mb-2 text-sm font-semibold text-amber-200">
                    Step 1: Choose Image File
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    disabled={uploading || sliders.length >= MAX_SLIDERS}
                    className="block w-full text-sm text-white file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600 file:cursor-pointer cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    id="file-upload"
                  />
                </div>
                
                <div className="flex items-start gap-2 text-sm text-amber-200 bg-white/5 p-4 rounded-lg">
                  <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-semibold mb-1">Requirements:</p>
                    <ul className="space-y-1 text-xs">
                      <li>✓ Formats: JPG, PNG, GIF, WEBP</li>
                      <li>✓ Max size: 5MB</li>
                      <li>✓ Recommended: 1920x1080 pixels</li>
                      <li>✓ Available slots: {MAX_SLIDERS - sliders.length}</li>
                    </ul>
                  </div>
                </div>

                {selectedFile && (
                  <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-lg">
                    <p className="text-green-300 font-semibold mb-2 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      File Selected
                    </p>
                    <p className="text-sm text-green-200">📁 {selectedFile.name}</p>
                    <p className="text-xs text-green-200 mt-1">
                      Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                )}
              </div>

              {/* Right Side - Preview & Upload */}
              <div className="flex flex-col gap-4">
                <label className="block text-sm font-semibold text-amber-200">
                  Step 2: Preview & Upload
                </label>
                
                {previewUrl ? (
                  <div className="relative bg-black/20 rounded-xl overflow-hidden border-2 border-yellow-300/30">
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      Ready to Upload
                    </div>
                  </div>
                ) : (
                  <div className="bg-white/5 rounded-xl border-2 border-dashed border-yellow-300/30 h-64 flex items-center justify-center">
                    <div className="text-center">
                      <svg className="w-16 h-16 text-yellow-500/30 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-amber-200/50 text-sm">No image selected</p>
                      <p className="text-amber-200/30 text-xs mt-1">Choose a file to see preview</p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {selectedFile ? (
                    <>
                      <button
                        onClick={handleUpload}
                        disabled={uploading}
                        className="flex-1 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-500 text-black font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                      >
                        {uploading ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black"></div>
                            Uploading...
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            Upload Image
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleCancelSelection}
                        disabled={uploading}
                        className="bg-red-500 hover:bg-red-600 disabled:bg-gray-500 text-white font-bold py-3 px-6 rounded-xl transition-all disabled:cursor-not-allowed"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      disabled
                      className="flex-1 bg-gray-500 text-white font-bold py-3 px-6 rounded-xl cursor-not-allowed opacity-50"
                    >
                      Select an image first
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {sliders.length >= MAX_SLIDERS && (
          <div className="bg-orange-500/20 border border-orange-500 text-orange-200 px-4 py-3 rounded-lg mb-8 flex items-start gap-3">
            <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>Maximum limit reached! Delete an image to upload a new one.</span>
          </div>
        )}

        {/* Current Sliders */}
        <div className="bg-white/10 backdrop-blur-xl border border-yellow-300/30 rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <svg className="w-7 h-7 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            All Slider Images ({sliders.length}/{MAX_SLIDERS})
          </h2>
          
          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-500 mx-auto mb-4"></div>
              <p className="text-amber-200 text-lg">Loading sliders...</p>
            </div>
          ) : sliders.length === 0 ? (
            <div className="text-center py-16 bg-white/5 rounded-xl border-2 border-dashed border-yellow-300/30">
              <svg className="w-24 h-24 text-yellow-500/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-amber-200 text-xl font-semibold mb-2">No Slider Images Yet</p>
              <p className="text-amber-200/70">Upload your first slider image to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sliders.map((slider, index) => (
                <div
                  key={slider.id}
                  className="bg-white/5 border border-yellow-300/20 rounded-xl overflow-hidden hover:border-yellow-300/50 hover:shadow-lg transition-all group"
                >
                  {/* Image */}
                  <div className="relative h-64 bg-black/20">
                    <img
                      src={slider.image_url}
                      alt={`Slider ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-black/80 text-white px-3 py-1.5 rounded-full text-sm font-bold backdrop-blur-sm">
                      #{index + 1}
                    </div>
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <p className="text-white font-semibold">Position: {index + 1} of {sliders.length}</p>
                    </div>
                  </div>

                  {/* Info & Controls */}
                  <div className="p-4 space-y-3">
                    <div className="text-xs text-amber-200">
                      <p>📅 Added: {new Date(slider.created_at).toLocaleDateString()}</p>
                      <p>🕐 Time: {new Date(slider.created_at).toLocaleTimeString()}</p>
                    </div>

                    {/* Reorder Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => moveSlider(index, 'up')}
                        disabled={index === 0}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-1"
                        title={index === 0 ? 'Already at top' : 'Move Up'}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                        Up
                      </button>
                      <button
                        onClick={() => moveSlider(index, 'down')}
                        disabled={index === sliders.length - 1}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-1"
                        title={index === sliders.length - 1 ? 'Already at bottom' : 'Move Down'}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        Down
                      </button>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(slider.id, slider.image_url)}
                      className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete Image
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/30 rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-4 text-amber-300 flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Tips & Best Practices
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-amber-100">
            <div className="space-y-2">
              <p className="font-semibold text-amber-200">✨ Image Quality:</p>
              <ul className="space-y-1 pl-4">
                <li>• Use high-resolution images</li>
                <li>• Maintain consistent aspect ratio</li>
                <li>• Optimize file size before upload</li>
                <li>• Use WebP format for best results</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-amber-200">🎯 Management:</p>
              <ul className="space-y-1 pl-4">
                <li>• Reorder using Up/Down buttons</li>
                <li>• Delete unwanted images anytime</li>
                <li>• Maximum {MAX_SLIDERS} images allowed</li>
                <li>• Changes reflect immediately</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
