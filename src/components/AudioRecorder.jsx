import { useRef, useState } from 'react'

/**
 * A small recorder control. Calls onRecordingComplete(blob) once the
 * person stops recording. Records in webm/opus where supported, which
 * every modern browser (including mobile Safari 14.5+/Chrome/Firefox) can play back.
 */
export default function AudioRecorder({ onRecordingComplete, onClear }) {
  const [status, setStatus] = useState('idle') // idle | recording | recorded | error
  const [previewUrl, setPreviewUrl] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])
  const streamRef = useRef(null)

  async function startRecording() {
    setErrorMsg('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      chunksRef.current = []

      const recorder = new MediaRecorder(stream)
      mediaRecorderRef.current = recorder

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const url = URL.createObjectURL(blob)
        setPreviewUrl(url)
        setStatus('recorded')
        onRecordingComplete(blob)
        streamRef.current?.getTracks().forEach((t) => t.stop())
      }

      recorder.start()
      setStatus('recording')
    } catch (err) {
      setStatus('error')
      setErrorMsg(
        'Could not access the microphone. Check your browser allows microphone access for this site.'
      )
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop()
  }

  function clearRecording() {
    setPreviewUrl(null)
    setStatus('idle')
    onClear?.()
  }

  return (
    <div className="audio-recorder">
      {status === 'idle' && (
        <button type="button" className="audio-btn audio-btn--record" onClick={startRecording}>
          🎙 Record pronunciation
        </button>
      )}

      {status === 'recording' && (
        <button type="button" className="audio-btn audio-btn--stop" onClick={stopRecording}>
          ● Recording… tap to stop
        </button>
      )}

      {status === 'recorded' && previewUrl && (
        <div className="audio-preview">
          <audio controls src={previewUrl} />
          <button type="button" className="audio-btn audio-btn--clear" onClick={clearRecording}>
            Re-record
          </button>
        </div>
      )}

      {status === 'error' && <p className="audio-error">{errorMsg}</p>}
    </div>
  )
}
