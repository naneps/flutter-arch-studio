import { useState } from 'react'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

export function useDownload() {
  const [downloading, setDownloading] = useState(false)

  const download = async (files, projectName = 'my_app') => {
    setDownloading(true)
    try {
      const zip = new JSZip()
      const root = zip.folder(projectName)
      Object.entries(files).forEach(([path, content]) => {
        root.file(path, content)
      })
      const blob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' })
      saveAs(blob, `${projectName}.zip`)
    } catch (e) {
      console.error('Download failed', e)
      alert('Download failed: ' + e.message)
    }
    setDownloading(false)
  }

  return { download, downloading }
}
