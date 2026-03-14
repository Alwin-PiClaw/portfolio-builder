<template>
  <v-card class="mb-3">
    <v-card-item class="py-2">
      <template v-slot:prepend>
        <v-avatar color="amber" variant="tonal" size="40">
          <v-icon icon="mdi-briefcase-outline" />
        </v-avatar>
      </template>
      <v-card-title class="text-body-2 font-weight-bold pa-0">{{ $t('editor.projects') }}</v-card-title>
      <template v-slot:append>
        <v-btn color="primary" variant="tonal" size="small" @click="onAddProject">
          <v-icon icon="mdi-plus" />
        </v-btn>
      </template>
    </v-card-item>
    <v-card-text class="d-flex flex-column ga-3">
      <v-slide-y-transition group>
        <v-card v-for="(p, idx) in store.portfolio.projects" :key="p.id" variant="outlined" class="mb-2" rounded="lg"
          elevation="0">
          <v-card-text class="d-flex flex-column ga-3">
            <v-text-field v-model="p.title" label="Project Title" variant="outlined" density="default" hide-details
              class="mb-1" @update:model-value="() => saveProject(idx)" />
            <v-textarea v-model="p.description" label="Description" variant="outlined" density="default" hide-details
              rows="2" class="mb-1" @update:model-value="() => saveProject(idx)" />
            <v-text-field v-model="(p as any).link" label="Project URL" variant="outlined" density="default"
              hide-details class="mb-1" @update:model-value="() => saveProject(idx)" />
            <v-text-field v-model="(p as any).tagsStr" label="Tags (comma separated)" variant="outlined"
              density="default" hide-details @update:model-value="() => saveProject(idx)" />
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-spacer />
            <v-btn size="small" color="error" variant="text" icon="mdi-delete" @click="store.removeProject(p.id)" />
          </v-card-actions>
        </v-card>
      </v-slide-y-transition>
      <div v-if="!store.portfolio.projects.length" class="text-center py-3">
        <v-icon icon="mdi-folder-open-outline" />
        <div class="text-body-2">No projects yet</div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { usePortfolioStore } from '../../stores/portfolio'

const store = usePortfolioStore()

function saveProject(idx: number) {
  const p = store.portfolio.projects[idx]
  if ((p as any).tagsStr !== undefined) {
    p.tags = (p as any).tagsStr.split(',').map((t: string) => t.trim()).filter(Boolean)
  }
  store.saveToLocalStorage()
}

function onAddProject() {
  store.addProject({
    id: Date.now().toString(),
    title: '',
    description: '',
    tags: [],
    link: '',
    tagsStr: ''
  } as any)
  emit('added')
}

const emit = defineEmits<{ added: [] }>()
</script>
