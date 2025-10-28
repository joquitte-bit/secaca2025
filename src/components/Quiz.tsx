'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface QuizProps {
  lessonId: string
}

interface QuizQuestion {
  id: string
  prompt: string
  answers: string[]
  explanation: string
  order: number
}

export default function Quiz({ lessonId }: QuizProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchQuestions()
  }, [lessonId])

const fetchQuestions = async () => {
  try {
    setLoading(true)
    setError('')
    
    // TEMPORARY: Mock quiz questions voor testing - NU MET 3 VRAGEN
    const mockQuestions = [
      {
        id: '1',
        prompt: 'Wat is het belangrijkste doel van cybersecurity?',
        answers: [
          'Bedrijfsprocessen versnellen',
          'Informatie en systemen beschermen tegen cyberdreigingen',
          'Meer data verzamelen',
          'Gebruikers tracken'
        ],
        explanation: 'Cybersecurity richt zich op het beschermen van informatie, systemen en netwerken tegen digitale aanvallen.',
        order: 1
      },
      {
        id: '2', 
        prompt: 'Welke van deze is een veelvoorkomend type cyberaanval?',
        answers: [
          'Phishing',
          'Weather hacking',
          'Food spoofing',
          'Time manipulation'
        ],
        explanation: 'Phishing is een sociale-engineering aanval waarbij aanvallers zich voordoen als betrouwbare entiteiten.',
        order: 2
      },
      {
        id: '3',
        prompt: 'Wat betekent het principe "minimale privileges" in cybersecurity?',
        answers: [
          'Gebruikers alleen de rechten geven die ze nodig hebben',
          'Zo min mogelijk software installeren',
          'Alle gebruikers admin rechten geven',
          'Systemen zo complex mogelijk maken'
        ],
        explanation: 'Het principe van minimale privileges betekent dat gebruikers alleen de toegang en rechten krijgen die absoluut noodzakelijk zijn voor hun werk.',
        order: 3
      }
    ]

    console.log('🎯 Using mock quiz questions for testing')
    setQuestions(mockQuestions)
    setSelectedAnswers(new Array(mockQuestions.length).fill(-1))
    
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to load quiz questions'
    setError(errorMessage)
    console.error('❌ Error fetching quiz questions:', err)
  } finally {
    setLoading(false)
  }
}

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestion] = answerIndex
    setSelectedAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      submitQuiz()
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

