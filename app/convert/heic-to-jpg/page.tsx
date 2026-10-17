import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Convert HEIC to JPG Online Free | SnapConvert',
  description: 'Convert Apple iPhone HEIC images to standard JPG format instantly. Free, fast, and secure online conversion.',
}

export default function HeicToJpgPage() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '1rem' }}>
        Convert HEIC to JPG Online Free
      </h1>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem' }}>
        Easily convert iPhone HEIC photos into universal JPG format in seconds.
      </p>

      <div style={{ border: '2px dashed #ccc', padding: '3rem', borderRadius: '8px', textAlign: 'center', backgroundColor: '#f9f9f9', marginBottom: '2rem' }}>
        <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Select your HEIC image to start converting</p>
        <input type="file" accept="image/heic,image/heif" style={{ display: 'block', margin: '0 auto' }} />
      </div>

      <section style={{ marginTop: '2rem', lineHeight: '1.6', color: '#333' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '1.5rem' }}>How to Convert HEIC to JPG?</h2>
        <ol style={{ paddingLeft: '1.5rem' }}>
          <li>Select your HEIC photo file from your device.</li>
          <li>Click convert to process the image format.</li>
          <li>Download your new JPG image instantly.</li>
        </ol>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '1.5rem' }}>Why convert HEIC files?</h2>
        <p>While HEIC saves space on Apple devices, JPG is universally compatible with Windows, Android, and older web browsers.</p>
      </section>
    </div>
  )
}
