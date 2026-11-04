import { baseBlocks } from './baseBlocks'
import { HeadingBlock } from './HeadingBlock'
import { ImageBlock } from './ImageBlock'
import { ButtonBlock } from './ButtonBlock'
import { DividerBlock } from './DividerBlock'
import { VideoBlock } from './VideoBlock'
import { StatsBlock } from './StatsBlock'
import { LogosBlock } from './LogosBlock'
import { TeamBlock } from './TeamBlock'
import { TabsBlock } from './TabsBlock'
import { LeadFormBlock } from './LeadFormBlock'
import { BlogFeedBlock } from './BlogFeedBlock'
import { CountdownBlock } from './CountdownBlock'
import { SocialBlock } from './SocialBlock'
import { HtmlBlock } from './HtmlBlock'

// Blok "daun" (tanpa container) yang bisa disusun bebas.
export const leafBlocks = [
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
  HtmlBlock,
]

// Blok yang boleh dipakai di dalam kolom Section. Hero dikecualikan agar
// tidak ada dua H1 dan agar struktur halaman tetap rapi. Section juga
// dikecualikan supaya kedalaman nesting maksimal 1 (tidak rekursif).
export const columnBlocks = [
  ...baseBlocks.filter((block) => block.slug !== 'hero'),
  ...leafBlocks,
]

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
  HtmlBlock,
}
