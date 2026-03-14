<template>
  <v-app>
    <!-- Toolbar -->
    <v-app-bar flat color="white" border="b">
      <v-app-bar-title class="d-flex align-center">
        <v-icon icon="mdi-palette" class="mr-2" color="primary"></v-icon>
        <span class="font-weight-bold">{{ $t('app.title') }}</span>
        <v-chip v-if="store.isDirty" size="x-small" color="warning" class="ml-2">●</v-chip>
      </v-app-bar-title>
      
      <v-spacer></v-spacer>
      
      <!-- Language Switcher -->
      <v-btn-toggle v-model="locale" mandatory variant="outlined" density="compact" class="mr-3">
        <v-btn value="en" size="small">EN</v-btn>
        <v-btn value="zh" size="small">中文</v-btn>
      </v-btn-toggle>

      <v-btn variant="tonal" color="primary" class="mr-2" @click="showTemplates = true">
        <v-icon icon="mdi-format-paint" class="mr-1"></v-icon>
        {{ $t('app.templates') }}
      </v-btn>
      
      <v-btn variant="tonal" class="mr-2" @click="exportJSON">
        <v-icon icon="mdi-export" class="mr-1"></v-icon>
        {{ $t('app.export') }}
      </v-btn>
      
      <v-btn variant="flat" color="primary" @click="exportPDF">
        <v-icon icon="mdi-file-pdf-box" class="mr-1"></v-icon>
        {{ $t('app.pdf') }}
      </v-btn>
    </v-app-bar>

    <v-main class="bg-grey-lighten-4">
      <v-container fluid class="pa-0">
        <v-row no-gutters>
          <!-- Editor Sidebar -->
          <v-col cols="12" md="4" lg="3" class="editor-sidebar">
            <v-card class="ma-3" rounded="lg" elevation="2">
              <v-card-title class="text-subtitle-1 font-weight-bold pb-0">
                {{ $t('editor.basicInfo') }}
              </v-card-title>
              <v-card-text>
                <v-text-field v-model="store.portfolio.name" @update:model-value="store.saveToLocalStorage()" 
                  :label="$t('editor.name')" variant="outlined" density="compact" hide-details class="mb-2"></v-text-field>
                <v-text-field v-model="store.portfolio.title" @update:model-value="store.saveToLocalStorage()" 
                  :label="$t('editor.title')" variant="outlined" density="compact" hide-details class="mb-2"></v-text-field>
                <v-textarea v-model="store.portfolio.bio" @update:model-value="store.saveToLocalStorage()" 
                  :label="$t('editor.bio')" variant="outlined" density="compact" rows="2" hide-details class="mb-2"></v-textarea>
                <v-text-field v-model="store.portfolio.location" @update:model-value="store.saveToLocalStorage()" 
                  :label="$t('editor.location')" variant="outlined" density="compact" hide-details class="mb-2"></v-text-field>
                <v-text-field v-model="store.portfolio.email" @update:model-value="store.saveToLocalStorage()" 
                  :label="$t('editor.email')" variant="outlined" density="compact" hide-details></v-text-field>
              </v-card-text>
            </v-card>

            <!-- Projects -->
            <v-card class="ma-3" rounded="lg" elevation="2">
              <v-card-title class="d-flex justify-space-between align-center pb-0">
                <span class="text-subtitle-1 font-weight-bold">{{ $t('editor.projects') }}</span>
                <v-btn size="small" color="primary" variant="tonal" @click="addProject">
                  <v-icon icon="mdi-plus" class="mr-1"></v-icon>
                  {{ $t('editor.addProject') }}
                </v-btn>
              </v-card-title>
              <v-card-text>
                <v-slide-y-transition group>
                  <v-card v-for="(p, idx) in store.portfolio.projects" :key="p.id" variant="outlined" class="mb-2" rounded="lg">
                    <v-card-text class="pb-2">
                      <v-text-field v-model="p.title" @update:model-value="saveProject(idx)" 
                        label="Project Title" variant="outlined" density="compact" hide-details class="mb-1"></v-text-field>
                      <v-textarea v-model="p.description" @update:model-value="saveProject(idx)" 
                        label="Description" variant="outlined" density="compact" rows="2" hide-details class="mb-1"></v-textarea>
                      <v-text-field v-model="p.link" @update:model-value="saveProject(idx)" 
                        label="Project URL" variant="outlined" density="compact" hide-details class="mb-1"></v-text-field>
                      <v-text-field v-model="p.tagsStr" @update:model-value="saveProject(idx)" 
                        label="Tags (comma separated)" variant="outlined" density="compact" hide-details></v-text-field>
                    </v-card-text>
                    <v-card-actions class="pt-0">
                      <v-spacer></v-spacer>
                      <v-btn size="small" color="error" variant="text" @click="store.removeProject(p.id)">
                        <v-icon icon="mdi-delete"></v-icon>
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-slide-y-transition>
              </v-card-text>
            </v-card>

            <!-- Skills -->
            <v-card class="ma-3" rounded="lg" elevation="2">
              <v-card-title class="d-flex justify-space-between align-center pb-0">
                <span class="text-subtitle-1 font-weight-bold">{{ $t('editor.skills') }}</span>
                <v-btn size="small" color="primary" variant="tonal" @click="addSkill">
                  <v-icon icon="mdi-plus" class="mr-1"></v-icon>
                  {{ $t('editor.addSkill') }}
                </v-btn>
              </v-card-title>
              <v-card-text>
                <v-chip-group>
                  <v-chip v-for="s in store.portfolio.skills" :key="s.name" closable @click:close="store.removeSkill(s.name)">
                    {{ s.name }}
                  </v-chip>
                </v-chip-group>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Preview -->
          <v-col cols="12" md="8" lg="9">
            <div class="pa-3" style="height: calc(100vh - 64px); overflow-y: auto;">
              <v-card rounded="lg" elevation="4" class="preview-card">
                <v-fade-transition mode="out-in">
                  <component :is="currentTemplate" :key="store.portfolio.template" />
                </v-fade-transition>
              </v-card>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- Template Dialog -->
    <v-dialog v-model="showTemplates" max-width="800">
      <v-card rounded="xl">
        <v-card-title class="text-h5 font-weight-bold pa-4">
          {{ $t('templates.choose') }}
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col v-for="t in templates" :key="t.id" cols="6" md="4">
              <v-card 
                @click="selectTemplate(t.id)" 
                :class="['template-card', { 'selected': store.portfolio.template === t.id }]"
                rounded="lg" 
                elevation="0"
                border
                class="pa-2 cursor-pointer"
              >
                <div :class="['template-preview', t.previewClass]" style="height: 120px; border-radius: 8px;"></div>
                <div class="text-center mt-2 font-weight-medium">{{ $t(`templates.${t.id}`) }}</div>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="showTemplates = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePortfolioStore } from './stores/portfolio'