const submitQuiz = async () => {
  try {
    setLoading(true)
    
    // CORRECTE SCORE BEREKENING voor de mock vragen
    const correctAnswers = selectedAnswers.filter((selectedIndex, questionIndex) => {
      // Voor mock vragen: 
      // Vraag 1 (index 0): correct antwoord is index 1 (tweede antwoord)
      // Vraag 2 (index 1): correct antwoord is index 0 (eerste antwoord)  
      // Vraag 3 (index 2): correct antwoord is index 0 (eerste antwoord)
      if (questionIndex === 0) return selectedIndex === 1; // Vraag 1
      if (questionIndex === 1) return selectedIndex === 0; // Vraag 2
      if (questionIndex === 2) return selectedIndex === 0; // Vraag 3
      return false;
    }).length;
    
    const score = correctAnswers
    const passed = score >= Math.ceil(questions.length * 0.7)
    
    console.log(`📊 Quiz result: ${score}/${questions.length}, passed: ${passed}`)
    console.log('📝 Selected answers:', selectedAnswers)
    
    // PROBEER 1: Quiz completion endpoint
    try {
      const response = await fetch(`/api/lessons/${lessonId}/quiz/completion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          score: score,
          passed: passed,
          totalQuestions: questions.length
        })
      })

      if (response.ok) {
        const result = await response.json()
        console.log('✅ Quiz submitted via completion endpoint:', result)
      } else {
        throw new Error(`HTTP ${response.status}`)
      }
    } catch (apiError) {
      console.log('⚠️ Completion endpoint failed, trying alternative...')
      
      // PROBEER 2: Direct naar lessons quiz endpoint
      try {
        const response = await fetch(`/api/lessons/${lessonId}/quiz`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            score: score,
            passed: passed
          })
        })

        if (response.ok) {
          const result = await response.json()
          console.log('✅ Quiz submitted via lessons endpoint:', result)
        } else {
          throw new Error(`HTTP ${response.status}`)
        }
      } catch (secondError) {
        console.log('⚠️ All API endpoints failed, using local storage fallback')
        
        // FALLBACK: Sla lokaal op
        localStorage.setItem(`quiz-${lessonId}`, JSON.stringify({
          score,
          passed,
          completedAt: new Date().toISOString()
        }))
      }
    }
    
    // Toon resultaten
    setScore(score)
    setShowResults(true)
    
    // Trigger completion event
    if (passed) {
      console.log('✅ Quiz passed, triggering quizCompleted event')
      window.dispatchEvent(new CustomEvent('quizCompleted', { 
        detail: { 
          lessonId, 
          score: score, 
          passed: true,
          totalQuestions: questions.length
        }
      }))
      
      // Refresh de pagina
      setTimeout(() => {
        router.refresh()
      }, 1500)
    }
    
  } catch (err) {
    console.error('❌ Error in submitQuiz:', err)
    setError('Quiz ingediend, maar kon niet worden opgeslagen in het systeem.')
  } finally {
    setLoading(false)
  }
}

  const resetQuiz = () => {
    setShowResults(false)
    setCurrentQuestion(0)
    setSelectedAnswers(new Array(questions.length).fill(-1))
    setScore(0)
    setError('')
  }

  if (loading && questions.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Quiz vragen laden...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 bg-red-50 p-4 rounded-lg">
          <p className="font-medium">Fout bij laden quiz</p>
          <p className="text-sm mt-1">{error}</p>
          <div className="flex gap-2 justify-center mt-3">
            <button 
              onClick={fetchQuestions}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
            >
              Probeer opnieuw
            </button>
            <button 
              onClick={() => router.refresh()}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
            >
              Pagina vernieuwen
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (questions.length === 0 && !loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Geen quiz vragen beschikbaar voor deze les.</p>
        <button 
          onClick={fetchQuestions}
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
        >
          Opnieuw proberen
        </button>
      </div>
    )
  }

  if (showResults) {
    const passed = score >= Math.ceil(questions.length * 0.7)
    const percentage = Math.round((score / questions.length) * 100)
    
    return (
      <div className="text-center py-8">
        <div className={`p-6 rounded-lg ${passed ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
          <h3 className={`text-xl font-bold ${passed ? 'text-green-800' : 'text-yellow-800'}`}>
            {passed ? 'Gefeliciteerd! 🎉' : 'Bijna geslaagd!'}
          </h3>
          <p className={`mt-2 ${passed ? 'text-green-600' : 'text-yellow-600'}`}>
            Je score: {score} van de {questions.length} vragen goed ({percentage}%)
          </p>
          <p className={`mt-1 text-sm ${passed ? 'text-green-600' : 'text-yellow-600'}`}>
            {passed ? 'Je hebt de quiz succesvol afgerond!' : 'Je hebt 70% nodig om te slagen. Probeer het opnieuw!'}
          </p>
          
          {passed && (
            <div className="mt-4">
              <p className="text-green-700 text-sm font-medium">
                ✅ De les is nu gemarkeerd als voltooid!
              </p>
              <p className="text-green-600 text-xs mt-1">
                Je kunt nu doorgaan naar de volgende les
              </p>
            </div>
          )}
          
          <div className="mt-6 flex gap-3 justify-center">
            {!passed && (
              <button
                onClick={resetQuiz}
                className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
              >
                Quiz opnieuw proberen
              </button>
            )}
            <button
              onClick={fetchQuestions}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Quiz herladen
            </button>
          </div>
        </div>
      </div>
    )
  }

  const currentQ = questions[currentQuestion]
  const isLastQuestion = currentQuestion === questions.length - 1
  const canProceed = selectedAnswers[currentQuestion] !== -1

  return (
    <div className="quiz-container">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Vraag {currentQuestion + 1} van {questions.length}</span>
          <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {currentQ.prompt}
        </h3>
        
        <div className="space-y-3">
          {currentQ.answers.map((answer, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`w-full text-left p-4 rounded-lg border transition-colors ${
                selectedAnswers[currentQuestion] === index
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {answer}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Vorige
        </button>
        
        <button
          onClick={handleNext}
          disabled={!canProceed}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLastQuestion ? 'Quiz afronden' : 'Volgende'}
        </button>
      </div>

      {/* Debug info */}
      <div className="mt-4 p-2 bg-gray-100 rounded text-xs text-gray-500">
        <div>Lesson ID: {lessonId}</div>
        <div>Questions loaded: {questions.length}</div>
        <div>Current question: {currentQuestion + 1}</div>
        <div>Selected answers: {JSON.stringify(selectedAnswers)}</div>
      </div>
    </div>
  )
}