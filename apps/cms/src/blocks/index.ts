import { baseBlocks } from './baseBlocks'
import { leafBlocks } from './leafBlocks'
import { SectionBlock } from './SectionBlock'
import { TemplateRefBlock } from './TemplateRefBlock'

// Blok yang boleh dipakai di dalam Pustaka Template Blok (tanpa TemplateRef
// agar tidak terjadi referensi bersarang).
export const templateBlocks = [...baseBlocks, ...leafBlocks, SectionBlock]

// Semua blok yang tersedia untuk halaman (Pages & LandingPages).
export const allBlocks = [...baseBlocks, ...leafBlocks, SectionBlock, TemplateRefBlock]

export { baseBlocks, leafBlocks, SectionBlock, TemplateRefBlock }
export { columnBlocks } from './leafBlocks'
export {
  HeadingBlock,
  ImageBlock,
  ButtonBlock,
  DividerBlock,
  VideoBlock,
  StatsBlock,
  LogosBlock,
  TeamBlock,
  TabsBlock,
  LeadFormBlock,
  BlogFeedBlock,
  CountdownBlock,
  SocialBlock,
} from './leafBlocks'
export {
  HeroBlock,
  PainPointsBlock,
  SolutionsBlock,
  PricingPackagesBlock,
  ComparisonTableBlock,
  StepsFlowBlock,
  TestimonialsBlock,
  GuaranteeBlock,
  FaqAccordionBlock,
  RichTextBlock,
  CallToActionBlock,
  GalleryBlock,
  MidwifeSpotlightBlock,
} from './baseBlocks'