import MinimalTemplate from './components/Preview/templates/MinimalTemplate.vue'
import CreativeTemplate from './components/Preview/templates/CreativeTemplate.vue'
import ProfessionalTemplate from './components/Preview/templates/ProfessionalTemplate.vue'
import DeveloperTemplate from './components/Preview/templates/DeveloperTemplate.vue'
import DesignerTemplate from './components/Preview/templates/DesignerTemplate.vue'

const { locale, t } = useI18n()
const store = usePortfolioStore()
const showTemplates = ref(false)

const templates = [
  { id: 'minimal', previewClass: 'bg-gradient-to-br from-gray-800 to-gray-900' },
  { id: 'creative', previewClass: 'bg-gradient-to-br from-purple-600 to-pink-500' },
  { id: 'professional', previewClass: 'bg-gradient-to-br from-slate-800 to-slate-900' },
  { id: 'developer', previewClass: 'bg-gradient-to-br from-gray-900 to-green-900' },
  { id: 'designer', previewClass: 'bg-gradient-to-br from-rose-500 to-orange-400' }
]

const currentTemplate = computed(() => {
  const map: Record<string, any> = {
    minimal: MinimalTemplate,
    creative: CreativeTemplate,
    professional: ProfessionalTemplate,
    developer: DeveloperTemplate,
    designer: DesignerTemplate
  }
  return map[store.portfolio.template] || MinimalTemplate
})

onMounted(() => { 
  store.loadFromLocalStorage() 
  // Convert tags array to string for editing
  store.portfolio.projects.forEach(p => {
    (p as any).tagsStr = p.tags.join(', ')
  })
})

const selectTemplate = (id: string) => {
  store.setTemplate(id)
  showTemplates.value = false
}

const saveProject = (idx: number) => {
  const p = store.portfolio.projects[idx]
  if ((p as any).tagsStr !== undefined) {
    p.tags = (p as any).tagsStr.split(',').map((t: string) => t.trim()).filter(Boolean)
  }
  store.saveToLocalStorage()
}

const addProject = () => {
  store.addProject({ id: Date.now().toString(), title: '', description: '', tags: [], link: '', tagsStr: '' })
}

const addSkill = () => {
  const n = prompt('Skill name:')
  if (n) store.addSkill({ name: n, level: 80, category: 'frontend' })
}

const exportJSON = () => {
  const data = { ...store.portfolio }
  delete (data as any).projects
  const projects = store.portfolio.projects.map(p => {
    const { tagsStr, ...rest } = p as any
    return rest
  })
  const exportData = { ...data, projects }
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'portfolio.json'; a.click()
}

const exportPDF = async () => {
  const html2pdf = (await import('html2pdf.js')).default
  const el = document.querySelector('.preview-card .preview-content') as HTMLElement
  if (el) {
    html2pdf().set({ margin: 0, filename: 'portfolio.pdf', image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2 }, jsPDF: { unit: 'mm', format: 'a4' } }).from(el).save()
  }
}
</script>

<style scoped>
.editor-sidebar {
  max-height: calc(100vh - 64px);
  overflow-y: auto;
}
.template-card {
  transition: all 0.3s ease;
}
.template-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
.template-card.selected {
  border-color: rgb(var(--v-theme-primary)) !important;
  box-shadow: 0 0 0 2px rgb(var(--v-theme-primary));
}
.preview-card {
  overflow: hidden;
}
</style>
