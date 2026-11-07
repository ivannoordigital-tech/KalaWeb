import { PromoBannerBlock } from './PromoBannerBlock'
import { FeaturedServicesBlock } from './FeaturedServicesBlock'
import { CoverageAreaBlock } from './CoverageAreaBlock'

/**
 * Blok khusus homepage yang tidak dipakai sebagai blok generik di dalam kolom.
 * Dipisahkan dari `baseBlocks` agar tidak bisa di-nest ke dalam Section.
 */
export const homeBlocks = [PromoBannerBlock, FeaturedServicesBlock, CoverageAreaBlock]

export { PromoBannerBlock, FeaturedServicesBlock, CoverageAreaBlock }
