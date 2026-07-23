'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'

interface WardrobeItem {
  id: string
  image_url: string
  item_description: string
  color: string
  category: string
  created_at: string
}

export default function WardrobePage() {
  const { user } = useUser()
  const [items, setItems] = useState<WardrobeItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      fetchWardrobe()
    }
  }, [user])

  async function fetchWardrobe() {
    try {
      const res = await fetch('/api/wardrobe/items')
      if (res.ok) {
        const data = await res.json()
        setItems(data)
      }
    } catch (error) {
      console.error('Failed to fetch wardrobe:', error)
    } finally {
      setLoading(false)
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  async function handleUpload() {
    if (!selectedFile) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('image', selectedFile)

      const res = await fetch('/api/wardrobe/upload', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        const newItem = await res.json()
        setItems([newItem, ...items])
        setShowUploadModal(false)
        setSelectedFile(null)
        setPreviewUrl(null)
      }
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setUploading(false)
    }
  }

  async function deleteItem(id: string) {
    try {
      const res = await fetch(`/api/wardrobe/items/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setItems(items.filter((item) => item.id !== id))
      }
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-10 text-center">
        <p className="text-gray-600">Please sign in to access your wardrobe.</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
          My Wardrobe
        </h1>
        <p className="text-gray-400">Build your closet and get AI outfit recommendations</p>
      </div>

      <div className="flex gap-4 mb-10">
        <button
          onClick={() => setShowUploadModal(true)}
          className="px-6 py-2.5 rounded-full text-sm font-medium bg-[#6B2737] text-white hover:bg-[#8B3A4A] transition-colors">
          + Add Item
        </button>

        <Link
          href="/outfit-recommendations"
          className="px-6 py-2.5 rounded-full text-sm font-medium bg-gray-100 text-gray-900 hover:bg-gray-200 transition-colors">
          Get Outfit Recommendations
        </Link>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
              Add Item
            </h2>

            <div className="mb-4">
              {previewUrl ? (
                <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-100">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-full aspect-square rounded-xl bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                  <p className="text-gray-400 text-sm">No image selected</p>
                </div>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full mb-4"
            />

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowUploadModal(false)
                  setSelectedFile(null)
                  setPreviewUrl(null)
                }}
                className="flex-1 px-4 py-2 rounded-full text-sm font-medium border-2 border-gray-200 text-gray-600 hover:border-gray-300">
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className="flex-1 px-4 py-2 rounded-full text-sm font-medium bg-[#6B2737] text-white hover:bg-[#8B3A4A] disabled:opacity-50">
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wardrobe Grid */}
      {loading ? (
        <div className="text-center text-gray-400">Loading your wardrobe...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 mb-4">No items yet. Start building your wardrobe!</p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-6 py-2.5 rounded-full text-sm font-medium bg-[#6B2737] text-white hover:bg-[#8B3A4A]">
            Add Your First Item
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item.id} className="relative group">
              <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-100">
                <Image
                  src={item.image_url}
                  alt={item.item_description}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 rounded-xl transition-all flex flex-col items-center justify-center opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => deleteItem(item.id)}
                  className="px-3 py-1.5 bg-red-500 text-white rounded-full text-xs font-medium hover:bg-red-600">
                  Delete
                </button>
              </div>
              <div className="mt-2">
                <p className="text-xs text-gray-600">{item.category}</p>
                <p className="text-sm font-medium text-gray-900 truncate">{item.item_description}</p>
                <p className="text-xs text-gray-400">{item.color}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
