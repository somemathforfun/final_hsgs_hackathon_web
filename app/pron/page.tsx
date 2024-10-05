'use client'
import { useEffect, useState } from 'react';

// Helper function to fetch IPA pronunciation from API
const fetchPronunciation = async (word: string): Promise<string | null> => {
  try {
    const response = await fetch(`http://localhost:3000/api/dictionary/en/${word}`);
    const data = await response.json();
    return data.pronunciation[0].pron;
  } catch (error) {
    console.error(`Error fetching pronunciation for ${word}:`, error);
    return null;
  }
};

// Helper function to find the stress mark position in IPA
const findStressMarkPosition = (ipa: string): number => {
  ipa = ipa.slice(1, -1); // Remove surrounding dots
  if (ipa[0] === 'ˈ') {
    return 1;
  }

  ipa = '.' + ipa; // Add a dot at the beginning of the IPA string
  let stressCount = 0;
  for (let char of ipa) {
    if (char === '.' || char === 'ˈ') {
      stressCount++;
      if (char === 'ˈ') {
        return stressCount;
      }
    }
  }

  return 1; // Return 1 if no stress mark is found
};

// Function to fetch words with specific stress patterns for a question
const fetchWordsForQuestion = async (): Promise<Array<{ word: string; stressPosition: number }> | null> => {
  const wordList = [
    'apple',
    'banana',
    'orange',
    'pear',
    'grape',
    'pineapple',
    'strawberry',
    'watermelon',
  ];

  // Randomly generate targetStress between 1 to 3
  const targetStress = Math.floor(Math.random() * 3) + 1;

  const randomizeList = (list: string[]) => {
    return list.sort(() => Math.random() - 0.5); // Randomly shuffle the list
  };

  const checkedWords = new Set<string>();
  const words: Array<{ word: string; stressPosition: number }> = [];

  // Collect words with the same stress position
  const sameStressWords: Array<{ word: string; stressPosition: number }> = [];

  while (sameStressWords.length < 3) {
    const randomIndex = Math.floor(Math.random() * wordList.length);
    const word = wordList[randomIndex];

    if (checkedWords.has(word)) {
      continue;
    }

    const pronunciation = await fetchPronunciation(word);
    checkedWords.add(word);

    if (pronunciation) {
      const stressPosition = findStressMarkPosition(pronunciation);
      if (stressPosition === targetStress) {
        sameStressWords.push({ word, stressPosition });
      } else {
        words.push({ word, stressPosition }); // Add one word with different stress
      }
    }
  }

  // Ensure there are exactly 4 words in the question
  if (sameStressWords.length === 3 && words.length === 1) {
    return [...sameStressWords, ...words];
  }

  return null; // Return null if unable to form a valid question
};

const WordStressQuiz = () => {
  const [questions, setQuestions] = useState<Array<Array<{ word: string; stressPosition: number }>> | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Array<string | null>>(new Array(10).fill(null));
  const [showResults, setShowResults] = useState<boolean>(false);

  useEffect(() => {
    generateQuestions();
  }, []);

  const generateQuestions = async () => {
    try {
      const questionsData: Array<Array<{ word: string; stressPosition: number }>> = [];
      for (let i = 0; i < 10; i++) {
        const words = await fetchWordsForQuestion();
        questionsData.push(words);
      }
      setQuestions(questionsData);
      setSelectedAnswers(new Array(10).fill(null));
      setShowResults(false);
    } catch (err) {
      console.error('Error generating questions:', err);
    }
  };

  const handleAnswerSelection = (questionIndex: number, selectedOption: string) => {
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[questionIndex] = selectedOption;
    setSelectedAnswers(newSelectedAnswers);
  };

  const handleCheckAnswers = () => {
    setShowResults(true);
  };

  const resetQuiz = () => {
    generateQuestions();
  };

  return (
    <div>
      <h1>Word Stress Quiz</h1>
      <button onClick={resetQuiz}>Generate Questions</button>
      {questions && questions.map((question, index) => (
        <div key={index} style={{ marginBottom: '20px' }}>
          <h3>Question {index + 1}</h3>
          {question.map((wordObj, idx) => (
            <div key={idx} style={{ marginBottom: '10px' }}>
              <button
                onClick={() => handleAnswerSelection(index, String.fromCharCode(65 + idx))}
                disabled={selectedAnswers[index] !== null}
              >
                {String.fromCharCode(65 + idx)}. {wordObj.word}
              </button>
            </div>
          ))}
          {showResults && (
            <div style={{ marginTop: '10px' }}>
              Correct Answer: {String.fromCharCode(65 + question.findIndex((w, idx) => w.stressPosition !== question[0].stressPosition))}
              {selectedAnswers[index] && selectedAnswers[index] === String.fromCharCode(65 + question.findIndex((w, idx) => w.stressPosition !== question[0].stressPosition)) ? (
                <p>Correct!</p>
              ) : (
                <p>Incorrect</p>
              )}
            </div>
          )}
        </div>
      ))}
      {questions && (
        <div style={{ marginTop: '20px' }}>
          <button onClick={handleCheckAnswers}>Check Answers</button>
        </div>
      )}
    </div>
  );
};

export default WordStressQuiz;
