import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Convert PNG to JPG Online Free | SnapConvert',
  description: 'Fast and free online tool to convert PNG images to JPG format in seconds.',
}

export default function PngToJpgPage() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '1rem' }}>
        Convert PNG to JPG Online Free
      </h1>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem' }}>
        Easily convert your PNG files to high-quality JPG images without losing quality.
      </p>

      <div style={{ border: '2px dashed #ccc', padding: '3rem', borderRadius: '8px', textAlign: 'center', backgroundColor: '#f9f9f9', marginBottom: '2rem' }}>
        <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Select your PNG image to start converting</p>
        <input type="file" accept="image/png" style={{ display: 'block', margin: '0 auto' }} />
      </div>

      <section style={{ marginTop: '2rem', lineHeight: '1.6', color: '#333' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '1.5rem' }}>How to Convert PNG to JPG?</h2>
        <ol style={{ paddingLeft: '1.5rem' }}>
          <li>Select your PNG image file using the upload area above.</li>
          <li>Click the Convert button to start processing.</li>
          <li>Download your converted JPG image instantly.</li>
        </ol>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '1.5rem' }}>Frequently Asked Questions (FAQ)</h2>
        <p><strong>Is SnapConvert free to use?</strong><br />Yes, SnapConvert is 100% free with no hidden charges or registrations required.</p>
      </section>
    </div>
  )
}
