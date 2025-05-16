import { useState, useEffect } from 'react';
import axios from 'axios';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import styles from '../styles/CodeGenerator.module.css';

// 代码示例
const codeExamples = {
  calculator: "创建一个简单的计算器应用，支持加减乘除基本运算",
  todoApp: "实现一个待办事项管理应用，可以添加、删除和标记完成任务",
  weatherApp: "构建一个天气查询应用，能够显示指定城市的天气情况",
  dataVisualizer: "开发一个数据可视化工具，可以将CSV数据转换为图表",
  chatBot: "实现一个简单的聊天机器人，能够回应基本问题"
};

// 任务类型列表
const taskTypes = [
  { id: 'function', label: '函数实现' },
  { id: 'application', label: '完整应用' },
  { id: 'algorithm', label: '算法实现' },
  { id: 'dataStructure', label: '数据结构' },
  { id: 'api', label: 'API设计' },
  { id: 'ui', label: '界面组件' },
  { id: 'test', label: '测试代码' }
];

const CodeGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [taskType, setTaskType] = useState('function');
  const [showExamples, setShowExamples] = useState(false);

  // 使用示例提示
  const useExample = (exampleKey) => {
    setPrompt(codeExamples[exampleKey]);
    setShowExamples(false);
  };

  // 清除所有输出
  const clearAll = () => {
    setPrompt('');
    setCode('');
    setError('');
    setWarning('');
  };
  
  const generateCode = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setError('');
    setWarning('');
    
    try {
      // 调用我们的API路由，该路由将连接到DeepSeekAI
      const response = await axios.post('/api/generate', {
        prompt: prompt.trim(),
        language,
        taskType
      });
      
      setCode(response.data.code);
      
      // 检查是否有警告消息（API不可用时的备用模式）
      if (response.data.warning) {
        setWarning(response.data.warning);
      }
    } catch (err) {
      setError('发生错误: ' + (err.response?.data?.error || err.message || '请稍后再试'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };



  const copyToClipboard = () => {
    navigator.clipboard.writeText(code)
      .then(() => alert('代码已复制到剪贴板'))
      .catch(err => console.error('复制失败:', err));
  };

  return (
    <div className={styles.container}>
      <div className={styles.inputSection}>
        <div className={styles.promptHeader}>
          <h3>描述您的需求</h3>
          <button 
            className={styles.examplesButton} 
            onClick={() => setShowExamples(!showExamples)}
          >
            {showExamples ? '隐藏示例' : '查看示例'}
          </button>
        </div>
        
        {showExamples && (
          <div className={styles.examplesList}>
            {Object.entries(codeExamples).map(([key, example]) => (
              <div 
                key={key} 
                className={styles.exampleItem}
                onClick={() => useExample(key)}
              >
                {example}
              </div>
            ))}
          </div>
        )}
        
        <textarea
          className={styles.promptInput}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="描述您想要的功能，例如: 创建一个简单的计算器..."
          rows={3}
        />
        
        <div className={styles.controls}>
          <div className={styles.selectGroup}>
            <label>编程语言:</label>
            <select 
              className={styles.languageSelect}
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="csharp">C#</option>
              <option value="cpp">C++</option>
              <option value="typescript">TypeScript</option>
              <option value="go">Go</option>
              <option value="rust">Rust</option>
            </select>
          </div>
          
          <div className={styles.selectGroup}>
            <label>任务类型:</label>
            <select
              className={styles.taskTypeSelect}
              value={taskType}
              onChange={(e) => setTaskType(e.target.value)}
            >
              {taskTypes.map(type => (
                <option key={type.id} value={type.id}>{type.label}</option>
              ))}
            </select>
          </div>
          
          <div className={styles.buttonGroup}>
            <button 
              className={styles.clearButton}
              onClick={clearAll}
              disabled={loading || (!prompt.trim() && !code)}
            >
              清除
            </button>
            
            <button 
              className={styles.generateButton}
              onClick={generateCode}
              disabled={loading || !prompt.trim()}
            >
              {loading ? '生成中...' : '生成代码'}
            </button>
          </div>
        </div>
      </div>
      
      {error && <div className={styles.error}>{error}</div>}
      {warning && <div className={styles.warning}>{warning}</div>}
      
      {code && (
        <div className={styles.codeSection}>
          <div className={styles.codeHeader}>
            <span>由DeepSeekAI生成的代码</span>
            <button onClick={copyToClipboard} className={styles.copyButton}>
              复制代码
            </button>
          </div>
          <SyntaxHighlighter language={language} style={tomorrow} className={styles.codeBlock}>
            {code}
          </SyntaxHighlighter>
        </div>
      )}
    </div>
  );
};

export default CodeGenerator;
