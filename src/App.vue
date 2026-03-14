<template>
  <div class="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
    <!-- Toolbar -->
    <div class="h-14 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 shrink-0">
      <div class="flex items-center gap-2">
        <span class="text-2xl">🎨</span>
        <h1 class="text-lg font-semibold text-gray-900 dark:text-white">Portfolio Builder</h1>
        <span v-if="store.isDirty" class="text-xs text-amber-500">●</span>
      </div>
      <div class="flex items-center gap-2">
        <button @click="showTemplates = true" class="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg">🎭 Templates</button>
        <button @click="exportJSON" class="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg">📤 Export</button>
        <button @click="exportPDF" class="px-3 py-1.5 text-sm bg-primary-600 text-white rounded-lg">📄 PDF</button>
        <button @click="toggleDark" class="p-2">{{ isDark ? '☀️' : '🌙' }}</button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Editor Sidebar -->
      <div class="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto p-4">
        <section class="mb-6">
          <h3 class="text-xs font-semibold text-gray-500 uppercase mb-3">👤 Basic Info</h3>
          <div class="space-y-3">
            <input v-model="store.portfolio.name" @change="store.saveToLocalStorage()" class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded text-sm" placeholder="Name" />
            <input v-model="store.portfolio.title" @change="store.saveToLocalStorage()" class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded text-sm" placeholder="Title" />
            <textarea v-model="store.portfolio.bio" @change="store.saveToLocalStorage()" rows="3" class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded text-sm" placeholder="Bio" />
            <input v-model="store.portfolio.location" @change="store.saveToLocalStorage()" class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded text-sm" placeholder="Location" />
            <input v-model="store.portfolio.email" @change="store.saveToLocalStorage()" class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded text-sm" placeholder="Email" />
          </div>
        </section>

        <section class="mb-6">
          <div class="flex justify-between items-center mb-3">
            <h3 class="text-xs font-semibold text-gray-500 uppercase">🚀 Projects</h3>
            <button @click="addProject" class="text-xs text-primary-600">+ Add</button>
          </div>
          <div v-for="p in store.portfolio.projects" :key="p.id" class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg mb-2">
            <input v-model="p.title" @change="store.saveToLocalStorage()" class="w-full px-2 py-1 bg-white dark:bg-gray-600 border rounded text-sm mb-2" placeholder="Project title" />
            <textarea v-model="p.description" @change="store.saveToLocalStorage()" rows="2" class="w-full px-2 py-1 bg-white dark:bg-gray-600 border rounded text-xs mb-2" placeholder="Description" />
            <input v-model="p.link" @change="store.saveToLocalStorage()" class="w-full px-2 py-1 bg-white dark:bg-gray-600 border rounded text-xs mb-2" placeholder="Project URL" />
            <input v-model="p.tags" @change="store.saveToLocalStorage()" class="w-full px-2 py-1 bg-white dark:bg-gray-600 border rounded text-xs" placeholder="Tags (comma separated)" />
            <button @click="store.removeProject(p.id)" class="text-red-500 text-xs mt-2">✕ Remove</button>
          </div>
        </section>

        <section class="mb-6">
          <div class="flex justify-between items-center mb-3">
            <h3 class="text-xs font-semibold text-gray-500 uppercase">💼 Experience</h3>
            <button @click="addExperience" class="text-xs text-primary-600">+ Add</button>
          </div>
          <div v-for="e in store.portfolio.experience" :key="e.id" class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg mb-2">
            <input v-model="e.company" @change="store.saveToLocalStorage()" class="w-full px-2 py-1 bg-white dark:bg-gray-600 border rounded text-sm mb-2" placeholder="Company" />
            <input v-model="e.role" @change="store.saveToLocalStorage()" class="w-full px-2 py-1 bg-white dark:bg-gray-600 border rounded text-sm mb-2" placeholder="Role" />
            <div class="flex gap-2 mb-2">
              <input v-model="e.startDate" @change="store.saveToLocalStorage()" class="flex-1 px-2 py-1 bg-white dark:bg-gray-600 border rounded text-xs" placeholder="Start" />
              <input v-model="e.endDate" @change="store.saveToLocalStorage()" class="flex-1 px-2 py-1 bg-white dark:bg-gray-600 border rounded text-xs" placeholder="End" />
            </div>
            <textarea v-model="e.description" @change="store.saveToLocalStorage()" rows="2" class="w-full px-2 py-1 bg-white dark:bg-gray-600 border rounded text-xs" placeholder="Description" />
            <label class="flex items-center gap-2 text-xs mt-2">
              <input type="checkbox" v-model="e.current" @change="store.saveToLocalStorage()" /> Current job
            </label>
            <button @click="store.removeExperience(e.id)" class="text-red-500 text-xs mt-2 block">✕ Remove</button>
          </div>
        </section>

        <section class="mb-6">
          <div class="flex justify-between items-center mb-3">
            <h3 class="text-xs font-semibold text-gray-500 uppercase">⚡ Skills</h3>
            <button @click="addSkill" class="text-xs text-primary-600">+ Add</button>
          </div>
          <div class="flex flex-wrap gap-2">
            <span v-for="s in store.portfolio.skills" :key="s.name" class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs flex items-center gap-1">
              {{ s.name }}<button @click="store.removeSkill(s.name)" class="text-gray-400 hover:text-red-500">×</button>
            </span>
          </div>
        </section>
      </div>

      <!-- Preview -->
      <div class="flex-1 bg-gray-100 dark:bg-gray-900 p-6 overflow-y-auto">
        <div class="max-w-3xl mx-auto">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <MinimalTemplate v-if="store.portfolio.template === 'minimal'" />
            <CreativeTemplate v-else-if="store.portfolio.template === 'creative'" />
            <ProfessionalTemplate v-else-if="store.portfolio.template === 'professional'" />
            <DeveloperTemplate v-else-if="store.portfolio.template === 'developer'" />
            <DesignerTemplate v-else-if="store.portfolio.template === 'designer'" />
            <MinimalTemplate v-else />
          </div>
        </div>
      </div>
    </div>

    <!-- Template Modal -->
    <div v-if="showTemplates" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="showTemplates = false">
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-3xl w-full">
        <h2 class="text-xl font-semibold mb-4">Choose Template</h2>
        <div class="grid grid-cols-3 gap-4">
          <div v-for="t in templates" :key="t.id" @click="selectTemplate(t.id)" 
            class="p-4 rounded-lg cursor-pointer border-2 hover:border-primary-500"
            :class="store.portfolio.template === t.id ? 'border-primary-500' : 'border-gray-200'">
            <div class="aspect-[3/4] rounded mb-2" :class="t.previewClass"></div>
            <p class="font-medium text-sm">{{ t.name }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { usePortfolioStore } from './stores/portfolio'
import MinimalTemplate from './components/Preview/templates/MinimalTemplate.vue'
import CreativeTemplate from './components/Preview/templates/CreativeTemplate.vue'
import ProfessionalTemplate from './components/Preview/templates/ProfessionalTemplate.vue'
import DeveloperTemplate from './components/Preview/templates/DeveloperTemplate.vue'
import DesignerTemplate from './components/Preview/templates/DesignerTemplate.vue'

const store = usePortfolioStore()
const showTemplates = ref(false)
const isDark = ref(false)

const templates = [
  { id: 'minimal', name: 'Minimal', previewClass: 'bg-gradient-to-br from-gray-800 to-gray-900' },
  { id: 'creative', name: 'Creative', previewClass: 'bg-gradient-to-br from-purple-600 to-pink-500' },
  { id: 'professional', name: 'Professional', previewClass: 'bg-gradient-to-br from-slate-800 to-slate-900' },
  { id: 'developer', name: 'Developer', previewClass: 'bg-gradient-to-br from-gray-900 to-green-900' },
  { id: 'designer', name: 'Designer', previewClass: 'bg-gradient-to-br from-rose-500 to-orange-400' }
]

onMounted(() => { store.loadFromLocalStorage() })

const toggleDark = () => { isDark.value = !isDark.value; document.documentElement.classList.toggle('dark') }
const selectTemplate = (id: string) => { store.setTemplate(id); showTemplates.value = false }
const addProject = () => store.addProject({ id: Date.now().toString(), title: '', description: '', tags: [], link: '' })
const addExperience = () => store.addExperience({ id: Date.now().toString(), company: '', role: '', startDate: '', endDate: '', current: false, description: '' })
const addSkill = () => { const n = prompt('Skill name:'); if (n) store.addSkill({ name: n, level: 80, category: 'frontend' }) }

const exportJSON = () => {
  const blob = new Blob([JSON.stringify(store.portfolio, null, 2)], { type: 'application/json' })
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'portfolio.json'; a.click()
}

const exportPDF = async () => {
  const html2pdf = (await import('html2pdf.js')).default
  const el = document.getElementById('preview-content')
  if (el) html2pdf().set({ margin: 0, filename: 'portfolio.pdf', image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2 }, jsPDF: { unit: 'mm', format: 'a4' } }).from(el).save()
}
</script>
