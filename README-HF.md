# CodeWhisper

CodeWhisper是一个基于DeepSeekAI的代码生成助手，通过自然语言描述将创意转化为功能代码。

## 特点

- 🚀 支持多种编程语言
- 💡 智能理解需求并生成代码
- 🛠️ 针对不同任务类型优化输出
- 🎨 简洁易用的界面

## 使用方法

1. 输入您想要实现的功能描述
2. 选择目标编程语言和任务类型
3. 点击"生成代码"按钮
4. 获取由AI生成的代码

## 示例

从简单函数到复杂算法，CodeWhisper能够理解并实现各种编程任务。

### 示例输入

```
实现一个快速排序算法，并添加详细注释
```

### 生成的代码

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

## 技术细节

CodeWhisper使用DeepSeekAI的先进语言模型来理解用户需求并生成相应的代码。应用采用Gradio构建，提供直观的用户界面。

---

由[@hongpingzhang](https://huggingface.co/hongpingzhang)开发
