import type { Component } from 'vue'
import MinimalTemplate from '../components/Preview/templates/MinimalTemplate.vue'
import CreativeTemplate from '../components/Preview/templates/CreativeTemplate.vue'
import ProfessionalTemplate from '../components/Preview/templates/ProfessionalTemplate.vue'
import DeveloperTemplate from '../components/Preview/templates/DeveloperTemplate.vue'
import DesignerTemplate from '../components/Preview/templates/DesignerTemplate.vue'

export interface TemplateOption {
  id: string
  previewStyle: Record<string, string>
  icon: string
}

export const TEMPLATE_OPTIONS: TemplateOption[] = [
  { id: 'minimal', previewStyle: { background: 'linear-gradient(to bottom right, #374151, #111827)' }, icon: 'mdi-text-box-outline' },
  { id: 'creative', previewStyle: { background: 'linear-gradient(to bottom right, #a855f7, #ec4899)' }, icon: 'mdi-palette' },
  { id: 'professional', previewStyle: { background: 'linear-gradient(to bottom right, #455a64, #263238)' }, icon: 'mdi-domain' },
  { id: 'developer', previewStyle: { background: 'linear-gradient(to bottom right, #166534, #052e16)' }, icon: 'mdi-code-tags' },
  { id: 'designer', previewStyle: { background: 'linear-gradient(to bottom right, #fbbf24, #f97316)' }, icon: 'mdi-brush' }
]

export const TEMPLATE_COMPONENTS: Record<string, Component> = {
  minimal: MinimalTemplate,
  creative: CreativeTemplate,
  professional: ProfessionalTemplate,
  developer: DeveloperTemplate,
  designer: DesignerTemplate
}
