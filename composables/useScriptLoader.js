export function useScriptLoader() {
  const loadScript = (src) => {
    const script = document.createElement('script')
    script.src = src
    document.body.appendChild(script)
  }

  return {
    loadScript,
  }
}
