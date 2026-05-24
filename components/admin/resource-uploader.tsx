'use client'

import { useRef, useState } from 'react'
import { Upload, Cloud, Loader2 } from 'lucide-react'

export default function ResourceUploader({ onUploadComplete }: { onUploadComplete: () => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isDragOver, setIsDragOver] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (!files) return
    await uploadFiles(files)
  }

  const uploadFiles = async (files: FileList) => {
    setIsUploading(true)
    setUploadProgress(0)

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const progress = Math.round(((i + 1) / files.length) * 100)
      setUploadProgress(progress)

      try {
        const formData = new FormData()
        formData.append('file', file)

        const res = await fetch('/api/upload', { method: 'POST', body: formData })
        if (!res.ok) {
          const data = await res.json()
          console.error('Upload error:', data.error)
        }
      } catch (error) {
        console.error('Upload error:', error)
      }
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    setIsUploading(false)
    setUploadProgress(0)
    onUploadComplete()
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    if (e.dataTransfer.files.length > 0) {
      await uploadFiles(e.dataTransfer.files)
    }
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-2xl p-8 transition-all duration-300 ${
        isDragOver
          ? 'border-primary bg-primary/5 scale-[1.01]'
          : 'border-border bg-card hover:border-primary/50 hover:bg-muted/30'
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileChange}
        disabled={isUploading}
        className="hidden"
        accept="image/*,video/*,audio/*,.pdf,.zip"
      />
      <div
        onClick={() => fileInputRef.current?.click()}
        className="cursor-pointer text-center"
      >
        {isUploading ? (
          <div className="animate-scale-in">
            <Loader2 className="w-10 h-10 text-primary mx-auto mb-4 animate-spin" />
            <p className="text-base font-semibold text-foreground mb-1">Subiendo archivos...</p>
            <p className="text-sm text-muted-foreground mb-4">{uploadProgress}% completado</p>
            <div className="max-w-xs mx-auto w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-primary to-purple-500 h-full transition-all duration-300 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        ) : (
          <>
            <div className={`w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center transition-all duration-300 ${
              isDragOver ? 'bg-primary/20' : 'bg-primary/10'
            }`}>
              {isDragOver ? (
                <Cloud className="w-7 h-7 text-primary animate-float" />
              ) : (
                <Upload className="w-7 h-7 text-primary" />
              )}
            </div>
            <p className="text-base font-semibold text-foreground mb-1">
              {isDragOver ? 'Suelta tus archivos aquí' : 'Arrastra archivos aquí o haz clic para seleccionar'}
            </p>
            <p className="text-sm text-muted-foreground">
              Imágenes, videos, audio, PDF y archivos comprimidos
            </p>
          </>
        )}
      </div>
    </div>
  )
}
