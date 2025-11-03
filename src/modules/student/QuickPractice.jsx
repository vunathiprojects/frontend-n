import { useState, useEffect } from "react";
import QuizGrade from "./QuizGrade";
import QuizSubject from "./QuizSubject";
import QuizQuestion from "./QuizQuestion";
import { useQuiz } from "./QuizContext";
import { submitQuizAttempt, calculateQuizStats } from "../../utils/quizTracking";
import { API_CONFIG, fastAPI } from "../../config/api";
import "./Quiz.css";

// Updated API configuration with new backend URL
const UPDATED_API_CONFIG = {
  FASTAPI: {
    BASE_URL: 'https://backend-n.azurewebsites.net',
    QUICK_PRACTICE: {
      GET_CLASSES: '/quick-practice',
      GET_CHAPTERS: (className) => `/quick-practice/${encodeURIComponent(className)}`,
      GET_SUBTOPICS: (className, subject) => `/quick-practice/${encodeURIComponent(className)}/${encodeURIComponent(subject)}`,
      GENERATE_QUIZ: (params) => {
        const { subtopic, currentLevel, retry, language } = params;
        return `/quick-practice/${encodeURIComponent(subtopic)}/${currentLevel}?retry=${retry}&language=${language}`;
      }
    }
  }
};

