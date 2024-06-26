'use client'

import React, { useState, useRef, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import RecordRTC from 'recordrtc';

declare const window: any;

const SpeakingPage = () => {
    const [prompt, setPrompt] = useState('');
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [rating, setRating] = useState('');
    const [feedback, setFeedback] = useState('');
    const [wordsPerMinute, setWordsPerMinute] = useState(0);
    const [fluency, setFluency] = useState('');
    const [taskType, setTaskType] = useState<number | null>(null);
    const [timeLeft, setTimeLeft] = useState(120); // 2 minutes countdown for Task 2
    const [records, setRecords] = useState<any[]>([]); // State to store past records
    const recognitionRef = useRef<any>(null);
    const startTimeRef = useRef<number | null>(null);
    const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
    const mediaRecorderRef = useRef<RecordRTC | null>(null);
    const audioBlobRef = useRef<Blob | null>(null);

    const getRandomPrompt = (task: number) => {
        const taskMessages: { [key: number]: string } = {
            1: "Give me about 7 words speaking prompt for IELTS Speaking Task 1 without bold, highlighted text or special start character",
            2: "Give me about 15 words speaking prompt for IELTS Speaking Task 2 without bold, highlighted text or special start character",
            3: "Give me about 20 words speaking prompt for IELTS Speaking Task 3 without bold, highlighted text or special start character",
            4: "Give me about 25 words speaking prompt for IELTS Speaking Task 4 without bold, highlighted text or special start character"
        };

        setTaskType(task);

        fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer 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`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "openai/gpt-4o",
                "messages": [
                    { "role": "user", "content": taskMessages[task] },
                ],
            })
        })
        .then(response => response.json())
        .then(data => {
            const messageContent = data.choices[0].message.content;
            setPrompt(messageContent);
        })
        .catch(error => {
            console.error('Error:', error);
            setError('An error occurred while fetching the prompt.');
        });
    };

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (taskType === 2 && isLoading && timeLeft > 0) {
            timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        } else if (timeLeft === 0) {
            stopSpeechRecognition();
        }
        return () => clearTimeout(timer);
    }, [timeLeft, isLoading, taskType]);

    useEffect(() => {
        const savedRecords = JSON.parse(localStorage.getItem('speakingRecords') || '[]');
        setRecords(savedRecords);
    }, []);

    const rateTranscript = (transcript: string, prompt: string) => {
        fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer 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`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "openai/gpt-4o",
                "messages": [
                    { "role": "user", "content": `Rate the following transcript based on the IELTS Speaking band without Fluency and Coherance rating start with band score on the first line and without bold, highlighted text. Prompt: "${prompt}". Transcript: "${transcript}"` },
                ],
            })
        })
        .then(response => response.json())
        .then(data => {
            const messageContent = data.choices[0].message.content;
            setRating(messageContent);
        })
        .catch(error => {
            console.error('Error:', error);
            setError('An error occurred while rating the transcript.');
        });
    };

    const getFeedback = (transcript: string, prompt: string) => {
        fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer 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`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "openai/gpt-4o",
                "messages": [
                    { "role": "user", "content": `Give feedback for improvement based on the IELTS Speaking band without Fluency and Coherance feedback, with each part start with an dash and without bold, highlighted text. Prompt: "${prompt}". Transcript: "${transcript}"` },
                ],
            })
        })
        .then(response => response.json()) 
        .then(data => {
            const messageContent = data.choices[0].message.content;
            setFeedback(messageContent);
        })
        .catch(error => {
            console.error('Error:', error);
            setError('An error occurred while getting feedback.');
        });
    };

    const startSpeechRecognition = () => {
        setIsLoading(true);
        setTranscript(''); // Clear the transcript when starting a new recording
        setError('');
        setRating('');
        setFeedback('');
        setWordsPerMinute(0);
        setFluency('');
        startTimeRef.current = Date.now(); // Record the start time
        setTimeLeft(120); // Reset the timer for Task 2

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setError('Speech recognition is not supported in this browser.');
            setIsLoading(false);
            return;
        }

        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;

        recognition.continuous = true; // Allows for continuous speech recognition
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            const result = event.results[event.resultIndex][0].transcript;
            setTranscript(prev => prev + ' ' + result);
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            console.error('Speech recognition error:', event.error);
            setError('An error occurred during speech recognition');
            setIsLoading(false);
        };

        recognition.onend = () => {
            setIsLoading(false);
            calculateWordsPerMinute(); // Calculate words per minute when recognition ends
        };

        recognition.start();

        // Start audio recording
        navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
            const mediaRecorder = new RecordRTC(stream, {
                type: 'audio',
                mimeType: 'audio/wav',
                recorderType: RecordRTC.StereoAudioRecorder,
                desiredSampRate: 16000,
            });
            mediaRecorderRef.current = mediaRecorder;
            mediaRecorder.startRecording();
        }).catch(error => {
            console.error('Media recording error:', error);
            setError('An error occurred while accessing the microphone.');
            setIsLoading(false);
        });
    };

    const stopSpeechRecognition = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setIsLoading(false);
            rateTranscript(transcript, prompt); // Rate the transcript after stopping
            getFeedback(transcript, prompt); // Get feedback after stopping
            calculateWordsPerMinute(); // Calculate words per minute when stopping

            if (mediaRecorderRef.current) {
                mediaRecorderRef.current.stopRecording(() => {
                    audioBlobRef.current = mediaRecorderRef.current!.getBlob();
                    saveRecord(); // Save the record after stopping recording
                });
            }
        }
    };

    const calculateWordsPerMinute = () => {
        const words = transcript.trim().split(/\s+/).length;
        const durationInMinutes = (Date.now() - (startTimeRef.current || Date.now())) / 1000 / 60;
        const wpm = words / durationInMinutes;
        setWordsPerMinute(wpm);
        setFluency(wpm >= 130 ? 'Fluent' : wpm >= 90 ? 'Intermediate' : 'Basic');
    };

    const saveRecord = () => {
        const newRecord = {
            prompt,
            transcript,
            wordsPerMinute,
            fluency,
            rating,
            feedback,
            date: new Date().toLocaleString(),
            audio: audioBlobRef.current ? URL.createObjectURL(audioBlobRef.current) : null
        };
        const updatedRecords = [newRecord, ...records];
        setRecords(updatedRecords);
        localStorage.setItem('speakingRecords', JSON.stringify(updatedRecords));
    };

    const startSpeech = () => {
        if (!prompt) return;

        const utterance = new SpeechSynthesisUtterance(prompt);
        utterance.lang = 'en-US';

        utterance.onend = () => {
            console.log('Speech synthesis finished.');
        };

        speechSynthesisRef.current = utterance;
        window.speechSynthesis.speak(utterance);
    };

    const stopSpeech = () => {
        if (speechSynthesisRef.current) {
            window.speechSynthesis.cancel();
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-100 to-blue-50">
            <Header />
            <div className="flex-grow container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">IELTS Speaking Practice</h1>
                <div className="w-full max-w-4xl mx-auto bg-white p-8 md:p-16 rounded-3xl shadow-2xl text-center">
                    <div className="grid grid-cols-2 gap-6 mb-8">
                        {[1, 2, 3, 4].map(task => (
                            <div
                                key={task}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg cursor-pointer transition duration-300 transform hover:scale-105"
                                onClick={() => getRandomPrompt(task)}
                            >
                                Task {task}
                            </div>
                        ))}
                    </div>
                    {prompt && (
                        <div className="mb-6">
                            <p className="text-xl text-gray-700">{prompt}</p>
                            <div className="flex justify-center mt-4">
                                <button
                                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mx-2 transition duration-300 transform hover:scale-105"
                                    onClick={startSpeech}
                                >
                                    Start Speech
                                </button>
                                <button
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mx-2 transition duration-300 transform hover:scale-105"
                                    onClick={stopSpeech}
                                >
                                    Stop Speech
                                </button>
                            </div>
                        </div>
                    )}
                    <div className="flex flex-col items-center">
                        <p className="mb-4 text-lg text-gray-600">Status: {isLoading ? 'Recording...' : 'Idle'}</p>
                        <button
                            className={`bg-${isLoading ? 'gray' : 'green'}-500 hover:bg-${isLoading ? 'gray' : 'green'}-700 text-white font-bold py-2 px-4 rounded mb-4 transition duration-300 transform hover:scale-105`}
                            onClick={startSpeechRecognition}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Recording...' : 'Start Recording'}
                        </button>
                        {isLoading && taskType === 2 && (
                            <p className="text-lg text-red-600 mb-4">Time Left: {timeLeft} seconds</p>
                        )}
                        {isLoading && (
                            <button
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mb-4 transition duration-300 transform hover:scale-105"
                                onClick={stopSpeechRecognition}
                            >
                                Stop Recording
                            </button>
                        )}
                        {transcript && (
                            <div className="flex flex-row mt-4 space-x-4">
                                <div className="bg-gray-100 p-4 rounded shadow-inner w-1/2">
                                    <h2 className="text-lg font-bold mb-2">Transcript</h2>
                                    <p className="text-left text-gray-700 whitespace-pre-wrap leading-relaxed">{transcript}</p>
                                </div>
                                <div className="bg-purple-100 p-4 rounded shadow-inner w-1/2">
                                    <h2 className="text-lg font-bold mb-2">Words Per Minute</h2>
                                    <p className="text-left text-gray-700">{wordsPerMinute.toFixed(2)}</p>
                                    <p className="text-left text-gray-700">{fluency}</p>
                                </div>
                            </div>
                        )}
                        {rating && (
                            <div className="mt-4 bg-yellow-100 p-4 rounded shadow-inner">
                                <h2 className="text-lg font-bold mb-2">IELTS Speaking Band Rating</h2>
                                <p className="text-left text-gray-700 whitespace-pre-wrap leading-relaxed">{rating}</p>
                            </div>
                        )}
                        {feedback && (
                            <div className="mt-4 bg-green-100 p-4 rounded shadow-inner">
                                <h2 className="text-lg font-bold mb-2">Feedback for Improvement</h2>
                                <p className="text-left text-gray-700 whitespace-pre-wrap leading-relaxed">{feedback}</p>
                            </div>
                        )}
                        {error && <p className="text-red-500">{error}</p>}
                    </div>
                    <div className="mt-8">
                        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Past Records</h2>
                        {records.length > 0 ? (
                            records.map((record, index) => (
                                <div key={index} className="bg-white p-4 rounded shadow mb-4">
                                    <p><strong>Date:</strong> {record.date}</p>
                                    <p><strong>Prompt:</strong> {record.prompt}</p>
                                    <p><strong>Transcript:</strong> {record.transcript}</p>
                                    <p><strong>Words Per Minute:</strong> {record.wordsPerMinute.toFixed(2)}</p>
                                    <p><strong>Fluency Tier:</strong> {record.fluency}</p>
                                    <p><strong>Rating:</strong> {record.rating}</p>
                                    <p><strong>Feedback:</strong> {record.feedback}</p>
                                    {record.audio && (
                                        <audio controls>
                                            <source src={record.audio} type="audio/wav" />
                                            Your browser does not support the audio element.
                                        </audio>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-600">No past records found.</p>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default SpeakingPage;