const SAVE_KEY = 'fashion_idle_save'

export function saveGame(data: any) {
  localStorage.setItem(SAVE_KEY, JSON.stringify(data))
}

export function loadGame() {
  const data = localStorage.getItem(SAVE_KEY)
  return data ? JSON.parse(data) : null
}