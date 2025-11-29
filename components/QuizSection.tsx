'use client'

import React, { useState, useEffect, useRef } from 'react'

interface QuizSectionProps {
  onAnswerCorrect: (points: number) => void
}

interface Question {
  id: number
  question: string
  options: { label: string; value: string; correct: boolean }[]
  explanation?: string
  difficulty?: 'easy' | 'medium' | 'hard'
}

const questions: Question[] = [
  {
    id: 1,
    question: 'Qui a créé le premier jeu vidéo narratif "King\'s Quest" en 1984?',
    options: [
      { label: 'A) Carol Shaw', value: 'A', correct: false },
      { label: 'B) Roberta Williams', value: 'B', correct: true },
      { label: 'C) Dona Bailey', value: 'C', correct: false },
      { label: 'D) Jade Raymond', value: 'D', correct: false },
    ],
    explanation: 'Roberta Williams est la créatrice de King\'s Quest, un jeu révolutionnaire qui a défini le genre adventure game et a vendu des millions d\'exemplaires.',
    difficulty: 'medium'
  },
  {
    id: 2,
    question: 'Quel pourcentage de joueuses dans le monde en 2024?',
    options: [
      { label: 'A) 25%', value: 'A', correct: false },
      { label: 'B) 35%', value: 'B', correct: false },
      { label: 'C) 46%', value: 'C', correct: true },
      { label: 'D) 52%', value: 'D', correct: false },
    ],
    explanation: 'Les femmes représentent 46% des joueurs dans le monde, un chiffre en constante augmentation depuis les années 2010!',
    difficulty: 'easy'
  },
  {
    id: 3,
    question: 'Qui a co-créé le jeu d\'arcade "Centipede" en 1981?',
    options: [
      { label: 'A) Dona Bailey', value: 'A', correct: true },
      { label: 'B) Amy Hennig', value: 'B', correct: false },
      { label: 'C) Kim Swift', value: 'C', correct: false },
      { label: 'D) Brenda Romero', value: 'D', correct: false },
    ],
    explanation: 'Dona Bailey a co-créé Centipede, l\'un des rares jeux d\'arcade des années 80 créé par une femme. Le jeu a été un énorme succès avec plus de 55 000 machines vendues.',
    difficulty: 'medium'
  },
  {
    id: 4,
    question: 'Quelle femme a été la première game designer professionnelle?',
    options: [
      { label: 'A) Roberta Williams', value: 'A', correct: false },
      { label: 'B) Carol Shaw', value: 'B', correct: true },
      { label: 'C) Dona Bailey', value: 'C', correct: false },
      { label: 'D) Muriel Tramis', value: 'D', correct: false },
    ],
    explanation: 'Carol Shaw a été la première femme game designer professionnelle, rejoignant Atari en 1978 et créant des jeux comme River Raid.',
    difficulty: 'hard'
  },
  {
    id: 5,
    question: 'Qui a été la designer principale du jeu Portal (2007)?',
    options: [
      { label: 'A) Amy Hennig', value: 'A', correct: false },
      { label: 'B) Kim Swift', value: 'B', correct: true },
      { label: 'C) Jade Raymond', value: 'C', correct: false },
      { label: 'D) Brenda Romero', value: 'D', correct: false },
    ],
    explanation: 'Kim Swift a été la designer principale de Portal, un jeu qui a révolutionné le genre puzzle-platformer et a remporté le Game of the Year 2007.',
    difficulty: 'medium'
  },
  {
    id: 6,
    question: 'Quel pourcentage de développeuses dans l\'industrie du jeu vidéo en 2024?',
    options: [
      { label: 'A) 20%', value: 'A', correct: false },
      { label: 'B) 25%', value: 'B', correct: false },
      { label: 'C) 30%', value: 'C', correct: true },
      { label: 'D) 35%', value: 'D', correct: false },
    ],
    explanation: 'En 2024, les femmes représentent environ 30% des développeurs dans l\'industrie du jeu vidéo, un chiffre en croissance constante.',
    difficulty: 'easy'
  }
]

