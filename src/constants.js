export const ALL_THEMES = [
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "cmyk",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter",
  "dim",
  "nord",
  "sunset",
]

const TOAST_OPTIONS = {
  toast: true,
  showConfirmButton: false,
  position: 'bottom-right',
  timer: 5500,
  timerProgressBar: true,
}

export const TOAST_OPTIONS_SUCCESS = {
  ...TOAST_OPTIONS,
  icon: "success",
  customClass: {
    timerProgressBar: 'bg-green-500'
  }
}

export const TOAST_OPTIONS_ERROR = {
  ...TOAST_OPTIONS,
  icon: "error",
  customClass: {
    timerProgressBar: 'bg-red-400'
  }
}

export const DEFAULT_THEME = "light"

export const DOCKER_TERMINAL = "docker_terminal"

export const DOCKER_SERVICE_PING_INTERVAL = 30000