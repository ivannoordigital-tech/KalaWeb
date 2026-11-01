import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  parseBuilderFieldPath,
  humanizeBuilderField,
} from '../src/components/admin/builder/validation-utils';

describe('parseBuilderFieldPath', () => {
  test('mengenali error level array', () => {
    assert.deepEqual(parseBuilderFieldPath('layout'), { rowIndex: null, fieldPath: '' });
  });

  test('mengenali baris tanpa field', () => {
    assert.deepEqual(parseBuilderFieldPath('layout.3'), { rowIndex: 3, fieldPath: '' });
  });

  test('mengenali field di dalam blok', () => {
    assert.deepEqual(parseBuilderFieldPath('layout.0.title'), { rowIndex: 0, fieldPath: 'title' });
  });

  test('mengenali field bersarang di dalam inner item', () => {
    assert.deepEqual(parseBuilderFieldPath('layout.3.images.0.alt'), {
      rowIndex: 3,
      fieldPath: 'images.0.alt',
    });
  });

  test('mengabaikan path di luar layout', () => {
    assert.equal(parseBuilderFieldPath('title'), null);
    assert.equal(parseBuilderFieldPath('seo.meta.title'), null);
  });

  test('menangani indeks tidak valid', () => {
    assert.deepEqual(parseBuilderFieldPath('layout.abc'), {
      rowIndex: null,
      fieldPath: 'abc',
    });
  });
});

describe('humanizeBuilderField', () => {
  test('memakai label ramah', () => {
    assert.equal(humanizeBuilderField('imageAlt'), 'Teks alternatif gambar');
    assert.equal(humanizeBuilderField('layout.0.ctaLabel'), 'Teks tombol');
  });

  test('membuang segmen angka', () => {
    assert.equal(humanizeBuilderField('images.2.alt'), 'Teks alternatif');
  });

  test('fallback ke camelCase yang dirapikan', () => {
    assert.equal(humanizeBuilderField('someOddField'), 'Some Odd Field');
  });

  test('kosong berarti susunan seksi', () => {
    assert.equal(humanizeBuilderField(''), 'Susunan seksi');
  });
});
