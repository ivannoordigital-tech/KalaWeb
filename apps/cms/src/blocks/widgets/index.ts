import { withDisabled } from '../withDisabled';
import { HeadingBlock } from './HeadingBlock';
import { TextBlock } from './TextBlock';
import { ImageBlock } from './ImageBlock';
import { ButtonBlock } from './ButtonBlock';
import { SpacerBlock } from './SpacerBlock';
import { DividerBlock } from './DividerBlock';
import { IconBoxBlock } from './IconBoxBlock';
import { VideoBlock } from './VideoBlock';
import { MapBlock } from './MapBlock';
import { CardBlock } from './CardBlock';
import { HtmlBlock } from './HtmlBlock';

export const rawWidgetBlocks = [
  HeadingBlock,
  TextBlock,
  ImageBlock,
  ButtonBlock,
  SpacerBlock,
  DividerBlock,
  IconBoxBlock,
  VideoBlock,
  MapBlock,
  CardBlock,
  HtmlBlock,
];

/**
 * Widget yang boleh dimasukkan ke dalam kolom container.
 * `disabled` disuntikkan agar widget bisa disembunyikan dari builder.
 */
export const widgetBlocks = rawWidgetBlocks.map(withDisabled);

export const widgetSlugs = rawWidgetBlocks.map((block) => block.slug);

export {
  HeadingBlock,
  TextBlock,
  ImageBlock,
  ButtonBlock,
  SpacerBlock,
  DividerBlock,
  IconBoxBlock,
  VideoBlock,
  MapBlock,
  CardBlock,
  HtmlBlock,
};
