import { llms, loader } from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';
import { docsContentRoute, docsImageRoute, docsRoute } from './shared';
import { defineDocs } from 'fumadocs-mdx/macro';
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema';

/**
 * 纯视觉组件（概念图 / 动画）。
 *
 * 它们在 HTML 页面里渲染成图形；但在 Markdown 导出（llms.txt、
 * `/llms.mdx/.../content.md`）中无法渲染，会留下 `<TraceGauge />`
 * 这类空标签。所以在 postprocess 阶段整块剔除。
 *
 * 这些图对应的信息在正文里以文字说明保留，因此纯文本读者不会丢内容。
 */
const VISUAL_ONLY_COMPONENTS = new Set([
  'AtomModel',
  'ForceCurve',
  'TwoSpeeds',
  'DisplacementCurrent',
  'ChargePair',
  'EnergyLadder',
  'LoopCurrent',
  'TraceGauge',
  'WaveformRms',
  'BoardAnatomy',
  'CopperCladLaminate',
  'LayerStackup4',
  'ViaTypes',
  'ConnectionEras',
  'PackageCompare',
  'ResistorPackages',
  'IcPackages',
]);

/**
 * 只做视觉强调、但**含正文内容**的组件：Markdown 导出里丢掉外层标签、
 * 保留其中的文字，这样纯文本读者既不丢内容，也不会看到 `<Mark>` 这类噪声。
 */
const CHILDREN_ONLY_COMPONENTS = new Set(['Mark', 'Pitfall', 'Approx', 'KeyBox']);

const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: pageSchema,
    postprocess: {
      includeProcessedMarkdown: {
        filterElement(node) {
          const name = (node as { name?: string }).name;
          if (!name) return true;

          // 纯视觉组件（自闭合、无文本子节点）从 Markdown 导出中移除
          if (VISUAL_ONLY_COMPONENTS.has(name)) return false;

          // 视觉强调组件：去掉标签、保留内容
          if (CHILDREN_ONLY_COMPONENTS.has(name)) return 'children-only';

          return true;
        },
      },
    },
  },
  meta: {
    schema: metaSchema,
  },
});

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: docsRoute,
  source: docs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

export const docsLlms = llms(source, {
  renderPage: async (page) => `# ${page.data.title} (${page.url})

${await page.data.getText('processed')}`,
});
