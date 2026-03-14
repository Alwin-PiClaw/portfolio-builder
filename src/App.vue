<template>
  <v-app class="portfolio-app">
    <!-- Toolbar -->
    <v-app-bar flat color="white" border="b" class="px-2">
      <v-app-bar-title class="d-flex align-center">
        <v-icon icon="mdi-palette" class="mr-2" color="primary" size="large"></v-icon>
        <span class="text-h6 font-weight-bold">{{ $t('app.title') }}</span>
        <v-chip v-if="store.isDirty" size="x-small" color="warning" class="ml-2" variant="flat">●</v-chip>
      </v-app-bar-title>
      
      <v-spacer></v-spacer>
      
      <!-- Language Switcher -->
      <v-btn-toggle v-model="locale" mandatory variant="outlined" density="compact" class="mr-3" rounded="lg">
        <v-btn value="en" size="small" variant="flat">EN</v-btn>
        <v-btn value="zh" size="small" variant="flat">中文</v-btn>
      </v-btn-toggle>

      <v-btn variant="tonal" color="primary" class="mr-2" @click="showTemplates = true">
        <v-icon icon="mdi-format-paint" class="mr-1"></v-icon>
        {{ $t('app.templates') }}
      </v-btn>
      
      <v-btn variant="tonal" class="mr-2" @click="handleExportJSON">
        <v-icon icon="mdi-export" class="mr-1"></v-icon>
        {{ $t('app.export') }}
      </v-btn>
      
      <v-btn variant="flat" color="primary" @click="handleExportPDF">
        <v-icon icon="mdi-file-pdf-box" class="mr-1"></v-icon>
        {{ $t('app.pdf') }}
      </v-btn>
    </v-app-bar>

    <v-main class="bg-grey-lighten-5">
      <v-container fluid class="pa-0">
        <v-row no-gutters class="fill-height">
          <!-- Editor Sidebar -->
          <v-col cols="12" md="4" lg="3" class="editor-sidebar">
            <div class="pa-3 pb-6">
              <!-- Profile Card -->
              <v-card class="mb-3" rounded="xl" elevation="0" border>
                <v-card-item>
                  <template v-slot:prepend>
                    <v-avatar color="primary" variant="tonal" size="40">
                      <v-icon icon="mdi-account"></v-icon>
                    </v-avatar>
                  </template>
                  <v-card-title class="text-body-1 font-weight-bold pa-0">{{ $t('editor.basicInfo') }}</v-card-title>
                </v-card-item>
                <v-card-text class="pt-3">
                  <v-text-field 
                    v-model="store.portfolio.name" 
                    @update:model-value="handleSave" 
                    :label="$t('editor.name')" 
                    variant="outlined"
                    prepend-inner-icon="mdi-account"
                    class="mb-2"
                  ></v-text-field>
                  <v-text-field 
                    v-model="store.portfolio.title" 
                    @update:model-value="handleSave" 
                    :label="$t('editor.title')" 
                    variant="outlined"
                    prepend-inner-icon="mdi-briefcase"
                    class="mb-2"
                  ></v-text-field>
                  <v-textarea 
                    v-model="store.portfolio.bio" 
                    @update:model-value="handleSave" 
                    :label="$t('editor.bio')" 
                    variant="outlined"
                    rows="3"
                    prepend-inner-icon="mdi-text"
                    class="mb-2"
                  ></v-textarea>
                  <v-text-field 
                    v-model="store.portfolio.location" 
                    @update:model-value="handleSave" 
                    :label="$t('editor.location')" 
                    variant="outlined"
                    prepend-inner-icon="mdi-map-marker"
                    class="mb-2"
                  ></v-text-field>
                  <v-text-field 
                    v-model="store.portfolio.email" 
                    @update:model-value="handleSave" 
                    :label="$t('editor.email')" 
                    variant="outlined"
                    prepend-inner-icon="mdi-email"
                  ></v-text-field>
                </v-card-text>
              </v-card>

              <!-- Projects Card -->
              <v-card class="mb-3" rounded="xl" elevation="0" border>
                <v-card-item>
                  <template v-slot:prepend>
                    <v-avatar color="amber" variant="tonal" size="40">
                      <v-icon icon="mdi-briefcase-outline"></v-icon>
                    </v-avatar>
                  </template>
                  <v-card-title class="text-body-1 font-weight-bold pa-0">
                    {{ $t('editor.projects') }}
                  </v-card-title>
                  <template v-slot:append>
                    <v-btn size="small" color="primary" variant="tonal" @click="addProject" rounded="lg">
                      <v-icon icon="mdi-plus" size="small"></v-icon>
                    </v-btn>
                  </template>
                </v-card-item>
                <v-card-text class="pt-2">
                  <v-slide-y-transition group tag="div">
                    <v-card 
                      v-for="(p, idx) in store.portfolio.projects" 
                      :key="p.id" 
                      variant="outlined" 
                      class="mb-3" 
                      rounded="lg"
                      elevation="0"
                    >
                      <v-card-text class="pb-2">
                        <v-text-field 
                          v-model="p.title" 
                          @update:model-value="() => saveProject(idx)" 
                          label="Project Title" 
                          variant="outlined"
                          class="mb-2"
                        ></v-text-field>
                        <v-textarea 
                          v-model="p.description" 
                          @update:model-value="() => saveProject(idx)" 
                          label="Description" 
                          variant="outlined"
                          rows="2"
                          class="mb-2"
                        ></v-textarea>
                        <v-text-field 
                          v-model="p.link" 
                          @update:model-value="() => saveProject(idx)" 
                          label="Project URL" 
                          variant="outlined"
                          class="mb-2"
                        ></v-text-field>
                        <v-text-field 
                          v-model="p.tagsStr" 
                          @update:model-value="() => saveProject(idx)" 
                          label="Tags (comma separated)" 
                          variant="outlined"
                        ></v-text-field>
                      </v-card-text>
                      <v-divider></v-divider>
                      <v-card-actions class="pt-1 pb-1">
                        <v-spacer></v-spacer>
                        <v-btn size="small" color="error" variant="text" @click="store.removeProject(p.id)" icon="mdi-delete" density="compact"></v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-slide-y-transition>
                  <div v-if="!store.portfolio.projects.length" class="text-center py-4 text-grey">
                    <v-icon icon="mdi-folder-open-outline" size="large" class="mb-2"></v-icon>
                    <div class="text-body-2">No projects yet</div>
                  </div>
                </v-card-text>
              </v-card>

              <!-- Skills Card -->
              <v-card class="mb-3" rounded="xl" elevation="0" border>
                <v-card-item>
                  <template v-slot:prepend>
                    <v-avatar color="green" variant="tonal" size="40">
                      <v-icon icon="mdi-cog-outline"></v-icon>
                    </v-avatar>
                  </template>
                  <v-card-title class="text-body-1 font-weight-bold pa-0">
                    {{ $t('editor.skills') }}
                  </v-card-title>
                  <template v-slot:append>
                    <v-btn size="small" color="primary" variant="tonal" @click="addSkill" rounded="lg">
                      <v-icon icon="mdi-plus" size="small"></v-icon>
                    </v-btn>
                  </template>
                </v-card-item>
                <v-card-text class="pt-2">
                  <v-chip-group>
                    <v-chip 
                      v-for="s in store.portfolio.skills" 
                      :key="s.name" 
                      closable 
                      @click:close="store.removeSkill(s.name)"
                      variant="tonal"
                      color="primary"
                      rounded="lg"
                    >
                      {{ s.name }}
                    </v-chip>
                  </v-chip-group>
                  <div v-if="!store.portfolio.skills.length" class="text-center py-4 text-grey">
                    <v-icon icon="mdi-star-outline" size="large" class="mb-2"></v-icon>
                    <div class="text-body-2">No skills yet</div>
                  </div>
                </v-card-text>
              </v-card>
            </div>
          </v-col>

          <!-- Preview -->
          <v-col cols="12" md="8" lg="9">
            <div class="pa-3" style="height: calc(100vh - 64px); overflow-y: auto;">
              <v-card rounded="xl" elevation="8" class="preview-card overflow-hidden">
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
    <v-dialog v-model="showTemplates" max-width="700" scrim="black">
      <v-card rounded="xl" elevation="24">
        <v-card-title class="text-h5 font-weight-bold pa-5 pb-2">
          {{ $t('templates.choose') }}
        </v-card-title>
        <v-card-text class="px-5 pb-5">
          <v-row>
            <v-col v-for="t in templates" :key="t.id" cols="6" md="4">
              <v-card 
                @click="selectTemplate(t.id)" 
                :class="['template-card', { 'selected': store.portfolio.template === t.id }]"
                rounded="lg" 
                elevation="0"
                border
                class="pa-2 cursor-pointer transition-swing"
                hover
              >
                <v-img 
                  :class="['template-preview', t.previewClass]" 
                  height="100" 
                  cover
                  class="rounded-lg mb-2"
                >
                  <div class="d-flex align-center justify-center h-full">
                    <v-icon :icon="t.icon" size="32" color="white" style="opacity: 0.7;"></v-icon>
                  </div>
                </v-img>
                <div class="text-center text-body-2 font-weight-medium">{{ $t(`templates.${t.id}`) }}</div>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="pa-5 pt-0">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="showTemplates = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar for notifications -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.text }}
    </v-snackbar>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
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

