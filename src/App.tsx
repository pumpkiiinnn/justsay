import { useState, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Confetti from 'react-confetti'
import './App.css'
import { diffWords } from 'diff'
// 导入JSON响应数据
import responseData from './response.json'
// 导入组件
import Header from './components/Header'
import InputSection from './components/InputSection'
import ResultSection from './components/ResultSection'
import CorrectionsTable from './components/CorrectionsTable'
import LearningSection from './components/LearningSection'
import Footer from './components/Footer'
import Tooltip from './components/Tooltip'
import HistoryPanel from './components/HistoryPanel'

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
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('justsay-theme')
    return savedTheme || 'light'
  })
  const [inputText, setInputText] = useState('')
  const [correctedText, setCorrectedText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [diffResult, setDiffResult] = useState<DiffPart[]>([])
  const [corrections, setCorrections] = useState<Correction[]>([])
  const [tooltip, setTooltip] = useState({ visible: false, text: '', x: 0, y: 0 })
  const [showConfetti, setShowConfetti] = useState(false)
  const [history, setHistory] = useState<{text: string, date: string}[]>(() => {
    const savedHistory = localStorage.getItem('justsay-history')
    return savedHistory ? JSON.parse(savedHistory) : []
  })
  const [savedRules, setSavedRules] = useState<Correction[]>(() => {
    const savedRules = localStorage.getItem('justsay-saved-rules')
    return savedRules ? JSON.parse(savedRules) : []
  })
  const [showHistory, setShowHistory] = useState(false)
  const [showSavedRules, setShowSavedRules] = useState(false)

  // 保存主题设置到本地存储
  useEffect(() => {
    localStorage.setItem('justsay-theme', theme)
    document.body.className = theme
  }, [theme])

  // 保存历史记录到本地存储
  useEffect(() => {
    try {
      localStorage.setItem('justsay-history', JSON.stringify(history))
    } catch (error) {
      console.error('保存历史记录失败:', error)
      toast.error('保存历史记录失败', {
        position: "top-right",
        autoClose: 3000
      })
    }
  }, [history])

  // 保存收藏的规则到本地存储
  useEffect(() => {
    try {
      localStorage.setItem('justsay-saved-rules', JSON.stringify(savedRules))
    } catch (error) {
      console.error('保存规则失败:', error)
      toast.error('保存规则失败', {
        position: "top-right",
        autoClose: 3000
      })
    }
  }, [savedRules])

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
          
          // 添加到历史记录
          const now = new Date()
          setHistory(prev => [{ text, date: now.toLocaleString() }, ...prev.slice(0, 9)])
          
          // 显示成功提示和庆祝效果
          toast.success('语法优化成功！', {
            position: "top-right",
            autoClose: 3000
          })
          
          // 触发庆祝效果
          setShowConfetti(true)
          setTimeout(() => setShowConfetti(false), 3000)
        } else {
          console.error('API请求失败');
          toast.error('优化失败，请稍后再试', {
            position: "top-right",
            autoClose: 3000
          })
        }
      } catch (error) {
        console.error('处理数据时出错:', error);
        toast.error('处理数据时出错', {
          position: "top-right",
          autoClose: 3000
        })
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
  
  // 从历史记录中加载文本
  const loadFromHistory = (text: string) => {
    setInputText(text)
    setShowHistory(false)
    toast.info('已从历史记录加载文本', {
      position: "top-right",
      autoClose: 2000
    })
  }
  
  // 保存语法规则
  const saveRule = (correction: Correction) => {
    // 检查是否已经保存过
    const alreadySaved = savedRules.some(rule => 
      rule.original === correction.original && rule.corrected === correction.corrected
    )
    
    if (!alreadySaved) {
      setSavedRules(prev => [correction, ...prev])
      toast.success('规则已保存', {
        position: "top-right",
        autoClose: 2000
      })
    } else {
      toast.info('该规则已保存', {
        position: "top-right",
        autoClose: 2000
      })
    }
  }
  
  // 删除保存的规则
  const removeRule = (index: number) => {
    setSavedRules(prev => prev.filter((_, i) => i !== index))
    toast.info('规则已删除', {
      position: "top-right",
      autoClose: 2000
    })
  }

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
        y: rect.top - 10 // 向上偏移一点，确保tooltip显示在单词上方
      });
    }
  };

  // 修改为使用React状态隐藏全局提示框
  const hideTooltip = () => {
    setTooltip(prev => ({ ...prev, visible: false }));
  };

  return (
    <div className={`app-container ${theme}`}>
      {/* 显示庆祝效果 */}
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
        />
      )}
      
      {/* 头部导航区 */}
      <Header 
        theme={theme} 
        toggleTheme={toggleTheme} 
        setShowHistory={setShowHistory}
        setShowSavedRules={setShowSavedRules}
      />

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
          
          <InputSection 
            inputText={inputText}
            setInputText={setInputText}
            isLoading={isLoading}
            handleOptimize={handleOptimize}
            useExampleText={useExampleText}
          />
          
          {/* 显示结果区域 */}
          {correctedText && (
            <>
              <ResultSection 
                diffResult={diffResult}
                showTooltip={showTooltip}
                hideTooltip={hideTooltip}
              />
              
              <CorrectionsTable corrections={corrections} />
              
              <LearningSection corrections={corrections} />
            </>
          )}
        </div>
      </main>
      
      <Footer />
      
      {/* 历史记录和保存规则面板 */}
      <HistoryPanel
        showHistory={showHistory}
        setShowHistory={setShowHistory}
        showSavedRules={showSavedRules}
        setShowSavedRules={setShowSavedRules}
        history={history}
        savedRules={savedRules}
        loadFromHistory={loadFromHistory}
        removeRule={removeRule}
      />
      
      {/* 全局提示框 */}
      <Tooltip 
        visible={tooltip.visible}
        text={tooltip.text}
        x={tooltip.x}
        y={tooltip.y}
      />
      
      {/* 通知提示 */}
      <ToastContainer />
    </div>
  )
}

export default App
