"use client"

import { useState } from 'react';

export default function Home() {
  const [images, setImages] = useState([]);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const imagesWithTags = files.map(file => ({
      name: file.name,
      size: file.size,
      tags: [] // Las etiquetas ahora son un arreglo
    }));
    setImages(imagesWithTags);
  };

  const handleAddTag = (index, tag) => {
    if (tag.trim() === '') return; // Evita agregar etiquetas vacías
    const updatedImages = images.map((image, idx) => {
      if (idx === index) {
        return {
          ...image,
          tags: [...image.tags, tag] // Agrega una nueva etiqueta al arreglo existente
        };
      }
      return image;
    });
    setImages(updatedImages);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="p-6 rounded-lg shadow-lg bg-white">
        <h1 className="text-lg font-semibold text-center mb-4">Sube tu imagen</h1>
        <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100
        "/>
        {images.map((image, index) => (
          <div key={index} className="mt-4">
            <p className="text-gray-800">{image.name} - {image.size} bytes</p>
            <div className="flex flex-wrap gap-2 my-2">
              {image.tags.map((tag, tagIndex) => (
                <span key={tagIndex} className="bg-gray-200 rounded-full text-sm text-gray-800 px-2 py-1">
                  {tag}
                </span>
              ))}
            </div>
            <input
              type="text"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddTag(index, e.target.value);
                  e.target.value = ''; // Limpia el input después de agregar la etiqueta
                }
              }}
              placeholder="Presiona Enter para añadir tag"
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
