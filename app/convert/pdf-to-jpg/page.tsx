import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Convert PDF to JPG Online Free | SnapConvert',
  description: 'Convert PDF document pages into high-quality JPG images instantly. Free online PDF to image converter.',
}

export default function PdfToJpgPage() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '1rem' }}>
        Convert PDF to JPG Online Free
      </h1>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem' }}>
        Extract pages from your PDF documents and save them as clear JPG images.
      </p>

      <div style={{ border: '2px dashed #ccc', padding: '3rem', borderRadius: '8px', textAlign: 'center', backgroundColor: '#f9f9f9', marginBottom: '2rem' }}>
        <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Select your PDF file to start converting</p>
        <input type="file" accept="application/pdf" style={{ display: 'block', margin: '0 auto' }} />
      </div>

      <section style={{ marginTop: '2rem', lineHeight: '1.6', color: '#333' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '1.5rem' }}>How to Convert PDF to JPG?</h2>
        <ol style={{ paddingLeft: '1.5rem' }}>
          <li>Choose the PDF file you want to convert from your computer or phone.</li>
          <li>Click convert to turn document pages into image files.</li>
          <li>Download your JPG files instantly.</li>
        </ol>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '1.5rem' }}>Why convert PDF to image?</h2>
        <p>Converting PDF pages to JPG format makes them easy to view on mobile devices, share on social media, or embed into presentations without requiring a PDF reader.</p>
      </section>
    </div>
  )
}
