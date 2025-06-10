import { useState } from 'react'
import { Upload, Settings, BarChart3, Music, Play, Download, Copy, CheckCircle } from 'lucide-react'

function App() {
  const [activeTab, setActiveTab] = useState('upload')
  const [file, setFile] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState('')
  const [demoMode, setDemoMode] = useState(false)

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0]
    if (uploadedFile) {
      setFile(uploadedFile)
      setActiveTab('process')
    }
  }

  const handleDragOver = (event) => {
    event.preventDefault()
  }

  const handleDrop = (event) => {
    event.preventDefault()
    const droppedFile = event.dataTransfer.files[0]
    if (droppedFile) {
      setFile(droppedFile)
      setActiveTab('process')
    }
  }

  const startDemo = () => {
    setDemoMode(true)
    setFile({ name: 'demo-song.mp3', size: 4567890 })
    setActiveTab('process')
  }

  const resetApp = () => {
    setDemoMode(false)
    setFile(null)
    setIsProcessing(false)
    setIsComplete(false)
    setProgress(0)
    setCurrentStep('')
    setActiveTab('upload')
  }

  const startTranscription = () => {
    setIsProcessing(true)
    setActiveTab('results')
    setProgress(0)
    setCurrentStep('Preparing audio file...')

    // Simulate processing steps
    const steps = [
      { step: 'Preparing audio file...', duration: 1000 },
      { step: 'Isolating vocals from music...', duration: 2000 },
      { step: 'Running AI transcription...', duration: 3000 },
      { step: 'Processing results...', duration: 1000 },
      { step: 'Finalizing transcription...', duration: 500 }
    ]

    let currentProgress = 0
    steps.forEach((stepInfo, index) => {
      setTimeout(() => {
        setCurrentStep(stepInfo.step)
        setProgress((index + 1) * 20)
        
        if (index === steps.length - 1) {
          setTimeout(() => {
            setIsProcessing(false)
            setIsComplete(true)
            setCurrentStep('Transcription complete!')
          }, stepInfo.duration)
        }
      }, currentProgress)
      currentProgress += stepInfo.duration
    })
  }

  const copyToClipboard = () => {
    const lyrics = document.getElementById('lyrics-text').value
    navigator.clipboard.writeText(lyrics)
    alert('Lyrics copied to clipboard!')
  }

  const downloadLyrics = () => {
    const lyrics = document.getElementById('lyrics-text').value
    const blob = new Blob([lyrics], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'transcribed-lyrics.txt'
    a.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-2xl mr-4">
              <Music className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI Lyrics Transcription Tool
            </h1>
          </div>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Transform your music into text with our advanced AI-powered transcription tool. 
            Upload any audio file and get accurate lyrics with timestamps.
          </p>
          <div className="mt-6 flex gap-4 justify-center">
            <button
              onClick={startDemo}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              Try Demo
            </button>
            {demoMode && (
              <button
                onClick={resetApp}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {demoMode && (
          <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4 mb-6 flex items-center gap-3">
            <div className="text-blue-400">ℹ️</div>
            <p className="text-blue-200">
              Demo mode active - This is a simulated transcription to showcase the interface. 
              Connect to a real backend API for actual audio processing.
            </p>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-800/50 p-1 rounded-lg flex gap-1">
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-6 py-3 rounded-md font-medium transition-all flex items-center gap-2 ${
                activeTab === 'upload'
                  ? 'bg-orange-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <Upload className="h-4 w-4" />
              Upload
              <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">1</span>
            </button>
            <button
              onClick={() => file && setActiveTab('process')}
              className={`px-6 py-3 rounded-md font-medium transition-all flex items-center gap-2 ${
                activeTab === 'process'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : file
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                  : 'text-gray-500 cursor-not-allowed'
              }`}
              disabled={!file}
            >
              <Settings className="h-4 w-4" />
              Process
              <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">2</span>
            </button>
            <button
              onClick={() => (isComplete || isProcessing) && setActiveTab('results')}
              className={`px-6 py-3 rounded-md font-medium transition-all flex items-center gap-2 ${
                activeTab === 'results'
                  ? 'bg-teal-600 text-white shadow-lg'
                  : isComplete || isProcessing
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                  : 'text-gray-500 cursor-not-allowed'
              }`}
              disabled={!isComplete && !isProcessing}
            >
              <BarChart3 className="h-4 w-4" />
              Results
              <span className="bg-teal-500 text-white text-xs px-2 py-1 rounded-full">3</span>
            </button>
          </div>
        </div>

        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Upload className="h-6 w-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">Upload Audio File</h2>
              </div>
              <p className="text-gray-300 mb-6">
                Select an audio file to transcribe. Supported formats: MP3, WAV, FLAC, M4A, OGG (max 500MB)
              </p>
              
              <div
                className="border-2 border-dashed border-gray-600 rounded-lg p-12 text-center hover:border-blue-500 transition-colors cursor-pointer"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-input').click()}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-xl text-gray-300 mb-2">Drop your audio file here</p>
                <p className="text-gray-500">or click to browse</p>
                <input
                  id="file-input"
                  type="file"
                  accept=".mp3,.wav,.flac,.m4a,.ogg"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>
          </div>
        )}

        {/* Process Tab */}
        {activeTab === 'process' && file && (
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Settings */}
              <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Settings className="h-6 w-6 text-purple-400" />
                  <h2 className="text-xl font-bold text-white">Transcription Settings</h2>
                </div>
                <p className="text-gray-300 mb-6">Configure the transcription parameters for optimal results</p>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-purple-300 mb-2">Language</label>
                    <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white">
                      <option>Auto-detect</option>
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-orange-300 mb-2">Model Size</label>
                    <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white">
                      <option>Turbo (Fast, Good Quality)</option>
                      <option>Large (Slower, Best Quality)</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <input type="checkbox" id="vocal-isolation" defaultChecked className="rounded" />
                    <label htmlFor="vocal-isolation" className="text-sm text-gray-300">
                      Use vocal isolation (recommended for music)
                    </label>
                  </div>
                </div>
                
                <button
                  onClick={startTranscription}
                  disabled={isProcessing}
                  className="w-full mt-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      Start Transcription
                    </>
                  )}
                </button>
              </div>

              {/* File Info */}
              <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Music className="h-6 w-6 text-teal-400" />
                  <h2 className="text-xl font-bold text-white">File Information</h2>
                </div>
                <p className="text-gray-300 mb-6">Details about your uploaded audio file</p>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Filename:</span>
                    <span className="text-white">{file.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Size:</span>
                    <span className="text-white">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Duration:</span>
                    <span className="text-white">3:15</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Format:</span>
                    <span className="text-white">MP3</span>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-blue-900/30 border border-blue-500/30 rounded-lg">
                  <p className="text-blue-200 text-sm">
                    Expected processing time: ~20 seconds
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Tab */}
        {activeTab === 'results' && (isProcessing || isComplete) && (
          <div className="max-w-4xl mx-auto">
            {isProcessing && (
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-3 bg-gray-800/50 px-6 py-3 rounded-lg">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-400 border-t-transparent"></div>
                  <span className="text-blue-200">{currentStep}</span>
                </div>
                <div className="mt-4 max-w-md mx-auto">
                  <div className="bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-gray-400 text-sm mt-2">{progress}% complete</p>
                </div>
              </div>
            )}

            {isComplete && (
              <>
                <div className="bg-green-900/30 border border-green-500/30 rounded-xl p-6 mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle className="h-6 w-6 text-green-400" />
                    <h2 className="text-xl font-bold text-white">Transcription Complete</h2>
                  </div>
                  <p className="text-green-200">Your audio has been successfully transcribed</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">87%</div>
                      <div className="text-gray-400 text-sm">Confidence</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">12.3s</div>
                      <div className="text-gray-400 text-sm">Processing Time</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-teal-400">EN</div>
                      <div className="text-gray-400 text-sm">Language</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-400">142</div>
                      <div className="text-gray-400 text-sm">Words</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <BarChart3 className="h-6 w-6 text-teal-400" />
                      <h2 className="text-xl font-bold text-white">Transcribed Lyrics</h2>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={copyToClipboard}
                        className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                      >
                        <Copy className="h-4 w-4" />
                        Copy
                      </button>
                      <button
                        onClick={downloadLyrics}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </button>
                    </div>
                  </div>
                  
                  <textarea
                    id="lyrics-text"
                    className="w-full h-64 bg-gray-700 border border-gray-600 rounded-lg p-4 text-white font-mono text-sm resize-none"
                    defaultValue={`[Verse 1]
Looking at the world through rose-colored glasses
Everything seems brighter when the sunlight passes
Through the window of my soul, I can see
All the beauty that surrounds you and me

[Chorus]
We're dancing in the moonlight, singing our song
Nothing can go wrong when we're together strong
The melody carries us away tonight
Everything's gonna be alright

[Verse 2]
Stars are shining down upon our faces
Love is found in all the quiet places
When the music starts to play, we come alive
In this moment, we will always thrive

[Bridge]
Time stands still when we're together
Hearts beating like they'll last forever
In this dance of life we share
Nothing else can compare

[Outro]
As the night fades into morning light
We'll remember this magical night
Forever in our hearts it will stay
This perfect moment, this perfect day`}
                    readOnly
                  />
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default App