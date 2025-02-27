import { useState, useRef, useEffect } from 'react'
import './App.css'
import { diffWords } from 'diff'
// 导入JSON响应数据
import responseData from './response.json'
// 导入SVG图标
import aiiaLogo from './assets/aiia.svg'

interface Correction {
  original: string;
  corrected: string;
  explanation: string;
  rule?: string;
  examples?: string[];
}

interface DiffPart {
  value: string;
  added?: boolean;
  removed?: boolean;
  explanation?: string;
}

// 定义API响应的接口
interface ApiResponse {
  success: boolean;
  data: {
    original_text: string;
    corrected_text: string;
    diff: DiffPart[];
    corrections: Correction[];
    metadata: {
      correction_count: number;
      confidence_score: number;
      processing_time_ms: number;
    }
  }
}

function App() {
  const [theme, setTheme] = useState('light')
  const [inputText, setInputText] = useState('')
  const [correctedText, setCorrectedText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [diffResult, setDiffResult] = useState<DiffPart[]>([])
  const [corrections, setCorrections] = useState<Correction[]>([])
  const [tooltip, setTooltip] = useState({ visible: false, text: '', x: 0, y: 0 })

  // 模拟API请求获取语法优化结果
  const optimizeGrammar = async (text: string) => {
    setIsLoading(true)
    
    // 模拟API请求延迟
    setTimeout(() => {
      try {
        // 使用导入的JSON响应数据
        const response = responseData as ApiResponse;
        
        if (response.success) {
          // 设置修正后的文本
          setCorrectedText(response.data.corrected_text);
          
          // 设置差异结果
          setDiffResult(response.data.diff);
          
          // 设置修正说明
          setCorrections(response.data.corrections);
        } else {
          console.error('API请求失败');
          // 可以在这里添加错误处理逻辑
        }
      } catch (error) {
        console.error('处理数据时出错:', error);
      } finally {
        setIsLoading(false);
      }
    }, 1000); // 模拟1秒的API延迟
  }

  // 示例文本 - 直接从JSON中获取
  const exampleText = responseData.data.original_text;

  // 使用示例文本
  const useExampleText = () => {
    setInputText(exampleText)
  }

  const handleOptimize = () => {
    if (inputText.trim()) {
      optimizeGrammar(inputText)
    }
  }

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  // 创建全局提示框元素
  useEffect(() => {
    // 这段代码可以删除，我们将使用React状态管理提示框
    // 但为了不破坏现有代码，可以暂时保留
  }, []);

  // 修改为使用React状态显示全局提示框
  const showTooltip = (event: React.MouseEvent<HTMLSpanElement>) => {
    const element = event.currentTarget;
    const explanation = element.getAttribute('data-explanation');
    
    if (explanation && explanation.trim() !== '') {
      const rect = element.getBoundingClientRect();
      setTooltip({
        visible: true,
        text: explanation,
        x: rect.left + rect.width / 2,
        y: rect.bottom + 10
      });
    }
  };

  // 修改为使用React状态隐藏全局提示框
  const hideTooltip = () => {
    setTooltip(prev => ({ ...prev, visible: false }));
  };

  return (
    <div className={`app-container ${theme}`}>
      {/* 头部导航区 */}
      <header className="app-header">
        <div className="container">
          <div className="header-content">
            <div className="logo-container">
              <a href="https://ai-ia.cc" className="home-link">
                <img src={aiiaLogo} alt="Ai-iA Logo" className="logo-image" />
                <div className="logo">
                  <span className="logo-text">JustSay</span>
                  <span className="badge">Beta</span>
                </div>
              </a>
            </div>
            <div className="theme-toggle" onClick={toggleTheme}>
              {theme === 'light' ? (
                <svg className="moon-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg className="sun-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          <div className="hero-section">
            <h1 className="main-title">
              <span className="gradient-text">JustSay</span>
              <span className="title-divider">|</span>
              <span className="subtitle-text">英文语法优化助手</span>
            </h1>
            <p className="hero-description">
              输入英文文本，获取语法修正和学习建议。让我们帮助你提升英语写作水平！
            </p>
          </div>
          
          <div className="input-section">
            <div className="card input-card">
              <div className="card-header">
                <h2 className="card-title">
                  <svg className="section-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  输入您想要优化的英文句子
                </h2>
              </div>
              <div className="card-body">
                <div className="input-wrapper">
                  <textarea 
                    className="text-input" 
                    placeholder="例如: I go to school yesterday. She have a cat. They is happy..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                  ></textarea>
                  <div className="input-footer">
                    <button 
                      className="sample-btn"
                      onClick={useExampleText}
                    >
                      <svg className="sample-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15.75 17.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25m-.386 6.364l-1.591 1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      使用示例文本
                    </button>
                    <button 
                      className={`optimize-btn ${isLoading ? 'loading' : ''}`}
                      onClick={handleOptimize}
                      disabled={isLoading || !inputText.trim()}
                    >
                      {isLoading ? (
                        <>
                          <div className="spinner"></div>
                          优化中...
                        </>
                      ) : (
                        <>
                          <svg className="optimize-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          优化语法
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {diffResult.length > 0 && (
            <div className="result-section animate-fade-in">
              <div className="card result-card">
                <div className="card-header">
                  <h2 className="card-title">
                    <svg className="section-icon success-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4.5 12.75l6 6 9-13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    优化结果
                  </h2>
                </div>
                <div className="card-body">
                  <div className="result-text">
                    {diffResult.map((part, index) => {
                      if (part.removed) {
                        return (
                          <span 
                            key={index} 
                            className="text-error"
                            data-explanation={part.explanation || ''}
                            onMouseEnter={showTooltip}
                            onMouseLeave={hideTooltip}
                          >
                            {part.value}
                            {part.explanation && <span className="error-indicator">?</span>}
                          </span>
                        );
                      } else if (part.added) {
                        return (
                          <span 
                            key={index} 
                            className="text-success"
                            data-explanation={part.explanation || ''}
                            onMouseEnter={showTooltip}
                            onMouseLeave={hideTooltip}
                          >
                            {part.value}
                            {part.explanation && <span className="success-indicator">✓</span>}
                          </span>
                        );
                      } else {
                        return <span key={index}>{part.value}</span>;
                      }
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {corrections.length > 0 && (
            <div className="corrections-section animate-fade-in">
              <div className="card corrections-card">
                <div className="card-header">
                  <h2 className="card-title">
                    <svg className="section-icon info-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    详细修正说明
                  </h2>
                </div>
                <div className="card-body">
                  <div className="table-container">
                    <table className="corrections-table">
                      <thead>
                        <tr>
                          <th>原文</th>
                          <th>修正</th>
                          <th>解释</th>
                        </tr>
                      </thead>
                      <tbody>
                        {corrections.map((correction, index) => (
                          <tr key={index}>
                            <td className="original-text">{correction.original}</td>
                            <td className="corrected-text">{correction.corrected}</td>
                            <td className="explanation-text">{correction.explanation}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {corrections.length > 0 && (
            <div className="learning-section animate-fade-in">
              <div className="card learning-card">
                <div className="card-header">
                  <h2 className="card-title">
                    <svg className="section-icon warning-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4.26 10.147a60.436 60.436 0 008.716-6.747M12 21a9.004 9.004 0 008.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    语法规则学习
                  </h2>
                </div>
                <div className="card-body">
                  <div className="learning-grid">
                    {corrections.filter(c => c.rule).map((correction, index) => (
                      <div key={index} className="rule-card">
                        <div className="rule-header">
                          <div className="rule-change">
                            <span className="original">{correction.original}</span>
                            <svg className="arrow-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span className="corrected">{correction.corrected}</span>
                          </div>
                        </div>
                        <p className="rule-explanation">{correction.explanation}</p>
                        {correction.rule && (
                          <div className="rule-box">
                            <p className="rule-title">📝 语法规则:</p>
                            <p className="rule-content">{correction.rule}</p>
                          </div>
                        )}
                        {correction.examples && correction.examples.length > 0 && (
                          <div className="examples-container">
                            <p className="examples-title">✨ 例句:</p>
                            <ul className="examples-list">
                              {correction.examples.map((example, i) => (
                                <li key={i} className="example-item">{example}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <svg className="globe-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>2025 JustSay - 英文语法优化助手</span>
            </div>
          </div>
        </div>
      </footer>
      
      {/* 添加动态的提示框 */}
      {tooltip.visible && (
        <div 
          className="custom-tooltip"
          style={{ 
            left: `${tooltip.x}px`, 
            top: `${tooltip.y}px`
          }}
        >
          {tooltip.text}
          <div className="tooltip-arrow"></div>
        </div>
      )}
    </div>
  )
}

export default App
