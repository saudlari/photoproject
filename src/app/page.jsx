"use client"

import { useState } from 'react';

export default function Home() {
  const [images, setImages] = useState([]);

  // This function will be triggered on file input change
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const imagesWithTags = files.map(file => ({
      file,
      name: file.name,
      size: file.size,
      tags: []
    }));
    setImages(imagesWithTags);
  };

  // Convert a file to a Base64 string
  const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  const handleAddTag = (index, tag) => {
    if (tag.trim() === '') return; // Prevent adding empty tags
    const updatedImages = images.map((image, idx) => {
      if (idx === index) {
        return {
          ...image,
          tags: [...image.tags, tag]
        };
      }
      return image;
    });
    setImages(updatedImages);
  };

  // Modified to convert images to Base64 before uploading
  const handleUploadToServer = async () => {
    const payload = await Promise.all(images.map(async (image) => ({
      name:image.name,
      image: await toBase64(image.file),
      tags: image.tags,
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
                  e.target.value = ''; // Clear input after adding tag
                }
              }}
              placeholder="Presiona Enter para añadir tag"
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        ))}
        <button
          onClick={handleUploadToServer}
          disabled={images.length === 0}
          className="mt-4 bg-blue-500 hover:bg-blue-700 disabled:bg-gray-400 disabled:hover:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded"
        >
          Upload Images
        </button>
      </div>
    </div>
  );
}

