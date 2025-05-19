import { useState } from 'react';
import styles from '../styles/Faq.module.css';

const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.faqItem}>
      <button 
        className={`${styles.faqQuestion} ${isOpen ? styles.open : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {question}
        <span className={styles.arrow}>{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && (
        <div className={styles.faqAnswer}>
          {answer}
        </div>
      )}
    </div>
  );
};

const Faq = ({ isOpen, onClose }) => {
  const faqItems = [
    {
      question: "CodeWhisper 支持哪些编程语言？",
      answer: (
        <>
          <p>目前，CodeWhisper 支持以下8种主流编程语言：</p>
          <ul>
            <li>JavaScript</li>
            <li>Python</li>
            <li>TypeScript</li>
            <li>Java</li>
            <li>C#</li>
            <li>C++</li>
            <li>Go</li>
            <li>Rust</li>
          </ul>
          <p>我们计划在未来添加更多语言支持。您可以在我们的博客上了解最新的语言支持更新。</p>
        </>
      )
    },
    {
      question: "我可以免费使用 CodeWhisper 吗？",
      answer: (
        <>
          <p>CodeWhisper 提供两种使用方式：</p>
          <ul>
            <li><strong>免费版</strong>：每天限制生成10段代码，代码长度最多150行</li>
            <li><strong>专业版</strong>：无限制生成，支持更长代码段，优先队列处理，提供API接口</li>
          </ul>
          <p>我们的专业版每月订阅费用为¥99/月，或年付¥999/年（节省约16%）。企业级方案可联系我们的销售团队获取定制报价。</p>
        </>
      )
    },
    {
      question: "如何获得最精确的代码生成结果？",
      answer: (
        <>
          <p>要获得最佳结果，请遵循以下建议：</p>
          <ol>
            <li><strong>详细描述需求</strong>：明确说明您需要实现的功能、参数和返回值</li>
            <li><strong>提供上下文</strong>：说明代码将在什么环境中使用（Web、移动端、服务器等）</li>
            <li><strong>指定关键函数名和变量名</strong>：这有助于生成更符合您命名风格的代码</li>
            <li><strong>说明版本和依赖</strong>：例如"使用Python 3.9"或"兼容React 18"</li>
          </ol>
          <p>示例良好提示：<code>"创建一个React函数组件UserProfile，接收user对象作为props，显示用户名、头像和个人简介，使用styled-components样式库，兼容React 18"</code></p>
        </>
      )
    },
    {
      question: "生成的代码是否有版权限制？",
      answer: (
        <>
          <p>通过CodeWhisper生成的代码是<strong>完全归您所有</strong>的。您可以自由地在个人或商业项目中使用，无需归属或支付额外费用。</p>
          <p>不过，请注意以下几点：</p>
          <ul>
            <li>生成的代码可能包含通用算法或标准实现方式，这些可能与其他代码相似</li>
            <li>如果您在提示中包含了特定的专有算法或版权代码，请确保您有权使用这些内容</li>
            <li>我们建议您检查生成的代码并进行必要的修改，以确保它符合您项目的特定需求和标准</li>
          </ul>
        </>
      )
    },
    {
      question: "CodeWhisper 生成的代码是否安全可靠？",
      answer: (
        <>
          <p>CodeWhisper致力于生成高质量、安全的代码，但我们建议采取以下预防措施：</p>
          <ul>
            <li><strong>审查生成的代码</strong>：在生产环境中使用前，检查代码是否存在潜在的安全漏洞或性能问题</li>
            <li><strong>运行测试</strong>：对生成的代码进行单元测试和集成测试，确保它按预期工作</li>
            <li><strong>遵循安全最佳实践</strong>：特别是处理用户输入、认证和数据库操作时</li>
          </ul>
          <p>虽然我们的模型经过训练以避免生成不安全的代码，但它并不能取代专业开发者的安全审查和判断。</p>
        </>
      )
    },
    {
      question: "如何将 CodeWhisper 集成到我的开发环境中？",
      answer: (
        <>
          <p>CodeWhisper 提供多种集成方式：</p>
          <ul>
            <li><strong>Web 界面</strong>：直接在我们的网站上使用，无需安装</li>
            <li><strong>VS Code 扩展</strong>：从VS Code市场安装我们的官方扩展</li>
            <li><strong>JetBrains 插件</strong>：支持IntelliJ IDEA、PyCharm等JetBrains IDE</li>
            <li><strong>API 接口</strong>：专业版用户可以通过API将CodeWhisper集成到自定义工作流中</li>
          </ul>
          <p>所有集成方案都支持使用您的CodeWhisper账号登录，同步您的订阅权限和使用限额。</p>
        </>
      )
    },
    {
      question: "我遇到了问题，如何获取技术支持？",
      answer: (
        <>
          <p>我们提供多种支持渠道：</p>
          <ul>
            <li><strong>帮助中心</strong>：访问 <a href="https://help.codewhisper.tech" target="_blank" rel="noopener noreferrer">help.codewhisper.tech</a> 查看详细指南和常见问题解答</li>
            <li><strong>社区论坛</strong>：在 <a href="https://community.codewhisper.tech" target="_blank" rel="noopener noreferrer">community.codewhisper.tech</a> 与其他用户讨论和分享经验</li>
            <li><strong>电子邮件支持</strong>：发送邮件至 support@codewhisper.tech，工作日内24小时回复</li>
            <li><strong>实时聊天</strong>：专业版用户可使用网站右下角的实时聊天功能，获得优先支持</li>
          </ul>
          <p>提交问题时，请尽可能详细描述您的问题，包括使用的浏览器/IDE版本、错误消息截图等，这将帮助我们更快解决您的问题。</p>
        </>
      )
    }
  ];

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.faqContainer}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        <h2 className={styles.faqTitle}>常见问题 (FAQ)</h2>
        <p className={styles.faqDescription}>
          查找关于CodeWhisper的常见问题及解答。如果您没有找到需要的信息，请通过support@codewhisper.tech联系我们。
        </p>
        <div className={styles.faqList}>
          {faqItems.map((item, index) => (
            <FaqItem 
              key={index}
              question={item.question}
              answer={item.answer}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Faq;
