<template>
  <v-dialog :model-value="modelValue" max-width="400" persistent
    @update:model-value="$emit('update:modelValue', $event)">
    <v-card>
      <v-card-title class="text-h6">{{ $t('editor.addSkill') }}</v-card-title>
      <v-card-text>
        <v-text-field v-model="skillName" :label="$t('editor.skillName')" variant="outlined" autofocus clearable
          @keydown.enter="confirm" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="$emit('update:modelValue', false)">Cancel</v-btn>
        <v-btn color="primary" variant="tonal" :disabled="!skillName?.trim()" @click="confirm">
          Add
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { usePortfolioStore } from '../stores/portfolio'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean]; added: [name: string] }>()

const store = usePortfolioStore()
const skillName = ref('')

watch(() => props.modelValue, (open) => {
  if (open) skillName.value = ''
})

function confirm() {
  const name = skillName.value?.trim()
  if (name) {
    store.addSkill({ name, level: 80, category: 'frontend' })
    emit('update:modelValue', false)
    emit('added', name)
    skillName.value = ''
  }
}
</script>
