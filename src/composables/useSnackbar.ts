import { reactive } from 'vue'

export function useSnackbar() {
  const snackbar = reactive({
    show: false,
    text: '',
    color: 'success'
  })

  const showSnackbar = (text: string, color: string = 'success') => {
    snackbar.text = text
    snackbar.color = color
    snackbar.show = true
  }

  return { snackbar, showSnackbar }
}