function Quiz() {
  const { updateQuizResults } = useQuiz();
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [subtopics, setSubtopics] = useState({});
  const [quiz, setQuiz] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedSubtopic, setSelectedSubtopic] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [userAnswers, setUserAnswers] = useState([]);
  const [quizStartTime, setQuizStartTime] = useState(null);

  // Fetch classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const data = await fastAPI.get(UPDATED_API_CONFIG.FASTAPI.QUICK_PRACTICE.GET_CLASSES);
        setClasses(data.classes || []);
      } catch (error) {
        console.error("Failed to load classes:", error);
        setError("Failed to load classes");
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const fetchSubjects = async (className) => {
    if (!className) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await fastAPI.get(UPDATED_API_CONFIG.FASTAPI.QUICK_PRACTICE.GET_CHAPTERS(className));
      setSubjects(data.chapters || []);
    } catch (error) {
      console.error("Failed to load subjects:", error);
      setError("Failed to load subjects");
    } finally {
      setLoading(false);
    }
  };

  const fetchSubtopics = async (className, subject) => {
    if (!className || !subject) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await fastAPI.get(UPDATED_API_CONFIG.FASTAPI.QUICK_PRACTICE.GET_SUBTOPICS(className, subject));
      
      if (Array.isArray(data.subtopics)) {
        setSubtopics({ "Chapter 1": data.subtopics });
      } else if (typeof data.subtopics === "object" && data.subtopics !== null) {
        setSubtopics(data.subtopics);
      } else {
        setSubtopics({});
        setError("Invalid subtopics data format");
      }
    } catch (error) {
      console.error("Failed to load subtopics:", error);
      setError("Failed to load subtopics");
    } finally {
      setLoading(false);
    }
  };

  const fetchQuiz = async (subtopic, level = 1, retry = false, language = "English") => {
    if (!subtopic) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Construct URL with language parameter using updated API config
      const params = {
        subtopic: subtopic,
        currentLevel: level,
        retry: retry,
        language: language
      };
      const url = UPDATED_API_CONFIG.FASTAPI.QUICK_PRACTICE.GENERATE_QUIZ(params);
      
      console.log("Fetching quiz with URL:", url);
      console.log("Language being sent:", language);
      
      const data = await fastAPI.get(url);
      console.log("Quiz data received:", data);
      
      if (data.error) {
        setError(data.error);
      } else if (!data.quiz || !Array.isArray(data.quiz)) {
        setError("Invalid quiz data received from server");
      } else {
        const cleanedQuiz = data.quiz.map((q) => {
          // Safely clean options and answer
          if (q.options && Array.isArray(q.options)) {
            q.options = q.options.map((opt) => 
              typeof opt === 'string' ? opt.replace(/^[A-D][).]\s*/, "") : String(opt)
            );
          }
          if (q.answer && typeof q.answer === 'string') {
            q.answer = q.answer.replace(/^[A-D][).]\s*/, "");
          }
          return q;
        });
        
        setQuiz(cleanedQuiz);
        setCurrentLevel(data.currentLevel || level);
        setCurrentQ(0);
        setSelected(null);
        setScore(0);
        setIsFinished(false);
        setShowAnswer(false);
        setUserAnswers([]);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setError(`Failed to load quiz: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClassClick = (className) => {
    setSelectedClass(className);
    setSelectedSubject(null);
    setSelectedSubtopic(null);
    setSubjects([]);
    setSubtopics({});
    fetchSubjects(className);
  };

  const handleSubjectClick = (subject) => {
    setSelectedSubject(subject);
    setSelectedSubtopic(null);
    setSubtopics({});
    fetchSubtopics(selectedClass, subject);
  };

  const handleSubtopicClick = (subtopic, language = "English") => {
    console.log("Subtopic clicked:", subtopic, "Language:", language);
    setSelectedSubtopic(subtopic);
    setSelectedLanguage(language);
    setCurrentLevel(1);
    setCurrentQ(0);
    setScore(0);
    setIsFinished(false);
    setUserAnswers([]);
    setError(null);
    setQuizStartTime(Date.now());
    enterFullScreen();
    fetchQuiz(subtopic, 1, false, language);
  };

  const handleAnswer = (option) => {
    if (showAnswer || isFinished) return; // Prevent answering after showing answer
    
    setSelected(option);
    setShowAnswer(true);

    const newAnswers = [...userAnswers];
    newAnswers[currentQ] = option;
    setUserAnswers(newAnswers);

    if (option === quiz[currentQ]?.answer) {
      setScore(prevScore => prevScore + 1);
    }
  };

  const nextQuestion = async () => {
    if (currentQ < quiz.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelected(null);
      setShowAnswer(false);
    } else {
      setIsFinished(true);
      
      try {
        // Calculate quiz statistics
        const quizStats = calculateQuizStats(quiz, userAnswers);
        const timeTakenSeconds = Math.floor((Date.now() - quizStartTime) / 1000);
        
        // Prepare quiz data for submission
        const quizData = {
          quizType: 'ai_generated',
          subject: selectedSubject || 'Unknown',
          chapter: '',
          topic: selectedSubject || 'Unknown',
          subtopic: selectedSubtopic || 'Unknown',
          className: selectedClass || 'Unknown',
          difficultyLevel: 'simple',
          language: selectedLanguage || 'English',
          totalQuestions: quizStats.totalQuestions || 0,
          correctAnswers: quizStats.correctAnswers || 0,
          wrongAnswers: quizStats.wrongAnswers || 0,
          unansweredQuestions: quizStats.unansweredQuestions || 0,
          timeTakenSeconds: timeTakenSeconds || 0,
          score: quizStats.score || 0,
          quizQuestions: quiz || [],
          userAnswers: (userAnswers || []).filter(answer => answer !== null && answer !== undefined)
        };
        
        // Submit to backend
        console.log('📤 Submitting quiz attempt to backend...', quizData);
        const submitResponse = await submitQuizAttempt(quizData);
        console.log('✅ Quiz attempt submitted successfully!', submitResponse);
        
        // Update local quiz results
        updateQuizResults(score, quiz.length, currentLevel, selectedClass, selectedSubject, selectedSubtopic);
        
      } catch (error) {
        console.error('❌ Error submitting quiz attempt:', error);
        updateQuizResults(score, quiz.length, currentLevel, selectedClass, selectedSubject, selectedSubtopic);
        alert('Warning: Quiz results saved locally, but could not sync to server. Please check your connection.');
      } finally {
        exitFullScreen();
      }
    }
  };

  const prevQuestion = () => {
    if (currentQ > 0) {
      setCurrentQ(currentQ - 1);
      setSelected(userAnswers[currentQ - 1] || null);
      setShowAnswer(false);
    }
  };

  const backToChapters = () => {
    setSelectedSubtopic(null);
    setQuiz([]);
    setCurrentQ(0);
    setSelected(null);
    setScore(0);
    setIsFinished(false);
    setShowAnswer(false);
    setUserAnswers([]);
    exitFullScreen();
  };

  const retryQuiz = () => {
    enterFullScreen();
    fetchQuiz(selectedSubtopic, currentLevel, true, selectedLanguage);
  };

  const nextLevel = () => {
    const nextLvl = currentLevel + 1;
    setCurrentLevel(nextLvl);
    fetchQuiz(selectedSubtopic, nextLvl, false, selectedLanguage);
    enterFullScreen();
  };

  const enterFullScreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch(err => {
        console.log('Fullscreen error:', err);
      });
    }
  };

  const exitFullScreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(err => {
        console.log('Exit fullscreen error:', err);
      });
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="edu-loader">
          <span role="img" aria-label="books" className="edu-icon">
            📚
          </span>
          <span role="img" aria-label="pencil" className="edu-icon">
            ✏️
          </span>
          <span role="img" aria-label="globe" className="edu-icon">
            🌍
          </span>
        </div>
        <p>Preparing your Quiz...</p>
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <p>{error}</p>
          <button className="retry-btn" onClick={() => setError(null)}>
            Try Again
          </button>
        </div>
      )}

      {/* Grade Selection */}
      {!selectedClass && !error && !loading && (
        <QuizGrade classes={classes} onClassClick={handleClassClick} />
      )}

      {/* Subject / Subtopic Selection */}
      {selectedClass && !selectedSubtopic && !error && !loading && (
        <QuizSubject
          subjects={subjects}
          subtopics={subtopics}
          selectedSubject={selectedSubject}
          selectedClass={selectedClass}
          onClassClick={() => {
            setSelectedClass(null);
            setSelectedSubject(null);
            setSelectedSubtopic(null);
            setSubjects([]);
            setSubtopics({});
          }}
          onSubjectClick={handleSubjectClick}
          onSubtopicClick={handleSubtopicClick}
        />
      )}

      {/* Quiz Page */}
      {selectedSubtopic && !error && !loading && (
        <QuizQuestion
          quiz={quiz}
          currentQ={currentQ}
          selected={selected}
          showAnswer={showAnswer}
          score={score}
          isFinished={isFinished}
          handleAnswer={handleAnswer}
          nextQuestion={nextQuestion}
          prevQuestion={prevQuestion}
          retryQuiz={retryQuiz}
          nextLevel={nextLevel}
          backToChapters={backToChapters}
          currentLevel={currentLevel}
          userAnswers={userAnswers}
          selectedLanguage={selectedLanguage}
        />
      )}
    </>
  );
}

export default Quiz;
