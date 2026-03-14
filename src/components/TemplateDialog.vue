<template>
  <v-dialog :model-value="modelValue" max-width="700" scrim="black"
    @update:model-value="$emit('update:modelValue', $event)">
    <v-card>
      <v-card-title class="text-h5 font-weight-bold pa-5 pb-2">
        {{ $t('templates.choose') }}
      </v-card-title>
      <v-card-text class="px-5 pb-5">
        <v-row>
          <v-col v-for="t in templates" :key="t.id" cols="6" md="4">
            <v-card :class="['template-card', { selected: currentTemplateId === t.id }]" class="pa-3 cursor-pointer"
              hover @click="onSelect(t.id)">
              <v-img :style="t.previewStyle" height="100" cover class="rounded-lg mb-2">
                <div class="d-flex align-center justify-center h-full">
                  <v-icon :icon="t.icon" size="32" color="white" style="opacity: 0.7" />
                </div>
              </v-img>
              <div class="text-center text-body-2 font-weight-medium">{{ $t(`templates.${t.id}`) }}</div>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="pa-5 pt-0">
        <v-spacer />
        <v-btn variant="text" @click="$emit('update:modelValue', false)">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePortfolioStore } from '../stores/portfolio'
import { TEMPLATE_OPTIONS } from '../config/templates'

defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean]; selected: [id: string] }>()

const store = usePortfolioStore()
const templates = TEMPLATE_OPTIONS
const currentTemplateId = computed(() => store.portfolio.template)

function onSelect(id: string) {
  store.setTemplate(id)
  emit('update:modelValue', false)
  emit('selected', id)
}
</script>
