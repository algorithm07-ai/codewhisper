import { useState, useEffect } from 'react';
import styles from '../styles/QuickStartGuide.module.css';

const QuickStartGuide = ({ language = 'javascript', isOpen, onClose }) => {
  // 各编程语言的入门示例
  const languageExamples = {
    javascript: {
      title: "JavaScript 快速入门",
      description: "使用CodeWhisper生成高质量JavaScript代码的简要指南",
      steps: [
        "在编程语言下拉菜单中选择 JavaScript",
        "描述您需要的功能，例如：'创建一个表单验证函数'",
        "点击生成代码按钮，几秒钟内获得结果",
        "可以通过修改描述获得更精确的代码"
      ],
      example: `// 示例提示：创建一个表单验证函数
function validateForm(formData) {
  const errors = {};
  
  // 验证邮箱
  if (!formData.email || !/^\\S+@\\S+\\.\\S+$/.test(formData.email)) {
    errors.email = '请输入有效的邮箱地址';
  }
  
  // 验证密码
  if (!formData.password || formData.password.length < 8) {
    errors.password = '密码长度至少为8个字符';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}`
    },
    python: {
      title: "Python 快速入门",
      description: "使用CodeWhisper生成高质量Python代码的简要指南",
      steps: [
        "在编程语言下拉菜单中选择 Python",
        "描述您需要的功能，例如：'创建一个读取CSV文件的函数'",
        "点击生成代码按钮，几秒钟内获得结果",
        "可以通过添加更多细节获得更精确的代码"
      ],
      example: `# 示例提示：创建一个读取CSV文件的函数
import pandas as pd
import numpy as np

def read_and_process_csv(file_path, columns_to_use=None):
    """
    读取并处理CSV文件
    
    参数:
        file_path (str): CSV文件路径
        columns_to_use (list, optional): 需要的列名列表
        
    返回:
        DataFrame: 处理后的数据
    """
    try:
        # 读取CSV文件
        data = pd.read_csv(file_path, usecols=columns_to_use)
        
        # 简单数据清洗
        data = data.dropna()
        
        # 返回处理后的数据
        return data
    except Exception as e:
        print(f"读取CSV文件时出错: {e}")
        return None`
    },
    java: {
      title: "Java 快速入门",
      description: "使用CodeWhisper生成高质量Java代码的简要指南",
      steps: [
        "在编程语言下拉菜单中选择 Java",
        "描述您需要的功能，例如：'创建一个HTTP请求处理类'",
        "点击生成代码按钮，几秒钟内获得结果",
        "可以通过提供类名和方法名获得更定制化的代码"
      ],
      example: `// 示例提示：创建一个HTTP请求处理类
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

public class HttpClient {
    private static final String USER_AGENT = "CodeWhisper-Agent/1.0";
    
    /**
     * 发送GET请求
     * 
     * @param url 请求URL
     * @return 响应内容
     * @throws Exception 如果请求失败
     */
    public String sendGet(String url) throws Exception {
        URL obj = new URL(url);
        HttpURLConnection con = (HttpURLConnection) obj.openConnection();
        
        // 设置请求方法
        con.setRequestMethod("GET");
        con.setRequestProperty("User-Agent", USER_AGENT);
        
        // 获取响应
        BufferedReader in = new BufferedReader(
                new InputStreamReader(con.getInputStream()));
        String inputLine;
        StringBuilder response = new StringBuilder();
        
        while ((inputLine = in.readLine()) != null) {
            response.append(inputLine);
        }
        in.close();
        
        return response.toString();
    }
}`
    },
    csharp: {
      title: "C# 快速入门",
      description: "使用CodeWhisper生成高质量C#代码的简要指南",
      steps: [
        "在编程语言下拉菜单中选择 C#",
        "描述您需要的功能，例如：'创建一个文件读写类'",
        "点击生成代码按钮，几秒钟内获得结果",
        "可以通过指定命名空间和类名获得更定制化的代码"
      ],
      example: `// 示例提示：创建一个文件读写类
using System;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace CodeWhisper.Utilities
{
    public class FileManager
    {
        /// <summary>
        /// 异步读取文本文件内容
        /// </summary>
        /// <param name="filePath">文件路径</param>
        /// <returns>文件内容</returns>
        public async Task<string> ReadTextAsync(string filePath)
        {
            try
            {
                using (StreamReader reader = new StreamReader(filePath, Encoding.UTF8))
                {
                    return await reader.ReadToEndAsync();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"读取文件错误: {ex.Message}");
                return null;
            }
        }
        
        /// <summary>
        /// 异步写入文本到文件
        /// </summary>
        /// <param name="filePath">文件路径</param>
        /// <param name="content">写入内容</param>
        /// <returns>是否成功</returns>
        public async Task<bool> WriteTextAsync(string filePath, string content)
        {
            try
            {
                using (StreamWriter writer = new StreamWriter(filePath, false, Encoding.UTF8))
                {
                    await writer.WriteAsync(content);
                }
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"写入文件错误: {ex.Message}");
                return false;
            }
        }
    }
}`
    },
    cpp: {
      title: "C++ 快速入门",
      description: "使用CodeWhisper生成高质量C++代码的简要指南",
      steps: [
        "在编程语言下拉菜单中选择 C++",
        "描述您需要的功能，例如：'创建一个向量操作类'",
        "点击生成代码按钮，几秒钟内获得结果",
        "可以通过指定C++版本（如C++17）获得更现代的代码"
      ],
      example: `// 示例提示：创建一个向量操作类
#include <vector>
#include <algorithm>
#include <numeric>
#include <stdexcept>

template<typename T>
class VectorUtils {
private:
    std::vector<T> data;

public:
    // 构造函数
    VectorUtils() = default;
    
    // 从初始化列表构造
    VectorUtils(std::initializer_list<T> list) : data(list) {}
    
    // 添加元素
    void add(const T& value) {
        data.push_back(value);
    }
    
    // 获取最大值
    T max() const {
        if (data.empty()) {
            throw std::runtime_error("Vector is empty");
        }
        return *std::max_element(data.begin(), data.end());
    }
    
    // 获取最小值
    T min() const {
        if (data.empty()) {
            throw std::runtime_error("Vector is empty");
        }
        return *std::min_element(data.begin(), data.end());
    }
    
    // 计算平均值
    double average() const {
        if (data.empty()) {
            throw std::runtime_error("Vector is empty");
        }
        T sum = std::accumulate(data.begin(), data.end(), T{});
        return static_cast<double>(sum) / data.size();
    }
    
    // 获取数据大小
    size_t size() const {
        return data.size();
    }
};`
    },
    typescript: {
      title: "TypeScript 快速入门",
      description: "使用CodeWhisper生成高质量TypeScript代码的简要指南",
      steps: [
        "在编程语言下拉菜单中选择 TypeScript",
        "描述您需要的功能，例如：'创建一个带类型的API客户端'",
        "点击生成代码按钮，几秒钟内获得结果",
        "可以通过指定接口和类型获得更严格的类型定义"
      ],
      example: `// 示例提示：创建一个带类型的API客户端
interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
}

interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

class ApiClient {
  private baseUrl: string;
  private apiKey: string;
  
  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }
  
  /**
   * 获取用户数据
   * @param userId 用户ID
   * @returns 用户数据响应
   */
  async getUser(userId: number): Promise<ApiResponse<User>> {
    try {
      const response = await fetch(
        \`\${this.baseUrl}/users/\${userId}\`, 
        {
          headers: {
            'Authorization': \`Bearer \${this.apiKey}\`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      const data = await response.json();
      
      return {
        data: data as User,
        status: response.status,
        message: response.statusText
      };
    } catch (error) {
      return {
        data: null as unknown as User,
        status: 500,
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}`
    },
    go: {
      title: "Go 快速入门",
      description: "使用CodeWhisper生成高质量Go代码的简要指南",
      steps: [
        "在编程语言下拉菜单中选择 Go",
        "描述您需要的功能，例如：'创建一个HTTP服务器'",
        "点击生成代码按钮，几秒钟内获得结果",
        "可以通过提供包名和函数名获得更定制化的代码"
      ],
      example: `// 示例提示：创建一个HTTP服务器
package main

import (
	"encoding/json"
	"log"
	"net/http"
)

// User 代表用户数据结构
type User struct {
	ID    int    \`json:"id"\`
	Name  string \`json:"name"\`
	Email string \`json:"email"\`
}

// 用户处理函数
func userHandler(w http.ResponseWriter, r *http.Request) {
	// 示例用户数据
	user := User{
		ID:    1,
		Name:  "张三",
		Email: "zhangsan@example.com",
	}
	
	// 设置内容类型
	w.Header().Set("Content-Type", "application/json")
	
	// 序列化并返回JSON
	json.NewEncoder(w).Encode(user)
}

// 健康检查处理函数
func healthCheckHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("服务正常运行"))
}

func main() {
	// 注册处理函数
	http.HandleFunc("/user", userHandler)
	http.HandleFunc("/health", healthCheckHandler)
	
	// 启动服务器
	log.Println("服务器开始运行在 :8080 端口...")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatalf("服务器启动失败: %v", err)
	}
}`
    },
    rust: {
      title: "Rust 快速入门",
      description: "使用CodeWhisper生成高质量Rust代码的简要指南",
      steps: [
        "在编程语言下拉菜单中选择 Rust",
        "描述您需要的功能，例如：'创建一个文件解析器'",
        "点击生成代码按钮，几秒钟内获得结果",
        "可以通过提供细节如错误处理策略获得更健壮的代码"
      ],
      example: `// 示例提示：创建一个文件解析器
use std::fs::File;
use std::io::{self, BufRead, BufReader};
use std::path::Path;

#[derive(Debug)]
struct LogEntry {
    timestamp: String,
    level: String,
    message: String,
}

#[derive(Debug)]
enum ParserError {
    IoError(io::Error),
    ParseError(String),
}

impl From<io::Error> for ParserError {
    fn from(error: io::Error) -> Self {
        ParserError::IoError(error)
    }
}

/// 解析日志文件并返回日志条目的向量
fn parse_log_file<P: AsRef<Path>>(path: P) -> Result<Vec<LogEntry>, ParserError> {
    // 打开文件
    let file = File::open(path)?;
    let reader = BufReader::new(file);
    
    let mut entries = Vec::new();
    
    // 遍历每一行
    for (index, line) in reader.lines().enumerate() {
        let line = line?;
        
        // 忽略空行
        if line.trim().is_empty() {
            continue;
        }
        
        // 解析行内容（假设格式为: "TIMESTAMP LEVEL MESSAGE"）
        let parts: Vec<&str> = line.splitn(3, ' ').collect();
        
        if parts.len() < 3 {
            return Err(ParserError::ParseError(
                format!("行 {} 格式错误: {}", index + 1, line)
            ));
        }
        
        // 创建日志条目
        entries.push(LogEntry {
            timestamp: parts[0].to_string(),
            level: parts[1].to_string(),
            message: parts[2].to_string(),
        });
    }
    
    Ok(entries)
}

/// 按日志级别过滤日志条目
fn filter_by_level(entries: &[LogEntry], level: &str) -> Vec<&LogEntry> {
    entries.iter()
        .filter(|entry| entry.level == level)
        .collect()
}`
    },
  };

  // 获取当前语言的示例
  const currentExample = languageExamples[language] || languageExamples.javascript;

  // 处理关闭按钮点击
  const handleClose = () => {
    if (onClose) onClose();
  };

  // 仅在isOpen为true时渲染内容
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.guideContainer}>
        <button className={styles.closeButton} onClick={handleClose}>×</button>
        
        <h2>{currentExample.title}</h2>
        <p className={styles.description}>{currentExample.description}</p>
        
        <div className={styles.stepsContainer}>
          <h3>快速入门步骤</h3>
          <ol>
            {currentExample.steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>
        
        <div className={styles.exampleContainer}>
          <h3>示例代码</h3>
          <pre className={styles.codeBlock}>
            <code>{currentExample.example}</code>
          </pre>
        </div>
        
        <div className={styles.tipContainer}>
          <h3>提示</h3>
          <p>描述越详细，生成的代码就越符合您的需求。尝试指定函数名称、参数和返回类型。</p>
        </div>
      </div>
    </div>
  );
};

export default QuickStartGuide;