export default function QuizSection({ onAnswerCorrect }: QuizSectionProps) {
  const [answered, setAnswered] = useState<Set<number>>(new Set())
  const [selectedAnswers, setSelectedAnswers] = useState<Map<number, string>>(new Map())
  const [score, setScore] = useState(0)
  const questionRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1 }
    )

    questionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => {
      questionRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref)
      })
    }
  }, [])

  const handleAnswer = (questionId: number, optionValue: string, isCorrect: boolean) => {
    if (answered.has(questionId)) return

    setAnswered(prev => new Set(prev).add(questionId))
    setSelectedAnswers(prev => new Map(prev).set(questionId, optionValue))

    const questionElement = questionRefs.current[questionId - 1]
    if (!questionElement) return

    const options = questionElement.querySelectorAll('.quiz-option')
    const result = questionElement.querySelector('.quiz-result') as HTMLElement
    const explanation = questionElement.querySelector('.quiz-explanation') as HTMLElement

    options.forEach((opt) => {
      const btn = opt as HTMLButtonElement
      btn.disabled = true
      btn.classList.remove('correct', 'wrong', 'selected')
      
      const optValue = btn.getAttribute('data-value')
      if (optValue === optionValue) {
        btn.classList.add(isCorrect ? 'correct' : 'wrong', 'selected')
      } else if (optValue && questions[questionId - 1].options.find(o => o.value === optValue)?.correct) {
        btn.classList.add('correct')
      }
    })

    if (result) {
      result.style.display = 'block'
      result.className = `quiz-result ${isCorrect ? 'correct' : 'wrong'}`
      result.innerHTML = isCorrect 
        ? '<span class="result-icon">✓</span> Bonne réponse ! 🎉' 
        : '<span class="result-icon">✗</span> Mauvaise réponse'
    }

 if (explanation) {
  const explanationText = questions[questionId - 1].explanation ?? null;

  if (explanationText) {
    explanation.style.display = 'block';
  } else {
    explanation.style.display = 'none';
  }

  explanation.textContent = explanationText; // type: string | null ✅
}


    if (isCorrect) {
      const points = 50
      setScore(prev => prev + points)
      onAnswerCorrect(points)
    }
  }

  const completionPercentage = (answered.size / questions.length) * 100

  return (
    <div className="quiz-section">
      <div className="quiz-header">
        <h2>🎯 QUIZ INTERACTIF 🎯</h2>
        <p className="quiz-subtitle">Testez vos connaissances sur les femmes pionnières du gaming</p>
        <div className="quiz-stats">
          <div className="quiz-stat">
            <span className="stat-label">Score</span>
            <span className="stat-value">{score}</span>
          </div>
          <div className="quiz-stat">
            <span className="stat-label">Répondu</span>
            <span className="stat-value">{answered.size}/{questions.length}</span>
          </div>
          <div className="quiz-stat">
            <span className="stat-label">Taux de réussite</span>
            <span className="stat-value">
              {answered.size > 0 
                ? Math.round((Array.from(selectedAnswers.values()).filter((v, i) => 
                    questions[i]?.options.find(o => o.value === v)?.correct
                  ).length / answered.size) * 100)
                : 0}%
            </span>
          </div>
        </div>
        <div className="quiz-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
          <span className="progress-text">{Math.round(completionPercentage)}% complété</span>
        </div>
      </div>

      <div className="quiz-questions">
        {questions.map((q, index) => (
          <div 
            key={q.id} 
            className={`quiz-question ${q.difficulty || 'medium'}`}
            ref={(el) => { questionRefs.current[index] = el }}
          >
            <div className="question-header">
              <span className="question-number">Question {q.id}</span>
              {q.difficulty && (
                <span className={`difficulty-badge ${q.difficulty}`}>
                  {q.difficulty === 'easy' ? '🟢 Facile' : q.difficulty === 'medium' ? '🟡 Moyen' : '🔴 Difficile'}
                </span>
              )}
              {answered.has(q.id) && (
                <span className="question-status">
                  {selectedAnswers.get(q.id) && questions[index].options.find(o => o.value === selectedAnswers.get(q.id))?.correct ? '✓' : '✗'}
                </span>
              )}
            </div>
            <p className="question-text">{q.question}</p>
            <div className="quiz-options">
              {q.options.map((opt) => (
                <button
                  key={opt.value}
                  className="quiz-option"
                  data-value={opt.value}
                  onClick={() => handleAnswer(q.id, opt.value, opt.correct)}
                  disabled={answered.has(q.id)}
                >
                  <span className="option-letter">{opt.value})</span>
                  <span className="option-text">{opt.label.replace(`${opt.value}) `, '')}</span>
                </button>
              ))}
            </div>
            <div className="quiz-result" id={`result${q.id}`} style={{ display: 'none' }}></div>
            <div className="quiz-explanation" id={`explanation${q.id}`} style={{ display: 'none' }}></div>
          </div>
        ))}
      </div>
    </div>
  )
}
