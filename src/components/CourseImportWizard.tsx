// 📁 BESTAND: /src/components/CourseImportWizard.tsx
'use client'

import { useState } from 'react'
import { Icons } from '@/components/Icons'

interface ImportedCourse {
  id: string
  title: string
  description: string
  lessons: Array<{
    id: string
    title: string
    duration: number
    type: string
    category: string
  }>
  source: 'SCORM' | 'Video' | 'Documenten' | 'ExternSysteem'
  totalDuration: number
  lessonCount: number
}

interface CourseImportWizardProps {
  isOpen: boolean
  onClose: () => void
  onImport: (courses: ImportedCourse[]) => void
}

type ImportStep = 'select-source' | 'upload' | 'review' | 'importing' | 'complete'

export default function CourseImportWizard({ isOpen, onClose, onImport }: CourseImportWizardProps) {
  const [currentStep, setCurrentStep] = useState<ImportStep>('select-source')
  const [selectedSource, setSelectedSource] = useState<'SCORM' | 'Video' | 'Documenten' | 'ExternSysteem' | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [importedCourses, setImportedCourses] = useState<ImportedCourse[]>([])
  const [selectedCourses, setSelectedCourses] = useState<string[]>([])
  const [importProgress, setImportProgress] = useState(0)
  const [importStatus, setImportStatus] = useState('')

  // Mock data voor geïmporteerde cursussen
  const mockImportedCourses: ImportedCourse[] = [
    {
      id: 'course-1',
      title: 'Cyber Security Fundamentals',
      description: 'Complete cursus over basis cyber security principes',
      lessons: [
        { id: 'l1', title: 'Inleiding Cyber Security', duration: 10, type: 'Video', category: 'Security Basics' },
        { id: 'l2', title: 'Wachtwoord Beveiliging', duration: 15, type: 'Interactief', category: 'Security Basics' },
        { id: 'l3', title: 'Phishing Herkenning', duration: 20, type: 'Quiz', category: 'Security Basics' },
      ],
      source: 'SCORM',
      totalDuration: 45,
      lessonCount: 3
    },
    {
      id: 'course-2',
      title: 'Advanced Threat Protection',
      description: 'Geavanceerde technieken voor bedreigingsdetectie',
      lessons: [
        { id: 'l4', title: 'Malware Analyse', duration: 25, type: 'Video', category: 'Advanced Security' },
        { id: 'l5', title: 'Network Security', duration: 30, type: 'Artikel', category: 'Technical Security' },
      ],
      source: 'Documenten',
      totalDuration: 55,
      lessonCount: 2
    }
  ]

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return
    
    const newFiles = Array.from(files)
    setUploadedFiles(prev => [...prev, ...newFiles])
    
    // Simuleer verwerking van bestanden
    setTimeout(() => {
      setImportedCourses(mockImportedCourses)
      setCurrentStep('review')
    }, 1500)
  }

  const handleSourceSelect = (source: 'SCORM' | 'Video' | 'Documenten' | 'ExternSysteem') => {
    setSelectedSource(source)
    setCurrentStep('upload')
  }

  const toggleCourseSelection = (courseId: string) => {
    setSelectedCourses(prev =>
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    )
  }

  const selectAllCourses = () => {
    setSelectedCourses(
      selectedCourses.length === importedCourses.length
        ? []
        : importedCourses.map(course => course.id)
    )
  }

  const handleImport = async () => {
    if (selectedCourses.length === 0) return
    
    setCurrentStep('importing')
    setImportProgress(0)
    setImportStatus('Voorbereiden...')

    // Simuleer import proces
    for (let i = 0; i <= 100; i += 10) {
      setImportProgress(i)
      
      if (i === 10) setImportStatus('Lessen verwerken...')
      if (i === 40) setImportStatus('Content extraheren...')
      if (i === 70) setImportStatus('Metadata toevoegen...')
      if (i === 90) setImportStatus('Voltooien...')
      
      await new Promise(resolve => setTimeout(resolve, 300))
    }

    // Importeer geselecteerde cursussen
    const coursesToImport = importedCourses.filter(course => 
      selectedCourses.includes(course.id)
    )
    
    onImport(coursesToImport)
    setCurrentStep('complete')
  }

  const resetWizard = () => {
    setCurrentStep('select-source')
    setSelectedSource(null)
    setUploadedFiles([])
    setImportedCourses([])
    setSelectedCourses([])
    setImportProgress(0)
    setImportStatus('')
  }

  const handleClose = () => {
    resetWizard()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Cursus Import Wizard</h2>
              <p className="text-gray-600 mt-1">
                {currentStep === 'select-source' && 'Selecteer bron type'}
                {currentStep === 'upload' && 'Upload bestanden'}
                {currentStep === 'review' && 'Bekijk en selecteer cursussen'}
                {currentStep === 'importing' && 'Importeren...'}
                {currentStep === 'complete' && 'Import voltooid'}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Icons.close className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mt-6">
            {['select-source', 'upload', 'review', 'importing', 'complete'].map((step, index) => (
              <div key={step} className="flex items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep === step
                      ? 'bg-blue-600 text-white'
                      : currentStep === 'complete' || 
                        ['select-source', 'upload', 'review', 'importing', 'complete']
                          .indexOf(currentStep) > index
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {currentStep === 'complete' || 
                   ['select-source', 'upload', 'review', 'importing', 'complete']
                     .indexOf(currentStep) > index ? (
                    <Icons.check className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < 4 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      ['upload', 'review', 'importing', 'complete'].indexOf(currentStep) > index
                        ? 'bg-green-600'
                        : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Step 1: Select Source */}
          {currentStep === 'select-source' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  type: 'SCORM' as const,
                  title: 'SCORM Package',
                  description: 'Importeer SCORM 1.2 of 2004 compliant packages',
                  icon: <Icons.package className="w-8 h-8" />,
                  formats: ['ZIP', 'SCORM']
                },
                {
                  type: 'Video' as const,
                  title: 'Video Bestanden',
                  description: 'Importeer video bestanden met ondersteuning voor metadata',
                  icon: <Icons.video className="w-8 h-8" />,
                  formats: ['MP4', 'MOV', 'AVI']
                },
                {
                  type: 'Documenten' as const,
                  title: 'Documenten',
                  description: 'Importeer PDF, PowerPoint en Word documenten',
                  icon: <Icons.document className="w-8 h-8" />,
                  formats: ['PDF', 'PPTX', 'DOCX']
                },
                {
                  type: 'ExternSysteem' as const,
                  title: 'Extern Systeem',
                  description: 'Importeer vanuit externe LMS of leerplatforms',
                  icon: <Icons.external className="w-8 h-8" />,
                  formats: ['API', 'CSV', 'LTI']
                }
              ].map((source) => (
                <button
                  key={source.type}
                  onClick={() => handleSourceSelect(source.type)}
                  className="p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
                >
                  <div className="flex items-start space-x-4">
                    <div className="text-blue-600">{source.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">{source.title}</h3>
                      <p className="text-gray-600 text-sm mb-3">{source.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {source.formats.map(format => (
                          <span
                            key={format}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                          >
                            {format}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Step 2: Upload */}
          {currentStep === 'upload' && (
            <div className="text-center">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 hover:border-blue-500 transition-colors">
                <Icons.upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Upload je {selectedSource === 'SCORM' ? 'SCORM package' : 
                            selectedSource === 'Video' ? 'video bestanden' :
                            selectedSource === 'Documenten' ? 'documenten' : 'bestanden'}
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Sleep bestanden hierheen of klik om te bladeren. Ondersteunde formaten: {
                    selectedSource === 'SCORM' ? 'ZIP, SCORM' :
                    selectedSource === 'Video' ? 'MP4, MOV, AVI' :
                    selectedSource === 'Documenten' ? 'PDF, PPTX, DOCX' : 'Verschillende formaten'
                  }
                </p>
                
                <input
                  type="file"
                  id="file-upload"
                  multiple
                  accept={
                    selectedSource === 'SCORM' ? '.zip,.scorm' :
                    selectedSource === 'Video' ? '.mp4,.mov,.avi' :
                    selectedSource === 'Documenten' ? '.pdf,.pptx,.docx' : '*'
                  }
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                />
                <label
                  htmlFor="file-upload"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium cursor-pointer inline-block"
                >
                  Bestanden Selecteren
                </label>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="mt-8 text-left">
                  <h4 className="font-medium text-gray-900 mb-4">Geüploade bestanden:</h4>
                  <div className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Icons.document className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-700">{file.name}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Review */}
          {currentStep === 'review' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Geïdentificeerde cursussen ({importedCourses.length})
                  </h3>
                  <p className="text-gray-600">
                    Selecteer de cursussen die je wilt importeren
                  </p>
                </div>
                <button
                  onClick={selectAllCourses}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  {selectedCourses.length === importedCourses.length ? 'Alles deselecteren' : 'Alles selecteren'}
                </button>
              </div>

              <div className="space-y-4">
                {importedCourses.map((course) => (
                  <div
                    key={course.id}
                    className={`border-2 rounded-xl p-6 transition-all cursor-pointer ${
                      selectedCourses.includes(course.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => toggleCourseSelection(course.id)}
                  >
                    <div className="flex items-start space-x-4">
                      <input
                        type="checkbox"
                        checked={selectedCourses.includes(course.id)}
                        onChange={() => toggleCourseSelection(course.id)}
                        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900">{course.title}</h4>
                            <p className="text-gray-600 text-sm mt-1">{course.description}</p>
                          </div>
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                            {course.source}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center space-x-2">
                            <Icons.lessons className="w-4 h-4" />
                            <span>{course.lessonCount} lessen</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Icons.clock className="w-4 h-4" />
                            <span>{course.totalDuration} minuten</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Icons.category className="w-4 h-4" />
                            <span>{course.lessons[0]?.category || 'Algemeen'}</span>
                          </div>
                        </div>

                        <div className="border-t pt-4">
                          <h5 className="font-medium text-gray-900 mb-2">Lessen:</h5>
                          <div className="space-y-2">
                            {course.lessons.map((lesson) => (
                              <div key={lesson.id} className="flex items-center justify-between text-sm">
                                <div className="flex items-center space-x-3">
                                  <span className={`px-2 py-1 rounded text-xs ${
                                    lesson.type === 'Video' ? 'bg-purple-100 text-purple-800' :
                                    lesson.type === 'Interactief' ? 'bg-pink-100 text-pink-800' :
                                    lesson.type === 'Quiz' ? 'bg-orange-100 text-orange-800' :
                                    'bg-blue-100 text-blue-800'
                                  }`}>
                                    {lesson.type}
                                  </span>
                                  <span className="text-gray-700">{lesson.title}</span>
                                </div>
                                <span className="text-gray-500">{lesson.duration} min</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Importing */}
          {currentStep === 'importing' && (
            <div className="text-center py-8">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 mx-auto mb-6 relative">
                  <div className="w-full h-full border-4 border-blue-200 rounded-full"></div>
                  <div
                    className="absolute top-0 left-0 w-full h-full border-4 border-blue-600 rounded-full border-t-transparent animate-spin"
                    style={{ transform: 'rotate(45deg)' }}
                  ></div>
                </div>
                
                <h3 className="text-lg font-medium text-gray-900 mb-2">{importStatus}</h3>
                <p className="text-gray-600 mb-6">
                  Dit kan even duren, afhankelijk van de grootte van de bestanden.
                </p>
                
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${importProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">{importProgress}% voltooid</p>
              </div>
            </div>
          )}

          {/* Step 5: Complete */}
          {currentStep === 'complete' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icons.check className="w-8 h-8 text-green-600" />
              </div>
              
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Import succesvol voltooid!
              </h3>
              <p className="text-gray-600 mb-6">
                {selectedCourses.length} cursus(sen) zijn geïmporteerd en beschikbaar in je bibliotheek.
              </p>

              <div className="bg-gray-50 rounded-lg p-6 max-w-md mx-auto text-left">
                <h4 className="font-medium text-gray-900 mb-3">Geïmporteerde cursussen:</h4>
                <ul className="space-y-2">
                  {importedCourses
                    .filter(course => selectedCourses.includes(course.id))
                    .map(course => (
                      <li key={course.id} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">{course.title}</span>
                        <span className="text-gray-500">{course.lessonCount} lessen</span>
                      </li>
                    ))
                  }
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              {currentStep === 'complete' ? 'Sluiten' : 'Annuleren'}
            </button>

            <div className="flex items-center space-x-3">
              {currentStep === 'review' && (
                <button
                  onClick={() => setCurrentStep('upload')}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  Terug
                </button>
              )}
              
              {currentStep === 'review' && (
                <button
                  onClick={handleImport}
                  disabled={selectedCourses.length === 0}
                  className={`px-6 py-2 rounded-lg font-medium ${
                    selectedCourses.length === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {selectedCourses.length} Cursus(sen) Importeren
                </button>
              )}

              {currentStep === 'complete' && (
                <button
                  onClick={handleClose}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium"
                >
                  Naar Cursus Bibliotheek
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}