const snackbar = reactive({
  show: false,
  text: '',
  color: 'success'
})

const templates = [
  { id: 'minimal', previewClass: 'bg-gradient-to-br from-gray-700 to-gray-900', icon: 'mdi-text-box-outline' },
  { id: 'creative', previewClass: 'bg-gradient-to-br from-purple-500 to-pink-500', icon: 'mdi-palette' },
  { id: 'professional', previewClass: 'bg-gradient-to-br from-blue-grey-700 to-blue-grey-900', icon: 'mdi-domain' },
  { id: 'developer', previewClass: 'bg-gradient-to-br from-green-800 to-green-950', icon: 'mdi-code-tags' },
  { id: 'designer', previewClass: 'bg-gradient-to-br from-amber-400 to-orange-500', icon: 'mdi-brush' }
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
  initProjects()
})

const initProjects = () => {
  store.portfolio.projects.forEach(p => {
    if (!(p as any).tagsStr) {
      (p as any).tagsStr = p.tags.join(', ')
    }
  })
}

const handleSave = () => {
  store.saveToLocalStorage()
}

const selectTemplate = (id: string) => {
  store.setTemplate(id)
  showTemplates.value = false
  showSnackbar('Template changed!')
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
  showSnackbar('Project added!')
}

const addSkill = () => {
  const n = prompt('Skill name:')
  if (n) {
    store.addSkill({ name: n, level: 80, category: 'frontend' })
    showSnackbar('Skill added!')
  }
}

