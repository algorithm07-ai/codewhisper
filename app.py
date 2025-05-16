import os
import gradio as gr
import requests
import json

# 设置API密钥
api_key = os.environ.get("DEEPSEEK_API_KEY", "")

def generate_code(description, language, task_type):
    """使用DeepSeekAI生成代码"""
    
    # 根据任务类型调整提示
    task_prefixes = {
        "function": "编写一个函数，",
        "class": "创建一个类，",
        "algorithm": "实现以下算法：",
        "utility": "编写一个实用工具，",
        "ui": "创建一个用户界面组件，"
    }
    
    prefix = task_prefixes.get(task_type, "")
    enhanced_prompt = f"{prefix}{description}"
    
    try:
        # 调用DeepSeekAI API
        response = requests.post(
            "https://api.deepseek.com/v1/chat/completions",
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {api_key}"
            },
            json={
                "model": "deepseek-coder",
                "messages": [
                    {
                        "role": "system",
                        "content": "生成简洁高效的代码"
                    },
                    {
                        "role": "user",
                        "content": f"{language}语言: {enhanced_prompt}"
                    }
                ],
                "temperature": 0.3,
                "max_tokens": 800
            },
            timeout=30
        )
        
        # 提取生成的代码
        if response.status_code == 200:
            result = response.json()
            code = result["choices"][0]["message"]["content"]
            # 提取代码块
            if "```" in code:
                code_blocks = code.split("```")
                if len(code_blocks) >= 3:
                    # 提取第一个代码块
                    return code_blocks[1]
            return code
        else:
            # API调用失败时使用模拟响应
            return f"// DeepSeek API暂时不可用 (状态码: {response.status_code})\n// 错误: {response.text}\n\n// 以下是模拟响应\nfunction example() {\n  console.log('这是一个示例代码');\n}"
    
    except Exception as e:
        return f"// 发生错误: {str(e)}\n\n// 以下是模拟响应\nfunction example() {\n  console.log('这是一个示例代码');\n}"

# 示例代码
examples = [
    ["实现一个快速排序算法", "python", "algorithm"],
    ["创建一个用户注册表单", "javascript", "ui"],
    ["编写一个计算斐波那契数列的函数", "java", "function"],
    ["设计一个单例模式类", "c++", "class"],
    ["制作一个日期格式化工具", "javascript", "utility"]
]

# 创建Gradio界面
with gr.Blocks(title="CodeWhisper - AI代码生成助手") as demo:
    gr.Markdown("# 🤫 CodeWhisper: AI代码生成助手")
    gr.Markdown("## 用自然语言描述，获取高质量代码")
    
    with gr.Row():
        with gr.Column(scale=3):
            description = gr.Textbox(
                label="需求描述", 
                placeholder="描述您需要的代码功能...", 
                lines=4
            )
            
            with gr.Row():
                language = gr.Dropdown(
                    choices=["python", "javascript", "java", "c++", "go", "typescript"],
                    value="python",
                    label="编程语言"
                )
                task_type = gr.Dropdown(
                    choices=["function", "class", "algorithm", "utility", "ui"],
                    value="function",
                    label="任务类型"
                )
            
            generate_btn = gr.Button("生成代码", variant="primary")
        
        with gr.Column(scale=4):
            output = gr.Code(label="生成的代码", language="python", lines=20)
    
    generate_btn.click(
        fn=generate_code, 
        inputs=[description, language, task_type], 
        outputs=[output]
    )
    
    gr.Examples(
        examples=examples,
        inputs=[description, language, task_type],
        outputs=[output],
        fn=generate_code,
        cache_examples=True
    )
    
    gr.Markdown("""
    ### 使用说明
    1. 输入您想要实现的功能描述
    2. 选择目标编程语言
    3. 选择任务类型（函数、类、算法等）
    4. 点击"生成代码"按钮
    
    ### 关于 CodeWhisper
    CodeWhisper是一个基于DeepSeekAI的代码生成助手，旨在通过自然语言描述将创意转化为功能代码。
    [查看项目详情](https://github.com/hongpingzhang/CodeWhisper)
    """)

# 启动Gradio应用
if __name__ == "__main__":
    demo.launch()
