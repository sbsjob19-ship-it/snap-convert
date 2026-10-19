'use client'

import { useEffect, useRef } from 'react'

export default function AdsterraBanner() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Évite d'injecter le script plusieurs fois
    if (containerRef.current && containerRef.current.children.length === 0) {
      // 1. Création du div conteneur requis par Adsterra
      const containerDiv = document.createElement('div')
      containerDiv.id = 'container-81854ad366d275e808d326afbc91f824'

      // 2. Création du script d'annonce Adsterra
      const adScript = document.createElement('script')
      adScript.async = true
      adScript.setAttribute('data-cfasync', 'false')
      adScript.src = 'https://bauval.org/21/81854ad366d275e808d326afbc91f824'

      // 3. Injection dans le composant
      containerRef.current.appendChild(containerDiv)
      containerRef.current.appendChild(adScript)
    }
  }, [])

  return (
    <div className="flex justify-center my-6">
      <div ref={containerRef} />
    </div>
  )
}
