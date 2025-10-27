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
      const response = await fetch(`/api/lessons/${lessonId}/quiz`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch quiz questions')
      }
      
      const data = await response.json()
      setQuestions(data.questions)
      setSelectedAnswers(new Array(data.questions.length).fill(-1))
    } catch (err) {
      setError('Failed to load quiz questions')
      console.error('Error fetching quiz:', err)
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
      const response = await fetch(`/api/lessons/${lessonId}/quiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers: selectedAnswers.map((answer, index) => ({
            questionId: questions[index].id,
            answerIndex: answer
          }))
        })
      })

      if (!response.ok) {
        throw new Error('Failed to submit quiz')
      }

      const result = await response.json()
      setScore(result.score)
      setShowResults(true)
      
      // Refresh de pagina om progress bij te werken
      if (result.passed) {
        setTimeout(() => {
          router.refresh()
        }, 2000)
      }
    } catch (err) {
      setError('Failed to submit quiz')
      console.error('Error submitting quiz:', err)
    } finally {
      setLoading(false)
    }
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
          <p>{error}</p>
          <button 
            onClick={fetchQuestions}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Probeer opnieuw
          </button>
        </div>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Geen quiz vragen beschikbaar voor deze les.</p>
      </div>
    )
  }

  if (showResults) {
    const passed = score >= Math.ceil(questions.length * 0.7)
    
    return (
      <div className="text-center py-8">
        <div className={`p-6 rounded-lg ${passed ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
          <h3 className={`text-xl font-bold ${passed ? 'text-green-800' : 'text-yellow-800'}`}>
            {passed ? 'Gefeliciteerd! 🎉' : 'Bijna geslaagd!'}
          </h3>
          <p className={`mt-2 ${passed ? 'text-green-600' : 'text-yellow-600'}`}>
            Je score: {score} van de {questions.length} vragen goed
          </p>
          <p className={`mt-1 text-sm ${passed ? 'text-green-600' : 'text-yellow-600'}`}>
            {passed ? 'Je hebt de quiz succesvol afgerond!' : 'Je hebt 70% nodig om te slagen. Probeer het opnieuw!'}
          </p>
          
          {passed && (
            <div className="mt-4">
              <p className="text-green-700 text-sm">
                De les is nu gemarkeerd als voltooid!
              </p>
            </div>
          )}
          
          {!passed && (
            <button
              onClick={() => {
                setShowResults(false)
                setCurrentQuestion(0)
                setSelectedAnswers(new Array(questions.length).fill(-1))
              }}
              className="mt-4 px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
            >
              Quiz opnieuw proberen
            </button>
          )}
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
    </div>
  )
}