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
import { ContainerBlock } from './ContainerBlock'
import { FeaturedServicesBlock } from './FeaturedServicesBlock'
import { ValuePropsBlock } from './ValuePropsBlock'
import { CoverageAreaBlock } from './CoverageAreaBlock'
import { widgetBlocks } from './widgets'
import { withDisabled } from './withDisabled'

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
  FeaturedServicesBlock,
  ValuePropsBlock,
  CoverageAreaBlock,
  ...widgetBlocks,
].map((block) => (block.fields?.some((field: any) => field.name === 'disabled') ? block : withDisabled(block)))

export const allBlocks = [
  ...baseBlocks,
  withDisabled(ContainerBlock),
  withDisabled(TemplateRefBlock),
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
  ContainerBlock,
  FeaturedServicesBlock,
  ValuePropsBlock,
  CoverageAreaBlock,
}
