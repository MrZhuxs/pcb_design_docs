import { defineTranslations } from 'fumadocs-core/i18n';
import { i18nProvider, uiTranslations } from 'fumadocs-ui/i18n';

/**
 * 界面文案的中文翻译。
 *
 * 键名由「英文原文 + (使用位置)」拼成，由 `uiTranslations()` 注册，
 * 因此这里必须使用与 Fumadocs 内置英文完全一致的键名。
 * 未列出的键会自动回退到内置英文，不会报错。
 */
export const zhTranslations = defineTranslations()
  .extend(uiTranslations())
  .add({
    // 站内搜索
    'Search(search trigger)': '搜索',
    'Search(search dialog)': '搜索',
    'Open Search(search trigger)(aria-label)': '打开搜索',
    'Close Search(search dialog)(aria-label)': '关闭搜索',
    'No results found(search dialog)': '没有找到相关内容',

    // 侧边栏 / 页面树
    'Open Sidebar(sidebar)(aria-label)': '展开侧边栏',
    'Close Sidebar(sidebar)(aria-label)': '收起侧边栏',
    'Collapse Sidebar(sidebar)(aria-label)': '折叠侧边栏',
    'Open Sidebar(aria-label)': '展开侧边栏',
    'Close Sidebar(aria-label)': '收起侧边栏',
    'Show Sidebar(sidebar)': '显示侧边栏',
    'Hide Sidebar(sidebar)': '隐藏侧边栏',
    'Toggle Menu(home layout header)(aria-label)': '切换菜单',

    // 主题
    'Toggle Theme(theme switcher)(aria-label)': '切换主题',
    'Light(theme switcher)(aria-label)': '浅色',
    'Dark(theme switcher)(aria-label)': '深色',
    'System(theme switcher)(aria-label)': '跟随系统',
    'Theme(site menu)': '主题',

    // 目录 / 页脚翻页
    'On this page(table of contents)': '本页目录',
    'Table of Contents(inline table of contents)': '目录',
    'No Headings(table of contents)': '暂无标题目录',
    'Previous Page(pagination)': '上一篇',
    'Next Page(pagination)': '下一篇',
    'Last updated on(page footer)': '最后更新于',
    'Edit on GitHub(edit page)': '在 GitHub 上编辑',

    // 页面操作
    'Open(page actions)': '打开',
    'Copy Markdown(page actions)': '复制 Markdown',
    'Copied Markdown(page actions)': '已复制 Markdown',
    'View as Markdown(page actions)': '以 Markdown 查看',
    'Open in GitHub(page actions)': '在 GitHub 中打开',
    'Open in ChatGPT(page actions)': '在 ChatGPT 中打开',
    'Open in Claude(page actions)': '在 Claude 中打开',
    'Open in Cursor(page actions)': '在 Cursor 中打开',
    'Open in Scira AI(page actions)': '在 Scira AI 中打开',
    'Read {url}, I want to ask questions about it.(page actions)':
      '阅读 {url}，我想就它的内容提问。',

    // 代码块 / 标题锚点 / 折叠面板
    'Copy Text(code block)(aria-label)': '复制代码',
    'Copied Text(code block)(aria-label)': '已复制代码',
    'Copy Anchor Link(heading anchor)(aria-label)': '复制锚点链接',
    'Copied Anchor Link(heading anchor)(aria-label)': '已复制锚点链接',
    'Copy Link(accordion)(aria-label)': '复制链接',
    'Copied Link(accordion)(aria-label)': '已复制链接',

    // 404 / 横幅 / 其他
    'Page Not Found(404 not found page)': '页面未找到',
    'Back to Home(404 not found page)': '返回首页',
    'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.(404 not found page)':
      '你要访问的页面可能已被删除、更名，或暂时不可用。',
    'Close Banner(banner)(aria-label)': '关闭横幅',
    'Options(aria-label)': '选项',
    'Ask AI(AI chat button)': '询问 AI',

    // 语言切换（本站目前为单语言，保留以备后续启用）
    'Language(language switcher)': '语言',
    'Choose a language(language switcher)': '选择语言',
    'Choose a language(language switcher)(aria-label)': '选择语言',
    'Layout Tab(layout tab trigger)': '布局标签页',

    // API 类型表格
    'Type(type table)': '类型',
    'Default(type table)': '默认值',
    'Parameters(type table)': '参数',
    'Prop(type table)': '属性',
    'Returns(type table)': '返回值',
  });

/** 传给 `RootProvider` 的 i18n 配置 */
export const i18nUI = i18nProvider(zhTranslations);
