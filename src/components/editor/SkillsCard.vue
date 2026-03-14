<template>
  <v-card class="mb-3">
    <v-card-item>
      <template v-slot:prepend>
        <v-avatar color="green" variant="tonal" size="40">
          <v-icon icon="mdi-cog-outline" />
        </v-avatar>
      </template>
      <v-card-title class="text-body-1 font-weight-bold pa-0">{{ $t('editor.skills') }}</v-card-title>
      <template v-slot:append>
        <v-btn size="small" color="primary" variant="tonal" rounded="lg" @click="$emit('open-add-skill')">
          <v-icon icon="mdi-plus" size="small" />
        </v-btn>
      </template>
    </v-card-item>
    <v-card-text class="pt-2">
      <v-chip-group>
        <v-chip
          v-for="s in store.portfolio.skills"
          :key="s.name"
          closable
          variant="tonal"
          color="primary"
          rounded="lg"
          @click:close="store.removeSkill(s.name)"
        >
          {{ s.name }}
        </v-chip>
      </v-chip-group>
      <div v-if="!store.portfolio.skills.length" class="text-center py-4 text-grey">
        <v-icon icon="mdi-star-outline" size="large" class="mb-2" />
        <div class="text-body-2">No skills yet</div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { usePortfolioStore } from '../../stores/portfolio'

defineEmits<{ 'open-add-skill': [] }>()
const store = usePortfolioStore()
</script>
