import { useState, useEffect, useRef } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom'
import './App.css'
import { themes } from './themes'
import type { Theme } from './themes'

const WORDS = [
  "still", "which", "never", "people", "with", "same", "turn", "public", "during", "seem", "change",
  "first", "head", "under", "follow", "come", "under", "between", "this", "when", "year", "these", "down",
  "now", "point", "against", "no", "but", "know", "back", "very", "real", "late", "hand", "another", "run"
];
const NUMBERS = Array.from({length: 40}, () => Math.floor(Math.random() * 10000).toString());
const QUOTES = [
  "The only way to do great work is to love what you do.",
  "Simplicity is the soul of efficiency.",
  "Code is like humor. When you have to explain it, it's bad.",
  "Experience is the name everyone gives to their mistakes."
];
const PUNCTUATION = [
  "hello,", "world!", "how", "are", "you?", "let's", "code.", "typing,", "test!", "great.", "isn't", "it?"
];

const CONTENT_OPTIONS = ["words", "numbers", "punctuation", "quote"];
const TEST_TYPES = ["time", "words"];
const TIMES = [15, 30, 60, 120];
const WORD_COUNTS = [10, 25, 50, 100];

function generateTestWords(selectedContent: string[], wordCount: number) {
  let pool: string[] = [];
  if (selectedContent.includes('words')) pool = pool.concat(WORDS);
  if (selectedContent.includes('numbers')) pool = pool.concat(NUMBERS);
  if (selectedContent.includes('punctuation')) pool = pool.concat(PUNCTUATION);
  if (selectedContent.includes('quote')) {
    const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)].split(' ');
    pool = pool.concat(quote);
  }
  if (pool.length === 0) pool = WORDS;
  // Shuffle and pick wordCount
  const shuffled = pool.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, wordCount);
}

function useAuth() {
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem('xuser');
    return u ? JSON.parse(u) : null;
  });
  const signin = (username: string) => {
    setUser({ username });
    localStorage.setItem('xuser', JSON.stringify({ username }));
  };
  const signout = () => {
    setUser(null);
    localStorage.removeItem('xuser');
  };
  return { user, signin, signout };
}

