import { useRef, useState } from 'react'

const CANDIDATE_MIME_TYPES = [
  'audio/webm;codecs=opus',
  'audio/webm',
  'audio/mp4',
  'audio/aac',
]

function pickSupportedMimeType() {
  if (typeof MediaRecorder === 'undefined' || !MediaRecorder.isTypeSupported) {
    return ''
  }
  return CANDIDATE_MIME_TYPES.find((type) => MediaRecorder.isTypeSupported(type)) || ''
}

export default function AudioRecorder({ onRecordingComplete, onClear }) {
  const [status, setStatus] = useState('idle')
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

      const mimeType = pickSupportedMimeType()
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream)
      mediaRecorderRef.current = recorder

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      recorder.onstop = () => {
        const actualType = recorder.mimeType || mimeType || 'audio/webm'
        const blob = new Blob(chunksRef.current, { type: actualType })
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
      setErrorMsg('Could not access the microphone. Check your browser allows microphone access for this site.')
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
