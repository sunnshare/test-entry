import { ref, computed, watch } from 'vue'
import { environments } from '@/config/environments'
import { projects } from '@/config/projects'
import { languages } from '@/config/languages'

const dcpToken = ref(localStorage.getItem('dcpToken') || '')
const selectedEnvId = ref('')
const selectedProjectId = ref('')
const selectedRoutePath = ref('')
const selectedLang = ref('ch')
const customParams = ref([])          // [{key, value}, ...]

function logout() {
  dcpToken.value = ''
  localStorage.removeItem('dcpToken')
}

// token 变化时自动保存
watch(dcpToken, (val) => {
  if (val.trim()) localStorage.setItem('dcpToken', val)
})

// 切换项目时清空路由（环境独立，不受项目影响）
watch(selectedProjectId, () => {
  selectedRoutePath.value = ''
})

const selectedEnv = computed(() => environments.find(e => e.id === selectedEnvId.value))
const selectedProject = computed(() => projects.find(p => p.id === selectedProjectId.value))
const allRoutes = computed(() => {
  const p = selectedProject.value
  return p ? p.routeGroups.flatMap(g => g.routes) : []
})

const finalUrl = computed(() => {
  const env = selectedEnv.value
  const project = selectedProject.value
  if (!env || !project || !selectedRoutePath.value) return ''
  const baseUrl = project.urls[env.id] || ''
  const params = new URLSearchParams()
  if (selectedLang.value) params.set('language', selectedLang.value)
  if (dcpToken.value) params.set('dcpToken', dcpToken.value)
  for (const p of customParams.value) {
    if (p.key.trim()) params.set(p.key.trim(), p.value)
  }
  const qs = params.toString()
  return `${baseUrl}#${selectedRoutePath.value}${qs ? '?' + qs : ''}`
})

function addParam(key, value) {
  const k = key.trim()
  if (!k) return
  const idx = customParams.value.findIndex(p => p.key === k)
  if (idx >= 0) {
    customParams.value[idx].value = value
  } else {
    customParams.value.push({ key: k, value })
  }
}

function removeParam(key) {
  customParams.value = customParams.value.filter(p => p.key !== key)
}

function jump(url) {
  const target = url || finalUrl.value
  if (!target) return
  window.open(target, '_blank')
}

function copyUrl(url) {
  const target = url || finalUrl.value
  if (!target) return
  try {
    navigator.clipboard.writeText(target)
  } catch { /* 非 HTTPS 环境可能失败 */ }
}

function reset() {
  selectedEnvId.value = ''
  selectedProjectId.value = ''
  selectedRoutePath.value = ''
  customParams.value = []
}

export function useWizard() {
  return {
    environments,
    projects,
    languages,
    dcpToken,
    logout,
    selectedEnvId,
    selectedProjectId,
    selectedRoutePath,
    selectedLang,
    customParams,
    selectedProject,
    allRoutes,
    finalUrl,
    addParam,
    removeParam,
    jump,
    copyUrl,
    reset,
  }
}
