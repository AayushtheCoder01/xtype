export type Theme = {
  name: string;
  colors: {
    background: string;
    text: string;
    correct: string;
    incorrect: string;
    caret: string;
    accent: string;
    header: string;
    modeBar: string;
    stats: string;
    button: string;
    buttonText: string;
    buttonHover: string;
  };
};

export const themes: Theme[] = [
  {
    name: 'Dark',
    colors: {
      background: '#23272f',
      text: '#bfc7d5',
      correct: '#4af2a1',
      incorrect: '#f25f5c',
      caret: '#4af2a1',
      accent: '#4af2a1',
      header: 'rgba(35,39,47,0.55)',
      modeBar: 'rgba(35,39,47,0.7)',
      stats: '#6c7380',
      button: '#23272f',
      buttonText: '#4af2a1',
      buttonHover: '#4af2a1',
    },
  },
  {
    name: 'Light',
    colors: {
      background: '#f7f7fa',
      text: '#23272f',
      correct: '#2ecc71',
      incorrect: '#e74c3c',
      caret: '#2ecc71',
      accent: '#2ecc71',
      header: '#f7f7fa',
      modeBar: '#eaeaea',
      stats: '#bfc7d5',
      button: '#eaeaea',
      buttonText: '#2ecc71',
      buttonHover: '#2ecc71',
    },
  },
  {
    name: 'Ocean',
    colors: {
      background: '#0f2027',
      text: '#b2f7ef',
      correct: '#21e6c1',
      incorrect: '#ff6f61',
      caret: '#21e6c1',
      accent: '#21e6c1',
      header: 'rgba(15,32,39,0.55)',
      modeBar: 'rgba(15,32,39,0.7)',
      stats: '#3aafa9',
      button: '#172a3a',
      buttonText: '#21e6c1',
      buttonHover: '#3aafa9',
    },
  },
  {
    name: 'Midnight',
    colors: {
      background: '#191970',
      text: '#e0e7ff',
      correct: '#7f9cf5',
      incorrect: '#f56565',
      caret: '#7f9cf5',
      accent: '#7f9cf5',
      header: 'rgba(25,25,112,0.55)',
      modeBar: 'rgba(25,25,112,0.7)',
      stats: '#a3bffa',
      button: '#232946',
      buttonText: '#7f9cf5',
      buttonHover: '#a3bffa',
    },
  },
  {
    name: 'Sakura',
    colors: {
      background: '#fff1f7',
      text: '#23272f',
      correct: '#ff8fab',
      incorrect: '#ff6f61',
      caret: '#ff8fab',
      accent: '#ff8fab',
      header: 'rgba(255,241,247,0.55)',
      modeBar: 'rgba(255,241,247,0.7)',
      stats: '#ffb3c6',
      button: '#ffe5ec',
      buttonText: '#ff8fab',
      buttonHover: '#ffb3c6',
    },
  },
  {
    name: 'Solarized',
    colors: {
      background: '#fdf6e3',
      text: '#657b83',
      correct: '#859900',
      incorrect: '#dc322f',
      caret: '#b58900',
      accent: '#268bd2',
      header: 'rgba(253,246,227,0.55)',
      modeBar: 'rgba(253,246,227,0.7)',
      stats: '#93a1a1',
      button: '#eee8d5',
      buttonText: '#268bd2',
      buttonHover: '#b58900',
    },
  },
  {
    name: 'Matrix',
    colors: {
      background: '#0f0f0f',
      text: '#00ff41',
      correct: '#00ff41',
      incorrect: '#ff005a',
      caret: '#00ff41',
      accent: '#00ff41',
      header: 'rgba(15,15,15,0.55)',
      modeBar: 'rgba(15,15,15,0.7)',
      stats: '#00ff41',
      button: '#23272f',
      buttonText: '#00ff41',
      buttonHover: '#00ff41',
    },
  },
  {
    name: 'Glass',
    colors: {
      background: 'rgba(255,255,255,0.02)',
      text: 'rgba(255,255,255,0.9)',
      correct: 'rgba(46,204,113,0.8)',
      incorrect: 'rgba(231,76,60,0.8)',
      caret: 'rgba(46,204,113,0.8)',
      accent: 'rgba(255,255,255,0.1)',
      header: 'rgba(255,255,255,0.02)',
      modeBar: 'rgba(255,255,255,0.05)',
      stats: 'rgba(255,255,255,0.15)',
      button: 'rgba(255,255,255,0.1)',
      buttonText: 'rgba(46,204,113,0.8)',
      buttonHover: 'rgba(46,204,113,1)',
    },
  },
  {
    name: 'Neon',
    colors: {
      background: 'rgba(0,0,0,0.8)',
      text: 'rgba(255,255,255,0.9)',
      correct: 'rgba(0,255,255,0.8)',
      incorrect: 'rgba(255,0,255,0.8)',
      caret: 'rgba(0,255,255,0.8)',
      accent: 'rgba(0,255,255,0.1)',
      header: 'rgba(0,0,0,0.8)',
      modeBar: 'rgba(255,0,255,0.05)',
      stats: 'rgba(255,0,255,0.15)',
      button: 'rgba(0,255,255,0.1)',
      buttonText: 'rgba(0,255,255,0.8)',
      buttonHover: 'rgba(0,255,255,1)',
    },
  },
  {
    name: 'Sunset',
    colors: {
      background: 'rgba(0,0,0,0.8)',
      text: 'rgba(255,255,255,0.9)',
      correct: 'rgba(255,165,0,0.8)',
      incorrect: 'rgba(255,69,0,0.8)',
      caret: 'rgba(255,165,0,0.8)',
      accent: 'rgba(255,165,0,0.1)',
      header: 'rgba(0,0,0,0.8)',
      modeBar: 'rgba(255,69,0,0.05)',
      stats: 'rgba(255,69,0,0.15)',
      button: 'rgba(255,165,0,0.1)',
      buttonText: 'rgba(255,165,0,0.8)',
      buttonHover: 'rgba(255,165,0,1)',
    },
  },
]; 