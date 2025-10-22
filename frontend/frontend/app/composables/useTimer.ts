import { ref, computed, onUnmounted } from "vue"
import { io } from "socket.io-client"

export const useTimer = (initialTime: number, key:string) => {
  const timeLeft = ref(initialTime)
  const timer = ref<NodeJS.Timeout | null>(null)
  const alarmAudio = ref<HTMLAudioElement | null>(null)
  const socket = io("http://localhost:3000")

  //socket.on("connect", () => console.log("Connected to backend"))

  onMounted(() => {
    const saved = localStorage.getItem(`timer-${key}`)
    if (saved) {
      timeLeft.value = Number(saved)
      socket.emit("update-timer", { key, timeLeft: Number(saved) })
    }
  })

  const formatted = computed(() => {
    const m = Math.floor(timeLeft.value / 60)
    const s = String(timeLeft.value % 60).padStart(2, "0")
    return `${m}:${s}`
  })

  const playAlarm = () => {
    if (!alarmAudio.value) {
      alarmAudio.value = new Audio("/sounds/alarm.mp3")
    }
    alarmAudio.value.currentTime = 0
    alarmAudio.value.volume = 0.7
    alarmAudio.value.play().catch(() => {})
    setTimeout(() => {
      alarmAudio.value?.pause()
      if (alarmAudio.value) alarmAudio.value.currentTime = 0
    }, 3000) // stop after 3 seconds
  }

  const start = () => {
    if (timer.value) return
    timer.value = setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--
        localStorage.setItem(`timer-${key}`, timeLeft.value.toString())
        socket.emit("update-timer", { key, timeLeft: timeLeft.value })
      } else {
        stop()
        playAlarm()
        localStorage.removeItem(`timer-${key}`)
        socket.emit("delete-timer", key)
      }
    }, 1000)
  }

  const stop = () => {
    if (timer.value) {
      clearInterval(timer.value)
      timer.value = null
    }
  }

  const restart = () => {
    localStorage.removeItem(`timer-${key}`)
    timeLeft.value = initialTime
    //start()
  }

  onUnmounted(() => {
    stop()
    if (alarmAudio.value) {
      alarmAudio.value.pause()
      alarmAudio.value.currentTime = 0
    }
  })

  return { timeLeft, formatted, start, stop, restart }
}