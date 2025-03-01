import { useState, useEffect, lazy, Suspense, useRef } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Confetti from 'react-confetti'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'
import { diffWords } from 'diff'
// 导入JSON响应数据
import responseData from './response.json'
// 导入组件
import Header from './components/Header'
import HeroSection from './components/HeroSection'
import EnhancedInputSection from './components/EnhancedInputSection'
import ResultSection from './components/ResultSection'
import CorrectionsTable from './components/CorrectionsTable'
import LearningSection from './components/LearningSection'
import Footer from './components/Footer'
import Tooltip from './components/Tooltip'
import HistoryPanel from './components/HistoryPanel'

// 懒加载较大的组件
const LazyLearningSection = lazy(() => import('./components/LearningSection'));

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

// 加载中状态组件
const LoadingFallback = () => (
  <div className="flex justify-center items-center p-8">
    <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
  </div>
);

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
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipText, setTooltipText] = useState('');
  const [tooltipX, setTooltipX] = useState(0);
  const [tooltipY, setTooltipY] = useState(0);
  const tooltipTimeoutRef = useRef(null);
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
  const [showHeroSection, setShowHeroSection] = useState(true)

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
      // 隐藏Hero部分
      setShowHeroSection(false)
      // 滚动到输入区域
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }

  // 开始体验 - 从Hero部分跳转到输入区
  const handleGetStarted = () => {
    setShowHeroSection(false)
    // 滚动到输入区域
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
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
  
  // 移除保存的规则
  const removeRule = (correction: Correction) => {
    setSavedRules(prev => 
      prev.filter(rule => 
        !(rule.original === correction.original && rule.corrected === correction.corrected)
      )
    )
    toast.info('规则已移除', {
      position: "top-right",
      autoClose: 2000
    })
  }
  
  // 清空输入文本
  const clearInputText = () => {
    setInputText('')
    setCorrectedText('')
    setDiffResult([])
    setCorrections([])
  }
  
  // 清空历史记录
  const clearHistory = () => {
    setHistory([])
    toast.info('历史记录已清空', {
      position: "top-right",
      autoClose: 2000
    })
  }
  
  // 显示工具提示
  const showTooltip = (text: string, x: number, y: number) => {
    // 清除之前的timeout
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
      tooltipTimeoutRef.current = null;
    }
    
    setTooltipText(text);
    setTooltipX(x);
    setTooltipY(y);
    setTooltipVisible(true);
  };

  // 隐藏工具提示
  const hideTooltip = () => {
    // 不使用延迟，让ResultSection组件控制防抖
    setTooltipVisible(false);
  };

  // 组件卸载时清理timeout
  useEffect(() => {
    return () => {
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
    };
  }, []);

  // 页面过渡动画
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { duration: 0.5 }
    },
    exit: { opacity: 0 }
  };

  return (
    <div className="app-container">
      <Header 
        theme={theme} 
        toggleTheme={toggleTheme} 
        showHistory={() => setShowHistory(true)}
        showSavedRules={() => setShowSavedRules(true)}
      />
      
      <motion.main 
        className="main-content"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <div className="container">
          <AnimatePresence mode="wait">
            {showHeroSection ? (
              <motion.div
                key="hero"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <HeroSection onGetStarted={handleGetStarted} />
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                <EnhancedInputSection
                  inputText={inputText}
                  setInputText={setInputText}
                  handleOptimize={handleOptimize}
                  isLoading={isLoading}
                  useExampleText={useExampleText}
                  exampleText={exampleText}
                />
                
                {correctedText && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <ResultSection 
                      original={inputText}
                      corrected={correctedText}
                      diffResult={diffResult}
                      showTooltip={showTooltip}
                      hideTooltip={hideTooltip}
                    />
                    
                    <CorrectionsTable 
                      corrections={corrections} 
                      saveRule={saveRule}
                    />
                    
                    <Suspense fallback={<LoadingFallback />}>
                      <LearningSection 
                        savedRules={savedRules} 
                        removeRule={removeRule}
                        showSavedRules={showSavedRules}
                      />
                    </Suspense>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          
          {showConfetti && <Confetti numberOfPieces={150} recycle={false} />}
        </div>
      </motion.main>
      
      <Footer />
      
      <Tooltip 
        visible={tooltipVisible} 
        text={tooltipText} 
        x={tooltipX} 
        y={tooltipY} 
      />
      
      <AnimatePresence>
        {showHistory && (
          <HistoryPanel 
            history={history}
            loadFromHistory={loadFromHistory}
            clearHistory={clearHistory}
            onClose={() => setShowHistory(false)}
          />
        )}
      </AnimatePresence>
      
      <ToastContainer />
    </div>
  )
}

export default App
