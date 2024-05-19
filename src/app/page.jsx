"use client";

import { useState } from 'react';

export default function Home() {
  const [images, setImages] = useState([]);
  const [imageUrl, setImageUrl] = useState('');

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const imagesWithTags = files.map(file => ({
      file,
      name: file.name,
      size: file.size,
      tags: [],
      type: 'file',
      path: `local:/${file.name}` // Simulando una ruta local
    }));
    setImages([...images, ...imagesWithTags]);
  };

  const handleImageUrlChange = (event) => {
    setImageUrl(event.target.value);
  };

  const handleAddImageUrl = () => {
    if (imageUrl.trim() !== '') {
      const newImage = {
        file: imageUrl,
        name: imageUrl.split('/').pop(),
        size: 'N/A',
        tags: [],
        type: 'url',
        path: imageUrl // La URL completa como "ruta"
      };
      setImages([...images, newImage]);
      setImageUrl('');
    }
  };

  const toBase64 = file => new Promise((resolve, reject) => {
    if (file.type === 'url') {
      fetch(file.file)
        .then(response => response.blob())
        .then(blob => {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });
    } else {
      const reader = new FileReader();
      reader.readAsDataURL(file.file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    }
  });

  const handleUploadToServer = async () => {
    const payload = await Promise.all(images.map(async (image) => ({
      name: image.name,
      image: await toBase64(image),
      tags: image.tags,
      path: image.path
    })));

    try {
      const response = await fetch('/api/images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Upload successful:', result);
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="p-6 rounded-lg shadow-lg bg-white">
        <h1 className="text-lg font-semibold text-center mb-4">Sube tu imagen</h1>
        <input 
          type="file" 
          accept="image/*" 
          multiple 
          onChange={handleImageUpload} 
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <input
          type="text"
          value={imageUrl}
          onChange={handleImageUrlChange}
          placeholder="Pega la URL de la imagen aquí"
          className="mt-4 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        <button
          onClick={handleAddImageUrl}
          className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Añadir URL de Imagen
        </button>
        {images.map((image, index) => (
          <div key={index} className="mt-4 p-2 border rounded">
            <p>{image.name} - {image.size} bytes</p>
            <p>Ruta: {image.path}</p>
            {image.type === 'url' ? (
              <img src={image.file} alt={image.name} className="max-w-xs" />
            ) : (
              <img src={URL.createObjectURL(image.file)} alt={image.name} className="max-w-xs" />
            )}
          </div>
        ))}
        <button
          onClick={handleUploadToServer}
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Subir Imágenes
        </button>
      </div>
    </div>
  );
}
