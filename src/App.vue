<template>
  <v-app class="portfolio-app">
    <AppBar
      @open-templates="showTemplates = true"
      @export-json="handleExportJSON"
      @export-pdf="exportPdf"
    />

    <v-main>
      <v-container fluid class="pa-0">
        <v-row no-gutters class="fill-height">
          <EditorSidebar
            @project-added="showSnackbar('Project added!')"
            @open-add-skill="showSkillDialog = true"
          />
          <PreviewPanel />
        </v-row>
      </v-container>
    </v-main>

    <TemplateDialog
      v-model="showTemplates"
      @selected="showSnackbar('Template changed!')"
    />

    <SkillDialog
      v-model="showSkillDialog"
      @added="showSnackbar('Skill added!')"
    />

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.text }}
    </v-snackbar>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AppBar from './components/AppBar.vue'
import EditorSidebar from './components/editor/EditorSidebar.vue'
import PreviewPanel from './components/PreviewPanel.vue'
import TemplateDialog from './components/TemplateDialog.vue'
import SkillDialog from './components/SkillDialog.vue'
import { useSnackbar } from './composables/useSnackbar'
import { usePdfExport } from './composables/usePdfExport'
import { usePortfolioStore } from './stores/portfolio'

const store = usePortfolioStore()
const { snackbar, showSnackbar } = useSnackbar()
const { exportPdf } = usePdfExport(store, showSnackbar)

const showTemplates = ref(false)
const showSkillDialog = ref(false)

onMounted(() => {
  store.loadFromLocalStorage()
  initProjects()
})

function initProjects() {
  store.portfolio.projects.forEach((p: any) => {
    if (p.tagsStr === undefined) p.tagsStr = p.tags.join(', ')
  })
}

function handleExportJSON() {
  const data = { ...store.portfolio }
  delete (data as any).projects
  const projects = store.portfolio.projects.map((p: any) => {
    const { tagsStr, ...rest } = p
    return rest
  })
  const exportData = { ...data, projects }
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'portfolio.json'
  a.click()
  showSnackbar('JSON exported!')
}
</script>

<style scoped>
.portfolio-app {
  font-family: 'Inter', 'Noto Sans SC', system-ui, sans-serif !important;
}

:deep(.editor-sidebar) {
  max-height: calc(100vh - 64px);
  overflow-y: auto;
  background: #f0f0f0;
}

:deep(.template-card) {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

:deep(.template-card:hover) {
  transform: translateY(-6px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
}

:deep(.template-card.selected) {
  border-color: rgb(var(--v-theme-primary)) !important;
  box-shadow: 0 0 0 3px rgba(var(--v-theme-primary), 0.2), 0 8px 25px rgba(0, 0, 0, 0.15) !important;
}

:deep(.template-card.selected .template-preview) {
  box-shadow: inset 0 0 0 3px rgb(var(--v-theme-primary));
}

:deep(.preview-card) {
  overflow: hidden;
  border-radius: 16px;
}

:deep(.editor-sidebar)::-webkit-scrollbar {
  width: 6px;
}

:deep(.editor-sidebar)::-webkit-scrollbar-track {
  background: transparent;
}

:deep(.editor-sidebar)::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.15);
  border-radius: 3px;
}

:deep(.editor-sidebar)::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.25);
}
</style>
