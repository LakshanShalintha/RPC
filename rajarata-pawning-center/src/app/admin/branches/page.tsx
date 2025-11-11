'use client'

import { useState, useEffect } from 'react'
import { BranchService } from '@/lib/branchService'
import type { Branch } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useAdminAuth } from '@/lib/useAdminAuth'

export default function BranchesManagementPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAdminAuth()
  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null)
  
  // Form fields
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [titleSi, setTitleSi] = useState('')
  const [descriptionSi, setDescriptionSi] = useState('')
  const [isComingSoon, setIsComingSoon] = useState(false)
  
  // Popup messages
  const [showPopup, setShowPopup] = useState(false)
  const [popupMessage, setPopupMessage] = useState('')
  const [popupType, setPopupType] = useState<'success' | 'error' | 'loading'>('success')

  useEffect(() => {
    if (isAuthenticated) {
      loadBranches()
    }
  }, [isAuthenticated])

  const loadBranches = async () => {
    try {
      setLoading(true)
      const data = await BranchService.getAllBranches()
      setBranches(data)
    } catch (error) {
      console.error('Failed to load branches:', error)
      showMessage('Failed to load branches', 'error')
    } finally {
      setLoading(false)
    }
  }

  const showMessage = (message: string, type: 'success' | 'error' | 'loading') => {
    setPopupMessage(message)
    setPopupType(type)
    setShowPopup(true)
    if (type !== 'loading') {
      setTimeout(() => setShowPopup(false), 3000)
    }
  }

  const handleAddBranch = async () => {
    if (!title.trim()) {
      showMessage('Please enter a branch title', 'error')
      return
    }

    try {
      showMessage('Adding branch...', 'loading')
      await BranchService.addBranch(title, description, titleSi, descriptionSi, isComingSoon)
      setShowPopup(false) // Hide loading popup
      setTimeout(() => {
        showMessage('Branch added successfully!', 'success')
      }, 100) // Small delay to ensure smooth transition
      await loadBranches()
      setShowAddModal(false)
      resetForm()
    } catch (error) {
      console.error('Failed to add branch:', error)
      setShowPopup(false) // Hide loading popup
      setTimeout(() => {
        showMessage('Failed to add branch', 'error')
      }, 100)
    }
  }

  const handleEditBranch = async () => {
    if (!editingBranch || !title.trim()) {
      showMessage('Please enter a branch title', 'error')
      return
    }

    try {
      showMessage('Updating branch...', 'loading')
      await BranchService.updateBranch(editingBranch.id, title, description, titleSi, descriptionSi, isComingSoon)
      setShowPopup(false) // Hide loading popup
      setTimeout(() => {
        showMessage('Branch updated successfully!', 'success')
      }, 100)
      await loadBranches()
      setShowEditModal(false)
      setEditingBranch(null)
      resetForm()
    } catch (error) {
      console.error('Failed to update branch:', error)
      setShowPopup(false) // Hide loading popup
      setTimeout(() => {
        showMessage('Failed to update branch', 'error')
      }, 100)
    }
  }

  const handleDeleteBranch = async (id: number, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return
    }

    try {
      showMessage('Deleting branch...', 'loading')
      await BranchService.deleteBranch(id)
      setShowPopup(false) // Hide loading popup
      setTimeout(() => {
        showMessage('Branch deleted successfully!', 'success')
      }, 100)
      await loadBranches()
    } catch (error) {
      console.error('Failed to delete branch:', error)
      setShowPopup(false) // Hide loading popup
      setTimeout(() => {
        showMessage('Failed to delete branch', 'error')
      }, 100)
    }
  }

  const moveBranch = async (index: number, direction: 'up' | 'down') => {
    const newBranches = [...branches]
    const targetIndex = direction === 'up' ? index - 1 : index + 1

    if (targetIndex < 0 || targetIndex >= newBranches.length) {
      return
    }

    // Swap
    const temp = newBranches[index]
    newBranches[index] = newBranches[targetIndex]
    newBranches[targetIndex] = temp

    setBranches(newBranches)

    try {
      await BranchService.reorderBranches(newBranches)
      showMessage('Order updated!', 'success')
    } catch (error) {
      console.error('Failed to reorder:', error)
      showMessage('Failed to update order', 'error')
      await loadBranches()
    }
  }

  const openAddModal = () => {
    resetForm()
    setShowAddModal(true)
  }

  const openEditModal = (branch: Branch) => {
    setEditingBranch(branch)
    setTitle(branch.title)
    setDescription(branch.description)
    setTitleSi(branch.title_si || '')
    setDescriptionSi(branch.description_si || '')
    setIsComingSoon(branch.is_coming_soon)
    setShowEditModal(true)
  }

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setTitleSi('')
    setDescriptionSi('')
    setIsComingSoon(false)
  }

  const closeModals = () => {
    setShowAddModal(false)
    setShowEditModal(false)
    setEditingBranch(null)
    resetForm()
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
      <div className="max-w-7xl mx-auto">
        {/* Popup Message */}
        {showPopup && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className={`${
              popupType === 'success' ? 'bg-gradient-to-br from-green-500/20 to-green-600/20 border-2 border-green-500' :
              popupType === 'error' ? 'bg-gradient-to-br from-red-500/20 to-red-600/20 border-2 border-red-500' :
              'bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-2 border-blue-500'
            } rounded-2xl p-6 max-w-md w-full shadow-2xl animate-scale-in`}>
              <div className="flex flex-col items-center text-center">
                {popupType === 'loading' ? (
                  <>
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-400 mb-4"></div>
                    <h3 className="text-2xl font-bold text-blue-200 mb-2">Processing...</h3>
                    <p className="text-blue-100">{popupMessage}</p>
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

        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-8">
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
            <h1 className="text-4xl font-bold mb-2">Branches Management</h1>
            <p className="text-amber-200">Manage your branch locations</p>
          </div>
          <button
            onClick={openAddModal}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-xl transition-all font-semibold shadow-lg"
          >
            + Add Branch
          </button>
        </div>

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {showEditModal ? 'Edit Branch' : 'Add New Branch'}
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Branch Title (English) *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-800"
                    placeholder="e.g., Colombo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Branch Title (සිංහල) *
                  </label>
                  <input
                    type="text"
                    value={titleSi}
                    onChange={(e) => setTitleSi(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-800"
                    placeholder="උදා: කොළඹ"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (English)
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-800"
                    placeholder="Branch description..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (සිංහල)
                  </label>
                  <textarea
                    value={descriptionSi}
                    onChange={(e) => setDescriptionSi(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-800"
                    placeholder="ශාඛාවේ විස්තරය..."
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={showEditModal ? handleEditBranch : handleAddBranch}
                className="flex-1 bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors font-semibold"
              >
                {showEditModal ? 'Update' : 'Add'}
              </button>
              <button
                onClick={closeModals}
                className="flex-1 bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-xl border border-yellow-300/30 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-amber-200">Total Branches</p>
                <p className="text-2xl font-bold">{branches.length}</p>
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
                <p className="text-sm text-amber-200">Active Branches</p>
                <p className="text-2xl font-bold text-green-400">{branches.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Branches List */}
        <div className="bg-white/10 backdrop-blur-xl border border-yellow-300/30 rounded-xl p-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-300"></div>
            </div>
          ) : branches.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-amber-100 text-lg">No branches yet. Add your first branch!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {branches.map((branch, index) => (
                <div
                  key={branch.id}
                  className="bg-white/5 border border-yellow-300/20 rounded-lg p-4 flex items-center justify-between hover:bg-white/10 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-yellow-300 mb-1">{branch.title}</h3>
                    <p className="text-amber-100 mt-1">{branch.description || 'No description'}</p>
                    <p className="text-amber-200/50 text-xs mt-2">
                      Order: {branch.order_index} • Created: {new Date(branch.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => moveBranch(index, 'up')}
                      disabled={index === 0}
                      className="px-3 py-2 bg-blue-500/80 hover:bg-blue-500 text-white rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Move Up"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveBranch(index, 'down')}
                      disabled={index === branches.length - 1}
                      className="px-3 py-2 bg-blue-500/80 hover:bg-blue-500 text-white rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Move Down"
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => openEditModal(branch)}
                      className="px-4 py-2 bg-green-500/80 hover:bg-green-500 text-white rounded-lg transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteBranch(branch.id, branch.title)}
                      className="px-4 py-2 bg-red-500/80 hover:bg-red-500 text-white rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
