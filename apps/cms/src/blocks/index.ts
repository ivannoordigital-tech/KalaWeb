import { HeroBlock } from './HeroBlock'
import { PainPointsBlock } from './PainPointsBlock'
import { SolutionsBlock } from './SolutionsBlock'
import { PricingPackagesBlock } from './PricingPackagesBlock'
import { ComparisonTableBlock } from './ComparisonTableBlock'
import { StepsFlowBlock } from './StepsFlowBlock'
import { TestimonialsBlock } from './TestimonialsBlock'
import { GuaranteeBlock } from './GuaranteeBlock'
import { FaqAccordionBlock } from './FaqAccordionBlock'
import { RichTextBlock } from './RichTextBlock'
import { CallToActionBlock } from './CallToActionBlock'
import { GalleryBlock } from './GalleryBlock'
import { TemplateRefBlock } from './TemplateRefBlock'
import { MidwifeSpotlightBlock } from './MidwifeSpotlightBlock'

export const baseBlocks = [
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
]

export const allBlocks = [
  ...baseBlocks,
  TemplateRefBlock,
]

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
  TemplateRefBlock,
  MidwifeSpotlightBlock,
}
