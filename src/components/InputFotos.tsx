import React, { useRef, useState } from 'react'
import { Image, X } from '@phosphor-icons/react'
import { Button } from './Button'

interface InputFotosProps {
  onChange: (fotos: string[]) => void
  value: string[]
  error?: boolean
  textError?: React.ReactNode
}

export default function InputFotos({
  onChange,
  value,
  error,
  textError
}: InputFotosProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newFotos: string[] = []
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader()
        reader.onload = (e) => {
          if (e.target?.result) {
            newFotos.push(e.target.result.toString().split(',')[1])
            if (newFotos.length === files.length) {
              onChange([...value, ...newFotos])
            }
          }
        }
        reader.readAsDataURL(files[i])
      }
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files) {
      const newFotos: string[] = []
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader()
        reader.onload = (e) => {
          if (e.target?.result) {
            newFotos.push(e.target.result.toString().split(',')[1])
            if (newFotos.length === files.length) {
              onChange([...value, ...newFotos])
            }
          }
        }
        reader.readAsDataURL(files[i])
      }
    }
  }

  const removeFoto = (index: number) => {
    const novasFotos = [...value]
    novasFotos.splice(index, 1)
    onChange(novasFotos)
  }

  return (
    <div className="relative">
      <div className="space-y-2 mb-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
        {value.length > 0 && (
          <p className="text-black text-sm">Imagens selecionadas:</p>
        )}

        {value.map((foto, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-white p-1 rounded-md border border-gray-300 px-3">
            <div className="flex items-center gap-2">
              <img
                src={`data:image/jpeg;base64,${foto}`}
                alt={`Foto ${index + 1}`}
                className="w-10 h-10 object-cover rounded"
              />
              <span className="text-sm text-gray-700">Foto {index + 1}</span>
            </div>
            <button
              onClick={() => removeFoto(index)}
              className="text-red-600 hover:bg-red-100 rounded-full p-1 cursor-pointer">
              <X size={20} />
            </button>
          </div>
        ))}
      </div>

      <div
        className={`flex gap-2 mb-2 ${
          isDragging ? 'bg-blue-50' : error ? 'bg-red-50' : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}>
        <Button
          title="Anexar"
          onClick={() => fileInputRef.current?.click()}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors duration-300 w-full"
          iconLeft={<Image size={20} />}
        />
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        multiple
        className="hidden"
      />

      {textError && textError}
    </div>
  )
}
