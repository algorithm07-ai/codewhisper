# CodeWhisper

> 将您的想法转变为应用 - 由DeepSeekAI驱动的智能代码生成工具

[![在线体验](https://img.shields.io/badge/在线体验-blue?style=for-the-badge)](https://codewhisper-77tldsdeg-hongpings-projects.vercel.app/)
[![GitHub stars](https://img.shields.io/github/stars/algorithm07-ai/codewhisper?style=for-the-badge)](https://github.com/algorithm07-ai/codewhisper/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/algorithm07-ai/codewhisper?style=for-the-badge)](https://github.com/algorithm07-ai/codewhisper/network/members)
[![GitHub license](https://img.shields.io/github/license/algorithm07-ai/codewhisper?style=for-the-badge)](https://github.com/algorithm07-ai/codewhisper/blob/main/LICENSE)

---

## 📖 介绍

CodeWhisper 是一款基于 DeepSeekAI 的智能代码生成工具，帮助开发者将自然语言描述转换为高质量的代码。无论您是经验丰富的程序员寻求提高效率，还是刚入门的新手需要编程指导，CodeWhisper 都能满足您的需求。

通过扩展的 Anthropic MCP 协议，CodeWhisper 提供了卓越的代码生成能力，支持多种编程语言和任务类型，让您的开发过程更加顺畅高效。

## ✨ 功能特点

- **多语言支持**: 支持JavaScript、Python、Java、C#、C++、TypeScript、Go、Rust等8种主流编程语言
- **DeepSeek AI驱动**: 基于先进的DeepSeek AI大模型，对中文需求有更好的理解能力
- **多任务类型**: 支持函数实现、完整应用、算法实现、数据结构、API设计、界面组件、测试代码等多种任务类型
- **代码质量保证**: 生成的代码遵循最佳实践，包含注释和错误处理
- **实时生成**: 高速响应，通常在几秒内完成代码生成
- **上下文感知**: 智能理解您的需求上下文，提供更精准的代码解决方案
- **响应式设计**: 适配各种设备屏幕，让您在桌面和移动设备上都能高效使用
- **安全可靠**: 不保存敏感代码，保护您的知识产权

## 🚀 快速开始

### 在线使用

访问 [CodeWhisper 在线版](https://codewhisper-77tldsdeg-hongpings-projects.vercel.app/) 立即开始生成代码。

### 本地部署

```bash
# 克隆仓库
git clone https://github.com/algorithm07-ai/codewhisper.git
cd codewhisper

# 安装依赖
npm install

# 运行开发服务器
npm run dev

# 访问 http://localhost:3000 开始使用
```

## 💬 使用方法

1. **描述需求**: 使用自然语言描述您需要的代码功能
2. **选择语言**: 从8种支持的编程语言中选择
3. **选择任务类型**: 指定您需要的代码类型(函数、应用、算法等)
4. **生成代码**: 点击生成按钮，在几秒内获取结果
5. **复制使用**: 一键复制生成的代码到您的项目中

## 💯 使用示例

CodeWhisper 能处理从简单函数到复杂系统设计的各类需求。以下是几个典型示例：

### 示例 1: 算法实现

**需求描述**
```
实现一个快速排序算法，并添加详细注释和时间复杂度分析
```

**生成的 Python 代码**
```python
def quick_sort(arr):
    """
    使用快速排序算法对数组进行排序
    
    时间复杂度：
    - 平均情况：O(n log n)
    - 最坏情况：O(n²) [当数组已排序或逆序时]
    
    空间复杂度：O(log n) [递归调用栈]
    
    参数：
        arr: 需要排序的数组
    返回：
        排序后的数组
    """
    if len(arr) <= 1:
        return arr
    
    # 选择基准元素 (使用中间元素作为基准可减少最坏情况发生)
    pivot = arr[len(arr) // 2]
    
    # 分区操作 - 将数组分为三部分
    left = [x for x in arr if x < pivot]    # 小于基准的元素
    middle = [x for x in arr if x == pivot] # 等于基准的元素
    right = [x for x in arr if x > pivot]   # 大于基准的元素
    
    # 递归对左右子数组进行排序并合并结果
    return quick_sort(left) + middle + quick_sort(right)

# 测试代码
if __name__ == "__main__":
    test_array = [3, 6, 8, 10, 1, 2, 1, 5, 7]
    sorted_array = quick_sort(test_array)
    print(f"原始数组: {test_array}")
    print(f"排序后的数组: {sorted_array}")
```

### 示例 2: Web 应用组件

**需求描述**
```
创建一个 React 的待办事项组件，支持添加、删除和标记完成任务
```

**生成的 JavaScript 代码**
```jsx
import React, { useState, useEffect } from 'react';
import './TodoApp.css';

const TodoApp = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  
  // 从 localStorage 加载数据
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);
  
  // 保存到 localStorage
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);
  
  // 添加任务
  const addTask = () => {
    if (newTask.trim() === '') return;
    
    const task = {
      id: Date.now(),
      text: newTask,
      completed: false,
      createdAt: new Date()
    };
    
    setTasks([...tasks, task]);
    setNewTask('');
  };
  
  // 删除任务
  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };
  
  // 切换任务状态
  const toggleComplete = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };
  
  return (
    <div className="todo-app">
      <h1>待办事项列表</h1>
      
      <div className="add-task">
        <input 
          type="text" 
          value={newTask} 
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="输入新任务..."
          onKeyPress={(e) => e.key === 'Enter' && addTask()}
        />
        <button onClick={addTask}>添加</button>
      </div>
      
      <ul className="task-list">
        {tasks.length === 0 ? (
          <li className="empty-message">暂无任务，添加一个吧！</li>
        ) : (
          tasks.map(task => (
            <li key={task.id} className={task.completed ? 'completed' : ''}>
              <span 
                className="task-text"
                onClick={() => toggleComplete(task.id)}
              >
                {task.text}
              </span>
              <div className="task-actions">
                <button 
                  className="delete-btn"
                  onClick={() => deleteTask(task.id)}
                >
                  删除
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
      
      <div className="task-stats">
        共计 {tasks.length} 个任务，
        {tasks.filter(task => task.completed).length} 个已完成
      </div>
    </div>
  );
};

export default TodoApp;
```

## 🔧 技术架构

CodeWhisper 采用现代化的技术栈构建：

- **前端**: Next.js 框架，提供SSR、良好性能和SEO
- **后端**: Node.js + Express，负责DeepSeek API集成和代码分析逻辑
- **AI引擎**: 基于DeepSeek AI，通过扩展的Anthropic MCP协议处理代码生成
- **部署**: Vercel平台，提供全球CDN和自动HTTPS

## 💎 服务方案

我们提供三个不同层级的服务计划，满足不同用户的需求：

### 1. 免费版 (Free)

- 基本代码生成功能
- 每月20次使用限制
- 支持2种编程语言 (JavaScript 和 Python)
- 基础代码分析
- **价格**: ¥0

### 2. 专业版 (Pro)

- 无限制代码生成次数
- 支持全部8种编程语言
- 高级分析报告（包括安全漏洞、性能优化建议）
- 优先处理队列
- 基础API访问
- **价格**: ¥19.99/月 或 ¥199/年 (节省17%)

### 3. 企业版 (Enterprise)

- 专业版全部功能
- 团队协作功能（多用户）
- 高级API集成
- 自定义生成规则
- 专属技术支持
- 白标解决方案
- **价格**: ¥49.99/月 或 ¥499/年 (节省17%)

## 👨‍💻 贡献指南

我们欢迎社区贡献，提升 CodeWhisper 的功能和性能！

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开 Pull Request

## 📬 联系我们

- **邮箱**: 1459351107@qq.com
- **微信**: 添加微信，备注"CodeWhisper"

## 📄 许可证

本项目采用 MIT 许可证 - 详情请参阅 [LICENSE](LICENSE) 文件

---

由 [@hongpingzhang](https://huggingface.co/hongpingzhang) 开发 | 2025 CodeWhisper
