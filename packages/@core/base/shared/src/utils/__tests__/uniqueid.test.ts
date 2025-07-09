import { describe, expect, it } from 'vitest';

import { unique_Id } from '../uniqueId';

describe('uniqueid', () => {
  it('should be defined', () => {
    const id = unique_Id('xyqt');
    console.log('🚀 ~ it ~ id:', id);
    expect(id).is('xyqt', 'xyqt');
  });
});