function TypingTest({
  currentTheme,
  setCurrentTheme,
  user
}: {
  currentTheme: Theme,
  setCurrentTheme: (t: Theme) => void,
  user: any
}) {
  // Settings
  const [testType, setTestType] = useState<'time' | 'words'>('time');
  const [selectedContent, setSelectedContent] = useState<string[]>(['words']);
  const [time, setTime] = useState(15);
  const [wordCount, setWordCount] = useState(25);

  // Test state
  const [words, setWords] = useState(generateTestWords(['words'], 25));
  const [userInput, setUserInput] = useState('')
  const [timeLeft, setTimeLeft] = useState(15)
  const [isActive, setIsActive] = useState(false)
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [caretIndex, setCaretIndex] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [focusMode, setFocusMode] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Advanced stats
  const [keystrokes, setKeystrokes] = useState(0)
  const [correctKeystrokes, setCorrectKeystrokes] = useState(0)
  const [incorrectKeystrokes, setIncorrectKeystrokes] = useState(0)
  const [backspaces, setBackspaces] = useState(0)
  const [wordTimes, setWordTimes] = useState<number[]>([])
  const [wordStartTime, setWordStartTime] = useState<number | null>(null)
  const [perWordAccuracy, setPerWordAccuracy] = useState<number[]>([])

  useEffect(() => {
    document.body.style.background = currentTheme.colors.background;
    document.body.style.color = currentTheme.colors.text;
  }, [currentTheme]);

  useEffect(() => {
    setWords(generateTestWords(selectedContent, wordCount));
    setUserInput('');
    setCaretIndex(0);
    setIsActive(false);
    setWpm(0);
    setAccuracy(100);
    setTimeLeft(time);
    setShowResult(false);
    setFocusMode(false);
    setKeystrokes(0);
    setCorrectKeystrokes(0);
    setIncorrectKeystrokes(0);
    setBackspaces(0);
    setWordTimes([]);
    setWordStartTime(null);
    setPerWordAccuracy([]);
  }, [selectedContent, wordCount, time, testType]);

  useEffect(() => {
    setTimeLeft(time);
    setShowResult(false);
    setFocusMode(false);
  }, [time]);

  useEffect(() => {
    let interval: number | undefined
    if (isActive && timeLeft > 0 && !showResult && testType === 'time') {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (((timeLeft === 0 && testType === 'time') || (isTestComplete() && testType === 'words')) && isActive && !showResult) {
      setIsActive(false)
      calculateResults()
      setShowResult(true)
      setFocusMode(false)
    }
    return () => clearInterval(interval)
  }, [isActive, timeLeft, showResult, testType])

  function isTestComplete() {
    // All chars typed or all words typed
    const joinedWords = words.join(' ');
    return userInput.trim().length >= joinedWords.length;
  }

  const calculateResults = () => {
    const wordsTyped = userInput.trim().split(/\s+/).length
    const minutes = (testType === 'time' ? (time - timeLeft) : time) / 60
    setWpm(minutes > 0 ? Math.round(wordsTyped / minutes) : 0)
    let correctChars = 0
    let perWordAcc: number[] = []
    const joinedWords = words.join(' ')
    let userWords = userInput.trim().split(' ')
    words.forEach((word, i) => {
      let correct = 0
      let uword = userWords[i] || ''
      for (let j = 0; j < uword.length; j++) {
        if (uword[j] === word[j]) correct++
      }
      perWordAcc.push(word.length ? Math.round((correct / word.length) * 100) : 0)
    })
    setPerWordAccuracy(perWordAcc)
    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] === joinedWords[i]) correctChars++
    }
    setAccuracy(userInput.length > 0 ? Math.round((correctChars / userInput.length) * 100) : 100)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    // Prevent double spaces
    value = value.replace(/\s{2,}/g, ' ')
    if (!isActive && ((testType === 'time' && timeLeft > 0) || (testType === 'words' && !showResult))) {
      setIsActive(true)
      setFocusMode(true)
      setWordStartTime(Date.now())
    }
    // Track keystrokes
    if (value.length > userInput.length) {
      setKeystrokes(k => k + 1)
      const idx = value.length - 1
      const joinedWords = words.join(' ')
      if (value[idx] === joinedWords[idx]) setCorrectKeystrokes(c => c + 1)
      else setIncorrectKeystrokes(c => c + 1)
    }
    // Track backspaces
    if (value.length < userInput.length) {
      setBackspaces(b => b + 1)
    }
    // Track word times
    if (value.endsWith(' ') && value.length > userInput.length) {
      if (wordStartTime) {
        setWordTimes(wt => [...wt, Date.now() - wordStartTime])
      }
      setWordStartTime(Date.now())
    }
    setUserInput(value)
    setCaretIndex(value.length)
    if (testType === 'words' && value.length >= words.join(' ').length && isActive) {
      setIsActive(false)
      calculateResults()
      setShowResult(true)
      setFocusMode(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      if (focusMode) {
        resetTest();
      }
    }
  }

  const resetTest = () => {
    setUserInput('')
    setTimeLeft(time)
    setIsActive(false)
    setWpm(0)
    setAccuracy(100)
    setCaretIndex(0)
    setWords(generateTestWords(selectedContent, wordCount))
    setShowResult(false)
    setFocusMode(false)
    setKeystrokes(0)
    setCorrectKeystrokes(0)
    setIncorrectKeystrokes(0)
    setBackspaces(0)
    setWordTimes([])
    setWordStartTime(null)
    setPerWordAccuracy([])
    if (inputRef.current) inputRef.current.focus()
  }

  // Render words with spaces and caret
  const joinedWords = words.join(' ')
  let caretPlaced = false
  const currentWordIdx = (() => {
    const typed = userInput.trimEnd().split(' ');
    return Math.max(0, typed.length - (userInput.endsWith(' ') ? 0 : 1));
  })();
  const textNodes = joinedWords.split(' ').map((word, wIdx) => {
    const chars = word.split('').map((char, cIdx) => {
      const idx = words.slice(0, wIdx).join(' ').length + (wIdx > 0 ? 1 : 0) + cIdx;
      let className = 'char';
      if (idx < userInput.length) {
        className += userInput[idx] === joinedWords[idx] ? ' correct' : ' incorrect';
      }
      let caret = null;
      if (idx === caretIndex && !caretPlaced && isActive && !showResult) {
        caret = <span className="caret" key={"caret"} style={{background: currentTheme.colors.caret, transition: 'background 0.2s'}} />;
        caretPlaced = true;
      }
      return <span key={cIdx}>{caret}<span className={className}>{char}</span></span>;
    });
    // Add space after each word except the last
    const spaceIdx = words.slice(0, wIdx + 1).join(' ').length;
    let spaceCaret = null;
    if (spaceIdx === caretIndex && !caretPlaced && isActive && !showResult && wIdx < words.length - 1) {
      spaceCaret = <span className="caret" key={"caret-space" + wIdx} style={{background: currentTheme.colors.caret, transition: 'background 0.2s'}} />;
      caretPlaced = true;
    }
    return <span className={"word" + (wIdx === currentWordIdx && isActive && !showResult ? " current" : "")} key={wIdx}>{chars}{wIdx < words.length - 1 && <span>&nbsp;{spaceCaret}</span>}</span>;
  });
  if (caretIndex === joinedWords.length && isActive && !showResult) {
    textNodes.push(<span className="caret" key="caret-end" style={{background: currentTheme.colors.caret, transition: 'background 0.2s'}} />)
  }

  // UI for selecting content options
  const contentSelectors = CONTENT_OPTIONS.map(opt => (
    <label key={opt} style={{marginRight: 12, cursor: 'pointer'}}>
      <input
        type="checkbox"
        checked={selectedContent.includes(opt)}
        onChange={() => {
          setSelectedContent(selectedContent.includes(opt)
            ? selectedContent.filter(o => o !== opt)
            : [...selectedContent, opt]);
        }}
      /> {opt.charAt(0).toUpperCase() + opt.slice(1)}
    </label>
  ));

  // UI for selecting test type
  const testTypeSelectors = TEST_TYPES.map(type => (
    <label key={type} style={{marginRight: 16, cursor: 'pointer', fontWeight: testType === type ? 'bold' : 'normal'}}>
      <input
        type="radio"
        checked={testType === type}
        onChange={() => setTestType(type as 'time' | 'words')}
      /> {type.charAt(0).toUpperCase() + type.slice(1)}
    </label>
  ));

  // Advanced results
  const bestWordIdx = perWordAccuracy.length ? perWordAccuracy.indexOf(Math.max(...perWordAccuracy)) : -1;
  const worstWordIdx = perWordAccuracy.length ? perWordAccuracy.indexOf(Math.min(...perWordAccuracy)) : -1;
  const avgWordTime = wordTimes.length ? Math.round(wordTimes.reduce((a, b) => a + b, 0) / wordTimes.length) : 0;

  return (
    <div className="app-outer-center">
      {!focusMode && (
        <>
          <div className="header" style={{background: currentTheme.colors.header, color: currentTheme.colors.text}}>
            <div className="logo">
              <span style={{fontWeight: 900, fontSize: '1.5rem', color: currentTheme.colors.accent}}>m</span>
              <span>monkeytype</span>
            </div>
            <div className="header-icons">
              <span>⌨️</span>
              <span>🏆</span>
              <span>ℹ️</span>
              <Link to="/settings" style={{cursor: 'pointer', color: 'inherit', textDecoration: 'none'}}>⚙️</Link>
              {user ? (
                <Link to="/account" style={{cursor: 'pointer', color: 'inherit', textDecoration: 'none', marginLeft: 8}}>👤</Link>
              ) : (
                <Link to="/signin" style={{cursor: 'pointer', color: 'inherit', textDecoration: 'none', marginLeft: 8}}>Sign In / Sign Up</Link>
              )}
            </div>
          </div>
          <div className="mode-bar" style={{background: currentTheme.colors.modeBar, color: currentTheme.colors.stats, justifyContent: 'center', textAlign: 'center'}}>
            <div style={{marginBottom: 8}}>{testTypeSelectors}</div>
            <div style={{marginBottom: 8}}>{contentSelectors}</div>
            <div style={{marginBottom: 8}}>
              {testType === 'time' ? TIMES.map(t => (
                <span key={t} className={time === t ? 'active' : ''} style={{cursor: 'pointer', color: time === t ? currentTheme.colors.accent : undefined, marginRight: 8}} onClick={() => { setTime(t); setTimeLeft(t); }}>
                  {t}s
                </span>
              )) : WORD_COUNTS.map(wc => (
                <span key={wc} className={wordCount === wc ? 'active' : ''} style={{cursor: 'pointer', color: wordCount === wc ? currentTheme.colors.accent : undefined, marginRight: 8}} onClick={() => setWordCount(wc)}>
                  {wc} words
                </span>
              ))}
            </div>
          </div>
        </>
      )}
      <div className="typing-test app-center-content" style={{justifyContent: showResult ? 'center' : 'flex-start', minHeight: '50vh'}}>
        {showResult ? (
          <div className="result-modal" style={{background: currentTheme.colors.header, color: currentTheme.colors.text, border: `2px solid ${currentTheme.colors.accent}`}}>
            <h2 style={{textAlign: 'center', marginBottom: '1.5rem'}}>Test Results</h2>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.7rem', fontSize: '1.2rem'}}>
              <div><b>WPM:</b> {wpm}</div>
              <div><b>Accuracy:</b> {accuracy}%</div>
              <div><b>Time:</b> {testType === 'time' ? time : timeLeft}s</div>
              <div><b>Total Keystrokes:</b> {keystrokes}</div>
              <div><b>Correct Keystrokes:</b> {correctKeystrokes}</div>
              <div><b>Incorrect Keystrokes:</b> {incorrectKeystrokes}</div>
              <div><b>Backspaces:</b> {backspaces}</div>
              <div><b>Average Word Time:</b> {avgWordTime} ms</div>
              {bestWordIdx !== -1 && <div><b>Best Word:</b> "{words[bestWordIdx]}" ({perWordAccuracy[bestWordIdx]}%)</div>}
              {worstWordIdx !== -1 && <div><b>Worst Word:</b> "{words[worstWordIdx]}" ({perWordAccuracy[worstWordIdx]}%)</div>}
            </div>
            <button onClick={resetTest} className="reset-button" style={{background: currentTheme.colors.button, color: currentTheme.colors.buttonText, borderColor: currentTheme.colors.accent, marginTop: '2rem'}}>
              Restart
            </button>
          </div>
        ) : (
          <>
            {focusMode && (
              <div style={{fontSize: '4rem', color: currentTheme.colors.accent, marginBottom: '2rem', fontWeight: 700, textAlign: 'center'}}>
                {testType === 'time' ? timeLeft : time}
              </div>
            )}
            <div className="text-display fade-in" onClick={() => inputRef.current?.focus()} style={{color: currentTheme.colors.text, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', minHeight: '120px'}}>
              {textNodes}
            </div>
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={(testType === 'time' && timeLeft === 0) || (testType === 'words' && showResult)}
              className="typing-input"
              autoFocus
            />
            {!focusMode && (
              <>
                <div className="stats" style={{color: currentTheme.colors.stats, justifyContent: 'center', textAlign: 'center'}}>
                  <div>Time: {testType === 'time' ? timeLeft : time}s</div>
                  <div>WPM: {wpm}</div>
                  <div>Accuracy: {accuracy}%</div>
                </div>
                <button onClick={resetTest} className="reset-button" style={{background: currentTheme.colors.button, color: currentTheme.colors.buttonText, borderColor: currentTheme.colors.accent, marginTop: '2rem'}}>
                  Reset Test
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function SettingsPage({ currentTheme, setCurrentTheme }: { currentTheme: Theme, setCurrentTheme: (t: Theme) => void }) {
  return (
    <div className="app-outer-center">
      <div className="header" style={{background: currentTheme.colors.header, color: currentTheme.colors.text}}>
        <div className="logo">
          <span style={{fontWeight: 900, fontSize: '1.5rem', color: currentTheme.colors.accent}}>m</span>
          <span>monkeytype</span>
        </div>
        <div className="header-icons">
          <Link to="/" style={{cursor: 'pointer', color: 'inherit', textDecoration: 'none'}}>🏠 Home</Link>
        </div>
      </div>
      <div className="result-modal" style={{background: currentTheme.colors.header, color: currentTheme.colors.text, border: `2px solid ${currentTheme.colors.accent}`}}>
        <h2 style={{textAlign: 'center', marginBottom: '1.5rem'}}>Settings</h2>
        <div style={{marginBottom: '1rem'}}>Theme:</div>
        <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
          {themes.map(theme => (
            <button
              key={theme.name}
              onClick={() => setCurrentTheme(theme)}
              style={{
                background: currentTheme.name === theme.name ? theme.colors.buttonHover : theme.colors.button,
                color: theme.colors.buttonText,
                border: `2px solid ${theme.colors.accent}`,
                borderRadius: 8,
                padding: '0.5rem 1rem',
                cursor: 'pointer',
                fontWeight: currentTheme.name === theme.name ? 'bold' : 'normal',
              }}
            >
              {theme.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function AccountPage({ user, signout }: { user: any, signout: () => void }) {
  return (
    <div className="app-outer-center">
      <div className="header">
        <div className="logo">monkeytype</div>
        <div className="header-icons">
          <Link to="/" style={{cursor: 'pointer', color: 'inherit', textDecoration: 'none'}}>🏠 Home</Link>
        </div>
      </div>
      <div className="result-modal">
        <h2>Account</h2>
        <div style={{marginBottom: '1rem'}}>Signed in as <b>{user.username}</b></div>
        <button onClick={signout} className="reset-button">Sign Out</button>
      </div>
    </div>
  );
}

function SigninPage({ signin }: { signin: (username: string) => void }) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Username required');
      return;
    }
    signin(username.trim());
    navigate('/');
  };
  return (
    <div className="app-outer-center">
      <div className="result-modal">
        <h2>Sign In / Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Username"
            style={{padding: '0.5rem', fontSize: '1.1rem', marginBottom: 8, width: '100%'}}
            autoFocus
          />
          <div style={{color: 'red', minHeight: 24, marginBottom: 8}}>{error}</div>
          <button type="submit" className="reset-button" style={{width: '100%'}}>Sign In / Sign Up</button>
        </form>
      </div>
    </div>
  );
}

function App() {
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0]);
  const { user, signin, signout } = useAuth();
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TypingTest currentTheme={currentTheme} setCurrentTheme={setCurrentTheme} user={user} />} />
        <Route path="/settings" element={<SettingsPage currentTheme={currentTheme} setCurrentTheme={setCurrentTheme} />} />
        <Route path="/account" element={user ? <AccountPage user={user} signout={signout} /> : <SigninPage signin={signin} />} />
        <Route path="/signin" element={<SigninPage signin={signin} />} />
      </Routes>
    </Router>
  )
}

export default App
