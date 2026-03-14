<template>
  <v-col cols="12" md="4" lg="3" class="editor-sidebar">
    <div class="pa-3 pb-6">
      <BasicInfoCard />
      <ProjectsCard @added="onProjectAdded" />
      <SkillsCard @open-add-skill="$emit('open-add-skill')" />
    </div>
  </v-col>
</template>

<script setup lang="ts">
import BasicInfoCard from './BasicInfoCard.vue'
import ProjectsCard from './ProjectsCard.vue'
import SkillsCard from './SkillsCard.vue'

const emit = defineEmits<{ 'open-add-skill': []; 'project-added': [] }>()

function onProjectAdded() {
  emit('project-added')
}
</script>
