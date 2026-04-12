export default function GalleryGrid({ images }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
      {images.map((img, i) => (
        <div
          key={i}
          className={`img-overlay ${i === 0 ? 'col-span-2 md:col-span-2 row-span-2' : ''}`}
          style={{ height: i === 0 ? '380px' : '180px' }}
        >
          <img src={img.src} alt={img.alt || ''} loading="lazy" />
          <div className="overlay">
            {img.label && <span>{img.label}</span>}
          </div>
        </div>
      ))}
    </div>
  )
}
