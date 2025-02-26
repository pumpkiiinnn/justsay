import { useState } from 'react'
import './App.css'
import { diffWords } from 'diff'

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

function App() {
  const [theme, setTheme] = useState('cupcake')
  const [inputText, setInputText] = useState('')
  const [correctedText, setCorrectedText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [diffResult, setDiffResult] = useState<DiffPart[]>([])
  const [corrections, setCorrections] = useState<Correction[]>([])

  // 模拟AI优化英文语法的函数
  const optimizeGrammar = async (text: string) => {
    setIsLoading(true)
    
    // 这里应该是调用实际的AI API进行语法优化
    // 以下是模拟数据
    setTimeout(() => {
      // 模拟优化结果
      const optimized = text
        .replace('I go to school yesterday', 'I went to school yesterday')
        .replace('She have a cat', 'She has a cat')
        .replace('They is happy', 'They are happy')
        .replace('I am good in English', 'I am good at English')
        .replace('He don\'t like coffee', 'He doesn\'t like coffee')
        .replace('I have been there since 3 years', 'I have been there for 3 years')
        .replace('She is more taller than me', 'She is taller than me')
        .replace('I did a mistake', 'I made a mistake')
        .replace('I am agree with you', 'I agree with you')
        .replace('I look forward to see you', 'I look forward to seeing you')
      
      // 模拟修正说明
      const sampleCorrections: Correction[] = []
      
      if (text.includes('I go to school yesterday')) {
        sampleCorrections.push({
          original: 'go',
          corrected: 'went',
          explanation: '过去时态应使用动词的过去式。"yesterday"表示过去的时间，因此应使用过去时态。',
          rule: '过去时态用于表示过去发生的动作或状态，通常与表示过去时间的词（如yesterday, last week, two days ago等）一起使用。',
          examples: [
            'I walked to school yesterday.',
            'She studied English last night.',
            'They played football last weekend.'
          ]
        })
      }
      
      if (text.includes('She have a cat')) {
        sampleCorrections.push({
          original: 'have',
          corrected: 'has',
          explanation: '第三人称单数（she, he, it）主语在一般现在时中应使用"has"而不是"have"。',
          rule: '在一般现在时中，第三人称单数（he, she, it）的动词需要加-s或-es。',
          examples: [
            'He works in a bank.',
            'She likes coffee.',
            'It costs five dollars.'
          ]
        })
      }
      
      if (text.includes('They is happy')) {
        sampleCorrections.push({
          original: 'is',
          corrected: 'are',
          explanation: '复数主语（they）应使用复数形式的动词"are"而不是单数形式的"is"。',
          rule: '复数主语需要使用复数形式的动词。be动词的复数形式是are。',
          examples: [
            'They are students.',
            'The children are playing.',
            'My friends are coming to the party.'
          ]
        })
      }
      
      if (text.includes('I am good in English')) {
        sampleCorrections.push({
          original: 'in',
          corrected: 'at',
          explanation: '表达擅长某项技能时，应使用介词"at"而不是"in"。例如：good at languages, good at sports等。',
          rule: '表达擅长或精通某项技能或活动时，通常使用"good at + 名词/动名词"结构。',
          examples: [
            'She is good at swimming.',
            'He is good at mathematics.',
            'They are good at solving problems.'
          ]
        })
      }
      
      if (text.includes('He don\'t like coffee')) {
        sampleCorrections.push({
          original: 'don\'t',
          corrected: 'doesn\'t',
          explanation: '第三人称单数（he）在否定句中应使用"doesn\'t"（does not）而不是"don\'t"（do not）。',
          rule: '在一般现在时的否定句中，第三人称单数（he, she, it）使用"doesn\'t"（does not），而其他人称使用"don\'t"（do not）。',
          examples: [
            'He doesn\'t eat meat.',
            'She doesn\'t like horror movies.',
            'It doesn\'t work properly.'
          ]
        })
      }
      
      if (text.includes('I have been there since 3 years')) {
        sampleCorrections.push({
          original: 'since',
          corrected: 'for',
          explanation: '"since"用于表示从过去某个具体时间点开始，而"for"用于表示一段时间的持续。当提到时间段（如：3年）时，应使用"for"。',
          rule: '表示一段时间的持续时，使用"for + 时间段"结构；表示从过去某个具体时间点开始，使用"since + 时间点"结构。',
          examples: [
            'I have been studying English for three years.',
            'She has been working in the company since 2018.',
            'They have been living in New York for five years.'
          ]
        })
      }
      
      if (text.includes('She is more taller than me')) {
        sampleCorrections.push({
          original: 'more taller',
          corrected: 'taller',
          explanation: '比较级形容词（taller）已经包含了比较的含义，不需要再加"more"。只有多音节形容词才使用"more"+原级形式。',
          rule: '比较级形容词通常不需要加"more"，但多音节形容词可以使用"more"加原级形式来表示比较。',
          examples: [
            'She is taller than me.',
            'He is more beautiful than she.',
            'This cake is more delicious than the one we had yesterday.'
          ]
        })
      }
      
      if (text.includes('I did a mistake')) {
        sampleCorrections.push({
          original: 'did',
          corrected: 'made',
          explanation: '英语中"mistake"通常与动词"make"搭配使用，而不是"do"。这是固定搭配：make a mistake（犯错误）。',
          rule: 'make a mistake是固定搭配，表示犯错误或做错事。其他动词如do, commit等也可以表示犯错误，但make a mistake是最常用的表达。',
          examples: [
            'I made a mistake in the exam.',
            'She did a good job.',
            'He committed a crime.'
          ]
        })
      }
      
      if (text.includes('I am agree with you')) {
        sampleCorrections.push({
          original: 'am agree',
          corrected: 'agree',
          explanation: '"agree"是动词，不需要再加系动词"am"。正确用法是直接使用"I agree"，而不是"I am agree"。',
          rule: 'agree是动词，不需要加系动词"am"。正确用法是直接使用"I agree"，而不是"I am agree"。',
          examples: [
            'I agree with you.',
            'She agrees with me.',
            'They agree on the plan.'
          ]
        })
      }
      
      if (text.includes('I look forward to see you')) {
        sampleCorrections.push({
          original: 'see',
          corrected: 'seeing',
          explanation: '介词"to"后面应接动名词（-ing形式），而不是动词原形。"look forward to"是固定搭配，后面需要接动名词。',
          rule: '介词"to"后面通常接动名词（-ing形式），而不是动词原形。"look forward to"是固定搭配，后面需要接动名词。',
          examples: [
            'I look forward to seeing you.',
            'She is looking forward to going to the party.',
            'They are looking forward to meeting you.'
          ]
        })
      }
      
      setCorrectedText(optimized)
      setCorrections(sampleCorrections)
      
      // 计算差异
      const diff = diffWords(text, optimized)
      
      // 为差异添加解释
      const diffWithExplanation = diff.map(part => {
        const matchingCorrection = sampleCorrections.find(
          c => part.added && part.value.includes(c.corrected) || 
               part.removed && part.value.includes(c.original)
        )
        
        return {
          ...part,
          explanation: matchingCorrection?.explanation
        }
      })
      
      setDiffResult(diffWithExplanation)
      setIsLoading(false)
    }, 1500)
  }

  // 示例文本
  const exampleText = "I go to school yesterday. She have a cat. They is happy. I am good in English. He don't like coffee. I have been there since 3 years. She is more taller than me. I did a mistake. I am agree with you. I look forward to see you."

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
    setTheme(theme === 'cupcake' ? 'dark' : 'cupcake')
  }

  return (
    <div data-theme={theme} className="min-h-screen bg-base-100">
      {/* 导航栏 */}
      <div className="navbar bg-primary text-primary-content shadow-lg">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">
            <span className="brand-gradient">JustSay</span>
          </a>
          <div className="text-sm opacity-80">英文语法优化助手</div>
        </div>
        <div className="flex-none">
          <button className="btn btn-square btn-ghost" onClick={toggleTheme}>
            {theme === 'cupcake' ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className="container mx-auto p-4">
        <h1 className="app-title text-center my-6">
          <span className="brand-gradient">JustSay</span> - 英文语法优化助手
        </h1>
        
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-center">输入您想要优化的英文句子</h2>
            <div className="form-control">
              <textarea 
                className="textarea textarea-bordered h-32" 
                placeholder="例如: I go to school yesterday. She have a cat. They is happy. I am good in English. He don't like coffee. I have been there since 3 years. She is more taller than me. I did a mistake. I am agree with you. I look forward to see you."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              ></textarea>
              <div className="text-right mt-2">
                <button 
                  className="btn btn-sm btn-ghost text-info"
                  onClick={useExampleText}
                >
                  使用示例文本
                </button>
              </div>
            </div>
            <div className="card-actions justify-end mt-4">
              <button 
                className={`btn btn-primary ${isLoading ? 'loading-pulse' : ''}`}
                onClick={handleOptimize}
                disabled={isLoading || !inputText.trim()}
              >
                {isLoading ? '优化中...' : '优化语法'}
              </button>
            </div>
          </div>
        </div>

        {diffResult.length > 0 && (
          <div className="card bg-base-200 shadow-xl mt-6 result-appear">
            <div className="card-body">
              <h2 className="card-title">优化结果</h2>
              <div className="bg-base-100 p-4 rounded-lg correction-container">
                {diffResult.map((part, index) => {
                  if (part.removed) {
                    return (
                      <span key={index} className="deleted-text correction-tooltip">
                        {part.value}
                        {part.explanation && (
                          <span className="correction-indicator">?</span>
                        )}
                        {part.explanation && (
                          <span className="tooltip-text">{part.explanation}</span>
                        )}
                      </span>
                    );
                  } else if (part.added) {
                    return (
                      <span key={index} className="added-text correction-tooltip">
                        {part.value}
                        {part.explanation && (
                          <span className="correction-indicator">✓</span>
                        )}
                        {part.explanation && (
                          <span className="tooltip-text">{part.explanation}</span>
                        )}
                      </span>
                    );
                  } else {
                    return <span key={index}>{part.value}</span>;
                  }
                })}
              </div>
            </div>
          </div>
        )}

        {corrections.length > 0 && (
          <div className="card bg-base-200 shadow-xl mt-6 result-appear">
            <div className="card-body">
              <h2 className="card-title">详细修正说明</h2>
              <div className="overflow-x-auto">
                <table className="table w-full correction-table">
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
                        <td className="text-error font-medium">{correction.original}</td>
                        <td className="text-success font-medium">{correction.corrected}</td>
                        <td>{correction.explanation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {corrections.length > 0 && (
          <div className="card bg-base-200 shadow-xl mt-6 result-appear">
            <div className="card-body">
              <h2 className="card-title">语法规则学习</h2>
              <div className="grid gap-4">
                {corrections.filter(c => c.rule).map((correction, index) => (
                  <div key={index} className="bg-base-100 p-4 rounded-lg">
                    <h3 className="font-bold text-lg mb-2">
                      <span className="text-error">{correction.original}</span> → 
                      <span className="text-success ml-2">{correction.corrected}</span>
                    </h3>
                    <p className="mb-2">{correction.explanation}</p>
                    {correction.rule && (
                      <div className="bg-base-200 p-3 rounded-md mb-3">
                        <p className="font-medium">📝 语法规则:</p>
                        <p>{correction.rule}</p>
                      </div>
                    )}
                    {correction.examples && correction.examples.length > 0 && (
                      <div>
                        <p className="font-medium">✨ 例句:</p>
                        <ul className="list-disc list-inside pl-2">
                          {correction.examples.map((example, i) => (
                            <li key={i} className="text-base-content">{example}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        <footer className="footer footer-center p-4 bg-base-300 text-base-content mt-8">
          <div>
            <p> 2025 JustSay - 英文语法优化助手</p>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default App
