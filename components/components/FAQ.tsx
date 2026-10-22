import React from 'react';

const faqItems = [
  {
    question: "How does SnapConvert handle my file privacy and security?",
    answer: "Your privacy is our top priority. SnapConvert performs file conversions directly in your web browser (client-side). Your files are never uploaded to any external server or stored in the cloud, guaranteeing 100% data privacy and confidentiality."
  },
  {
    question: "Is SnapConvert free to use?",
    answer: "Yes! SnapConvert is completely free to use with no hidden fees, no subscriptions, and no registration required."
  },
  {
    question: "Is there a file size limit for conversions?",
    answer: "Since processing happens locally on your device, speed depends on your browser and hardware performance rather than internet upload speeds. You can convert files instantly without server-side file size restrictions."
  },
  {
    question: "What file formats are supported?",
    answer: "SnapConvert supports a wide variety of formats including images (JPG, PNG, WebP, SVG), documents (PDF), and audio files."
  },
  {
    question: "Do I need to install any software or plugins?",
    answer: "No installation is required. SnapConvert works directly in any modern web browser across desktop, tablet, and mobile devices."
  }
];

export default function FAQ() {
  return (
    <section className="max-w-4xl mx-auto my-16 px-4">
      <h2 className="text-2xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100">
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        {faqItems.map((item, index) => (
          <details key={index} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition">
            <summary className="font-semibold text-lg cursor-pointer text-gray-900 dark:text-gray-100 focus:outline-none">
              {item.question}
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-300 leading-relaxed">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