const showSnackbar = (text: string, color: string = 'success') => {
  snackbar.text = text
  snackbar.color = color
  snackbar.show = true
}

const handleExportJSON = () => {
  const data = { ...store.portfolio }
  delete (data as any).projects
  const projects = store.portfolio.projects.map(p => {
    const { tagsStr, ...rest } = p as any
    return rest
  })
  const exportData = { ...data, projects }
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'portfolio.json'; a.click()
  showSnackbar('JSON exported!')
}

const handleExportPDF = async () => {
  try {
    // Get the preview card content
    const previewCard = document.querySelector('.preview-card') as HTMLElement
    if (!previewCard) {
      showSnackbar('No preview content found', 'error')
      return
    }
    
    // Clone the content to avoid modifying the original
    const content = previewCard.cloneNode(true) as HTMLElement
    content.style.width = 'A4'
    content.style.maxWidth = '210mm'
    content.style.margin = '0'
    content.style.padding = '20mm'
    
    const html2pdf = (await import('html2pdf.js')).default
    const opt = {
      margin: 10,
      filename: 'portfolio.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }
    
    await html2pdf().set(opt).from(content).save()
    showSnackbar('PDF exported!')
  } catch (error) {
    console.error('PDF export error:', error)
    showSnackbar('PDF export failed: ' + (error as Error).message, 'error')
  }
}
</script>

<style scoped>
.portfolio-app {
  font-family: 'Inter', 'Noto Sans SC', system-ui, sans-serif !important;
}

.editor-sidebar {
  max-height: calc(100vh - 64px);
  overflow-y: auto;
  background: rgb(var(--v-theme-grey-lighten-5));
}

.template-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.template-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
}
.template-card.selected {
  border-color: rgb(var(--v-theme-primary)) !important;
  box-shadow: 0 0 0 3px rgba(var(--v-theme-primary), 0.2), 0 8px 25px rgba(0,0,0,0.15) !important;
}
.template-card.selected .template-preview {
  box-shadow: inset 0 0 0 3px rgb(var(--v-theme-primary));
}

.preview-card {
  overflow: hidden;
  border-radius: 16px;
}

.transition-swing {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Smooth scrollbar */
.editor-sidebar::-webkit-scrollbar {
  width: 6px;
}
.editor-sidebar::-webkit-scrollbar-track {
  background: transparent;
}
.editor-sidebar::-webkit-scrollbar-thumb {
  background: rgba(0,0,0,0.15);
  border-radius: 3px;
}
.editor-sidebar::-webkit-scrollbar-thumb:hover {
  background: rgba(0,0,0,0.25);
}
</style>
