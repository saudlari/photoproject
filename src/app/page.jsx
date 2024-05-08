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
    <div className="container">
      <h1>Sube tu imagen</h1>
      <input type="file" accept="image/*" multiple onChange={handleImageUpload} />
      {images.map((image, index) => (
        <div key={index}>
          <p>{image.name} - {image.size} bytes</p>
          {image.tags.map((tag, tagIndex) => (
            <span key={tagIndex} style={{ marginRight: '10px' }}>{tag}</span>
          ))}
          <input
            type="text"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAddTag(index, e.target.value);
                e.target.value = ''; // Limpia el input después de agregar la etiqueta
              }
            }}
            placeholder="Presiona Enter para añadir tag"
          />
        </div>
      ))}
    </div>
  );
}
