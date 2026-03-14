import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import App from './App.vue'
import './style.css'

// i18n messages
const messages = {
  en: {
    app: { title: 'Portfolio Builder', templates: 'Templates', export: 'Export', pdf: 'PDF' },
    editor: { basicInfo: 'Basic Info', name: 'Name', title: 'Title', bio: 'Bio', location: 'Location', email: 'Email',
      projects: 'Projects', addProject: 'Add Project', experience: 'Experience', addExperience: 'Add Experience',
      skills: 'Skills', addSkill: 'Add Skill', skillName: 'Skill name' },
    templates: { choose: 'Choose Template', minimal: 'Minimal', creative: 'Creative', professional: 'Professional', developer: 'Developer', designer: 'Designer' },
    preview: { projects: 'Projects', experience: 'Experience', skills: 'Skills', contact: 'Contact', getInTouch: 'Get In Touch', contactMe: 'Contact Me' }
  },
  zh: {
    app: { title: '作品集生成器', templates: '模板', export: '導出', pdf: 'PDF' },
    editor: { basicInfo: '基本信息', name: '姓名', title: '職位', bio: '簡介', location: '地點', email: '郵箱',
      projects: '項目', addProject: '添加項目', experience: '經驗', addExperience: '添加經驗',
      skills: '技能', addSkill: '添加技能', skillName: '技能名稱' },
    templates: { choose: '選擇模板', minimal: '簡約', creative: '創意', professional: '專業', developer: '開發者', designer: '設計師' },
    preview: { projects: '項目', experience: '經驗', skills: '技能', contact: '聯繫', getInTouch: '聯繫我', contactMe: '聯繫我' }
  }
}

const i18n = createI18n({ legacy: false, locale: 'en', fallbackLocale: 'en', messages })

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'modern',
    themes: {
      modern: {
        dark: false,
        colors: {
          primary: '#6366f1',
          'primary-darken-1': '#4f46e5',
          secondary: '#64748b',
          surface: '#ffffff',
          background: '#f8fafc',
          'surface-bright': '#f1f5f9',
          'surface-variant': '#f1f5f9',
          error: '#ef4444',
          warning: '#f59e0b',
          success: '#22c55e',
          info: '#3b82f6',
          'on-primary': '#ffffff',
          'on-surface': '#0f172a',
          'on-surface-variant': '#475569',
          outline: '#e2e8f0',
          'outline-variant': '#cbd5e1',
        },
      },
    },
  },
  defaults: {
    VCard: {
      elevation: 0,
      rounded: 'xl',
      border: true,
    },
    VBtn: {
      rounded: 'lg',
    },
    VChip: {
      rounded: 'lg',
    },
  },
  icons: { defaultSet: 'mdi' },
})

const app = createApp(App)
app.use(createPinia())
app.use(vuetify)
app.use(i18n)
app.mount('#app')
