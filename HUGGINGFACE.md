# CodeWhisper: AI代码生成助手

## 项目简介

CodeWhisper是一个基于DeepSeekAI的代码生成助手，旨在通过自然语言描述将创意转化为功能代码。无需记忆复杂的语法或API文档，只需描述您的需求，CodeWhisper将为您生成高质量的代码。

## 功能特点

🚀 **多语言支持** - 支持Python、JavaScript、Java、C++等主流编程语言
🧠 **智能理解** - 通过DeepSeekAI强大的语言理解能力准确把握开发需求
🛠️ **任务类型优化** - 针对不同类型的任务(函数、算法、UI组件)优化生成的代码
📋 **代码示例** - 提供常见任务的代码示例，帮助快速开始开发
💻 **简洁界面** - 专注于开发体验的简洁现代UI设计

## 使用示例

### 示例1: 生成一个排序算法
用户输入:
```
用Python实现一个快速排序算法，并添加详细注释说明
```

CodeWhisper生成:
```python
def quick_sort(arr):
    """
    使用快速排序算法对数组进行排序
    
    参数:
        arr: 需要排序的数组
    返回:
        排序后的数组
    """
    if len(arr) <= 1:
        return arr
    
    # 选择基准元素
    pivot = arr[len(arr) // 2]
    
    # 分区操作
    left = [x for x in arr if x < pivot]  # 小于基准的元素
    middle = [x for x in arr if x == pivot]  # 等于基准的元素
    right = [x for x in arr if x > pivot]  # 大于基准的元素
    
    # 递归并合并结果
    return quick_sort(left) + middle + quick_sort(right)
```

### 示例2: 生成一个前端组件
用户输入:
```
创建一个React组件，显示一个带搜索功能的待办事项列表
```

CodeWhisper生成:
```jsx
import React, { useState } from 'react';
import './TodoList.css';

const TodoList = () => {
  const [todos, setTodos] = useState([
    { id: 1, text: '学习React', completed: false },
    { id: 2, text: '完成项目', completed: false },
    { id: 3, text: '准备会议', completed: true }
  ]);
  const [newTodo, setNewTodo] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // 添加新待办事项
  const addTodo = () => {
    if (newTodo.trim() === '') return;
    setTodos([
      ...todos, 
      { id: Date.now(), text: newTodo, completed: false }
    ]);
    setNewTodo('');
  };
  
  // 标记完成/未完成
  const toggleComplete = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };
  
  // 过滤待办事项
  const filteredTodos = todos.filter(todo => 
    todo.text.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="todo-container">
      <h2>待办事项列表</h2>
      
      <div className="todo-search">
        <input
          type="text"
          placeholder="搜索..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="todo-add">
        <input
          type="text"
          placeholder="添加新待办事项..."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
        />
        <button onClick={addTodo}>添加</button>
      </div>
      
      <ul className="todo-list">
        {filteredTodos.length > 0 ? (
          filteredTodos.map(todo => (
            <li 
              key={todo.id} 
              className={todo.completed ? 'completed' : ''}
              onClick={() => toggleComplete(todo.id)}
            >
              {todo.text}
            </li>
          ))
        ) : (
          <li className="empty">没有匹配的待办事项</li>
        )}
      </ul>
    </div>
  );
};

export default TodoList;
```

## 技术栈

- **前端**: React, Next.js
- **API**: DeepSeekAI
- **部署**: Docker容器化

## 开源情况

CodeWhisper是一个开源项目，欢迎贡献代码和提出改进建议。

## 使用限制

- 生成的代码可能需要根据具体需求进行调整
- API调用有速率限制，大量请求可能受到限制
- 目前仅支持文本形式的代码生成，不支持完整项目结构生成

## 使用方式

1. 访问CodeWhisper网站
2. 选择目标编程语言和任务类型
3. 描述您需要实现的功能
4. 点击"生成代码"按钮
5. 复制并使用生成的代码

## 致谢

感谢DeepSeekAI提供的强大语言模型支持，使CodeWhisper成为可能。
