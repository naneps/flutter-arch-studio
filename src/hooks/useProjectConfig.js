import { useState, useMemo } from 'react'
import { buildProject } from '../generators/projectBuilder.js'

export function useProjectConfig() {
  const [projectName, setProjectName] = useState('my_app')
  const [orgName, setOrgName] = useState('com.example')
  const [arch, setArch] = useState('clean')
  const [state, setState] = useState('bloc')
  const [feats, setFeats] = useState(['auth', 'api'])

  const toggleFeat = (id) =>
    setFeats(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id])

  const files = useMemo(() => buildProject(projectName, orgName, arch, state, feats), [projectName, orgName, arch, state, feats])

  return { projectName, setProjectName, orgName, setOrgName, arch, setArch, state, setState, feats, toggleFeat, files }
}
