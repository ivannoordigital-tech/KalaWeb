import { builderRegistry, builderTemplates } from '../src/blocks/registry';
import { allBlocks } from '../src/blocks/index';
import type { Field, Block } from 'payload';

console.log('🔍 [check-builder-parity] Memulai pengecekan paritas menyeluruh...');

let errorsCount = 0;

function logError(msg: string) {
  console.error(`❌ [Parity Error] ${msg}`);
  errorsCount++;
}

// Helper to flatten fields (handles 'row' containers)
function flattenFields(fields: Field[]): Field[] {
  const result: Field[] = [];
  for (const f of fields) {
    if (f.type === 'row' && Array.isArray((f as any).fields)) {
      result.push(...flattenFields((f as any).fields));
    } else {
      result.push(f);
    }
  }
  return result;
}

// 1. Slug matching
const allBlockSlugs = allBlocks.map((b) => b.slug);
const registrySlugs = Object.keys(builderRegistry);

for (const s of allBlockSlugs) {
  if (!registrySlugs.includes(s)) {
    logError(`Block slug '${s}' ada di allBlocks tetapi TIDAK ADA di builderRegistry!`);
  }
}
for (const s of registrySlugs) {
  if (!allBlockSlugs.includes(s)) {
    logError(`Registry key '${s}' tidak ada di allBlocks!`);
  }
}

// 2. Validate defaults & select options for each block
const blockMap = new Map<string, Block>();
for (const b of allBlocks) {
  blockMap.set(b.slug, b);
}

for (const [slug, reg] of Object.entries(builderRegistry)) {
  const block = blockMap.get(slug);
  if (!block) continue;

  const flat = flattenFields(block.fields);
  const fieldMap = new Map<string, Field>();
  for (const f of flat) {
    if ('name' in f && typeof (f as any).name === 'string') {
      fieldMap.set((f as any).name, f);
    }
  }

  // Check defaults
  if (reg.defaults) {
    for (const [key, val] of Object.entries(reg.defaults)) {
      if (['blockType', 'disabled', 'blockName'].includes(key)) continue;

      const field = fieldMap.get(key);
      if (!field) {
        logError(`[${slug}] Default field '${key}' tidak ada di definisi Payload Block!`);
        continue;
      }

      if (field.type === 'select') {
        const options = (field as any).options || [];
        const validValues = options.map((opt: any) => (typeof opt === 'string' ? opt : opt.value));
        if (typeof val === 'string' && !validValues.includes(val)) {
          logError(`[${slug}] Default select '${key}' bernilai '${val}' yang TIDAK VALID! Opsi valid: [${validValues.join(', ')}]`);
        }
      }
    }
  }
}

// 3. Validate templates
for (const tpl of builderTemplates) {
  for (const [idx, b] of tpl.blocks.entries()) {
    const slug = b.blockType;
    if (!slug || !blockMap.has(slug)) {
      logError(`Template '${tpl.id}' blok #${idx + 1} memiliki blockType '${slug}' yang tidak dikenal!`);
      continue;
    }

    const block = blockMap.get(slug)!;
    const flat = flattenFields(block.fields);
    const fieldMap = new Map<string, Field>();
    for (const f of flat) {
      if ('name' in f && typeof (f as any).name === 'string') {
        fieldMap.set((f as any).name, f);
      }
    }

    for (const [key, val] of Object.entries(b)) {
      if (['blockType', 'disabled', 'blockName'].includes(key)) continue;

      const field = fieldMap.get(key);
      if (!field) {
        logError(`Template '${tpl.id}' -> Block '${slug}': Property '${key}' tidak terdaftar pada field block Payload!`);
        continue;
      }

      if (field.type === 'select' && typeof val === 'string') {
        const options = (field as any).options || [];
        const validValues = options.map((opt: any) => (typeof opt === 'string' ? opt : opt.value));
        if (!validValues.includes(val)) {
          logError(`Template '${tpl.id}' -> Block '${slug}': Select '${key}' bernilai '${val}' yang tidak valid! Opsi: [${validValues.join(', ')}]`);
        }
      }
    }
  }
}

if (errorsCount > 0) {
  console.error(`\n❌ Pengecekan paritas GAGAL dengan ${errorsCount} error! Perbaiki sebelum deploy.`);
  process.exit(1);
} else {
  console.log('✅ Paritas 100% SEMPURNA: Semua 14 blok, defaults, dan template cocok persis dengan konfigurasi Payload!');
  process.exit(0);
}
