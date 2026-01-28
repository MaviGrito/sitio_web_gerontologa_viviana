import { describe, it, expect } from 'vitest';
import { fc, test } from '@fast-check/vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import {
  DESIGN_SYSTEM_COLORS,
  DESIGN_SYSTEM_TYPOGRAPHY,
  extractColorsFromCSS,
  extractColorsFromTailwindConfig,
  extractFontFamiliesFromCSS,
  extractFontFamiliesFromTailwindConfig,
  getElementTypeFromSelector,
  getValidDesignSystemColors,
  isValidDesignSystemColor,
  isValidTypographyForElement,
  normalizeHexColor,
  validateColorsAgainstDesignSystem,
  validateTailwindTypographyConfig,
  validateTypographyConsistency
} from './design-system';

// **Validates: Requirements 6.1**
describe('Property 14: Design System Colors', () => {
  // Helper function to read files
  const readProjectFile = (relativePath: string): string => {
    try {
      return readFileSync(join(process.cwd(), relativePath), 'utf-8');
    } catch (error) {
      console.warn(`Could not read file ${relativePath}:`, error);
      return '';
    }
  };

  describe('Design System Color Definitions', () => {
    it('should have all required colors defined', () => {
      expect(DESIGN_SYSTEM_COLORS.primary.dark).toBe('#136038');
      expect(DESIGN_SYSTEM_COLORS.primary.main).toBe('#03A63C');
      expect(DESIGN_SYSTEM_COLORS.primary.light).toBe('#99EBB9');
      expect(DESIGN_SYSTEM_COLORS.white).toBe('#FFFFFF');
    });

    it('should have semantic aliases matching primary colors', () => {
      expect(DESIGN_SYSTEM_COLORS.gerontologist['dark-green']).toBe('#136038');
      expect(DESIGN_SYSTEM_COLORS.gerontologist['accent-green']).toBe('#03A63C');
      expect(DESIGN_SYSTEM_COLORS.gerontologist['light-green']).toBe('#99EBB9');
      expect(DESIGN_SYSTEM_COLORS.gerontologist.white).toBe('#FFFFFF');
    });
  });

  describe('Color Validation Functions', () => {
    test.prop([fc.string()])('normalizeHexColor should handle any string input safely', (input) => {
      const result = normalizeHexColor(input);
      expect(typeof result).toBe('string');
    });

    test.prop([fc.string({ minLength: 3, maxLength: 6 }).filter(s => /^[0-9A-Fa-f]+$/.test(s))])('normalizeHexColor should properly format valid hex colors', (hexString) => {
      const colorWithHash = '#' + hexString;
      const result = normalizeHexColor(colorWithHash);
      
      // Should always start with #
      expect(result).toMatch(/^#/);
      
      // For 3-digit hex, should become 7 characters (#RRGGBB)
      // For 6-digit hex, should remain 7 characters (#RRGGBB)
      // For other lengths, should return original
      if (hexString.length === 3) {
        expect(result.length).toBe(7);
        expect(result).toMatch(/^#[0-9A-F]{6}$/);
      } else if (hexString.length === 6) {
        expect(result.length).toBe(7);
        expect(result).toMatch(/^#[0-9A-F]{6}$/);
      } else {
        // For invalid lengths, should return original
        expect(result).toBe(colorWithHash);
      }
    });

    test.prop([fc.constantFrom(...getValidDesignSystemColors())])('isValidDesignSystemColor should return true for all design system colors', (validColor) => {
      expect(isValidDesignSystemColor(validColor)).toBe(true);
    });

    test.prop([fc.string().filter(s => !getValidDesignSystemColors().includes(s.toUpperCase()))])('isValidDesignSystemColor should return false for non-design-system colors', (invalidColor) => {
      // Skip if the random string happens to match a valid color
      if (getValidDesignSystemColors().includes(invalidColor.toUpperCase())) {
        return;
      }
      expect(isValidDesignSystemColor(invalidColor)).toBe(false);
    });
  });

  describe('CSS Color Extraction', () => {
    test.prop([fc.array(fc.constantFrom(...getValidDesignSystemColors()), { minLength: 1, maxLength: 10 })])('extractColorsFromCSS should find all design system colors in CSS content', (colors) => {
      // Create CSS content with the colors
      const cssContent = colors.map(color => `.test { color: ${color}; }`).join('\n');
      
      const extractedColors = extractColorsFromCSS(cssContent);
      
      // All input colors should be found
      colors.forEach(color => {
        expect(extractedColors).toContain(color.toUpperCase());
      });
    });

    test.prop([fc.string()])('extractColorsFromCSS should never throw errors', (cssContent) => {
      expect(() => extractColorsFromCSS(cssContent)).not.toThrow();
    });
  });

  describe('Design System Compliance Validation', () => {
    test.prop([fc.array(fc.constantFrom(...getValidDesignSystemColors()), { minLength: 1 })])('validateColorsAgainstDesignSystem should mark all design system colors as valid', (validColors) => {
      const result = validateColorsAgainstDesignSystem(validColors);
      
      expect(result.isCompliant).toBe(true);
      expect(result.invalid).toHaveLength(0);
      expect(result.valid.length).toBeGreaterThan(0);
    });

    test.prop([fc.array(fc.string().filter(s => !getValidDesignSystemColors().includes(s.toUpperCase())), { minLength: 1 })])('validateColorsAgainstDesignSystem should mark non-design-system colors as invalid', (invalidColors) => {
      // Filter out any colors that accidentally match design system colors
      const actuallyInvalidColors = invalidColors.filter(color => 
        !getValidDesignSystemColors().includes(normalizeHexColor(color))
      );
      
      if (actuallyInvalidColors.length === 0) {
        return; // Skip if no actually invalid colors
      }
      
      const result = validateColorsAgainstDesignSystem(actuallyInvalidColors);
      
      expect(result.isCompliant).toBe(false);
      expect(result.invalid.length).toBeGreaterThan(0);
    });

    test.prop([
      fc.array(fc.constantFrom(...getValidDesignSystemColors()), { minLength: 1 }),
      fc.array(fc.string().filter(s => !getValidDesignSystemColors().includes(s.toUpperCase())), { minLength: 1 })
    ])('validateColorsAgainstDesignSystem should correctly separate valid and invalid colors', (validColors, invalidColors) => {
      const actuallyInvalidColors = invalidColors.filter(color => 
        !getValidDesignSystemColors().includes(normalizeHexColor(color))
      );
      
      if (actuallyInvalidColors.length === 0) {
        return; // Skip if no actually invalid colors
      }
      
      const mixedColors = [...validColors, ...actuallyInvalidColors];
      const result = validateColorsAgainstDesignSystem(mixedColors);
      
      expect(result.valid.length).toBeGreaterThan(0);
      expect(result.invalid.length).toBeGreaterThan(0);
      expect(result.isCompliant).toBe(false);
    });
  });

  describe('Project File Compliance', () => {
    it('should validate that global.css uses only design system colors', () => {
      const globalCSS = readProjectFile('src/styles/global.css');
      
      if (globalCSS) {
        const extractedColors = extractColorsFromCSS(globalCSS);
        const validation = validateColorsAgainstDesignSystem(extractedColors);
        
        // Log any invalid colors for debugging
        if (!validation.isCompliant) {
          console.warn('Invalid colors found in global.css:', validation.invalid);
        }
        
        expect(validation.isCompliant).toBe(true);
        expect(validation.invalid).toHaveLength(0);
      }
    });

    it('should validate that tailwind.config.mjs uses only design system colors', () => {
      const tailwindConfig = readProjectFile('tailwind.config.mjs');
      
      if (tailwindConfig) {
        const extractedColors = extractColorsFromTailwindConfig(tailwindConfig);
        const validation = validateColorsAgainstDesignSystem(extractedColors);
        
        // Log any invalid colors for debugging
        if (!validation.isCompliant) {
          console.warn('Invalid colors found in tailwind.config.mjs:', validation.invalid);
        }
        
        expect(validation.isCompliant).toBe(true);
        expect(validation.invalid).toHaveLength(0);
      }
    });

    test.prop([fc.constantFrom('src/styles/global.css', 'tailwind.config.mjs')])('any project file with colors should use only design system colors', (filePath) => {
      const fileContent = readProjectFile(filePath);
      
      if (fileContent) {
        const extractedColors = filePath.endsWith('.css') 
          ? extractColorsFromCSS(fileContent)
          : extractColorsFromTailwindConfig(fileContent);
        
        if (extractedColors.length > 0) {
          const validation = validateColorsAgainstDesignSystem(extractedColors);
          
          // Property: All colors in project files must be from the design system
          expect(validation.isCompliant).toBe(true);
        }
      }
    });
  });

  describe('Color Consistency Properties', () => {
    test.prop([fc.constantFrom(...getValidDesignSystemColors())])('any valid design system color should remain valid after normalization', (color) => {
      const normalized = normalizeHexColor(color);
      expect(isValidDesignSystemColor(normalized)).toBe(true);
    });

    test.prop([fc.array(fc.constantFrom(...getValidDesignSystemColors()))])('color validation should be consistent regardless of input order', (colors) => {
      const shuffled = [...colors].sort(() => Math.random() - 0.5);
      
      const result1 = validateColorsAgainstDesignSystem(colors);
      const result2 = validateColorsAgainstDesignSystem(shuffled);
      
      expect(result1.isCompliant).toBe(result2.isCompliant);
      expect(result1.valid.sort()).toEqual(result2.valid.sort());
      expect(result1.invalid.sort()).toEqual(result2.invalid.sort());
    });

    test.prop([fc.constantFrom(...getValidDesignSystemColors())])('design system colors should be case-insensitive', (color) => {
      const lowercase = color.toLowerCase();
      const uppercase = color.toUpperCase();
      const mixedcase = color.split('').map((char, i) => i % 2 === 0 ? char.toLowerCase() : char.toUpperCase()).join('');
      
      expect(isValidDesignSystemColor(lowercase)).toBe(true);
      expect(isValidDesignSystemColor(uppercase)).toBe(true);
      expect(isValidDesignSystemColor(mixedcase)).toBe(true);
    });
  });
});

// **Validates: Requirements 6.2, 6.3**
describe('Property 15: Typography Consistency', () => {
  // Helper function to read files
  const readProjectFile = (relativePath: string): string => {
    try {
      return readFileSync(join(process.cwd(), relativePath), 'utf-8');
    } catch (error) {
      console.warn(`Could not read file ${relativePath}:`, error);
      return '';
    }
  };

  describe('Typography System Definitions', () => {
    it('should have correct font definitions', () => {
      expect(DESIGN_SYSTEM_TYPOGRAPHY.fonts.heading).toBe('Montserrat');
      expect(DESIGN_SYSTEM_TYPOGRAPHY.fonts.body).toBe('More Sugar');
      expect(DESIGN_SYSTEM_TYPOGRAPHY.weights.heading).toBe('900');
    });

    it('should have correct element selectors', () => {
      expect(DESIGN_SYSTEM_TYPOGRAPHY.headingSelectors).toContain('h1');
      expect(DESIGN_SYSTEM_TYPOGRAPHY.headingSelectors).toContain('h6');
      expect(DESIGN_SYSTEM_TYPOGRAPHY.bodySelectors).toContain('p');
      expect(DESIGN_SYSTEM_TYPOGRAPHY.bodySelectors).toContain('span');
    });
  });

  describe('Font Family Extraction', () => {
    test.prop([fc.constantFrom('Montserrat', 'More Sugar', 'Arial', 'Helvetica')])('extractFontFamiliesFromCSS should handle any font family safely', (fontFamily) => {
      const cssContent = `h1 { font-family: '${fontFamily}', sans-serif; }`;
      const result = extractFontFamiliesFromCSS(cssContent);
      
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].fontFamily).toContain(fontFamily);
    });

    test.prop([fc.constantFrom('h1', 'h2', 'p', 'span', 'div')])('extractFontFamiliesFromCSS should extract font families for any valid selector', (selector) => {
      const cssContent = `${selector} { font-family: 'Test Font', sans-serif; font-weight: 900; }`;
      const result = extractFontFamiliesFromCSS(cssContent);
      
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].selector).toBe(selector);
      expect(result[0].fontFamily).toContain('Test Font');
      expect(result[0].fontWeight).toBe('900');
    });

    test.prop([fc.string()])('extractFontFamiliesFromCSS should never throw errors', (cssContent) => {
      expect(() => extractFontFamiliesFromCSS(cssContent)).not.toThrow();
    });
  });

  describe('Element Type Detection', () => {
    test.prop([fc.constantFrom('h1', 'h2', 'h3', 'h4', 'h5', 'h6')])('getElementTypeFromSelector should identify heading elements', (headingTag) => {
      expect(getElementTypeFromSelector(headingTag)).toBe('heading');
      expect(getElementTypeFromSelector(`.some-class ${headingTag}`)).toBe('heading');
      expect(getElementTypeFromSelector(`${headingTag}.class-name`)).toBe('heading');
    });

    test.prop([fc.constantFrom('p', 'span', 'div', 'a', 'li')])('getElementTypeFromSelector should identify body elements', (bodyTag) => {
      expect(getElementTypeFromSelector(bodyTag)).toBe('body');
      expect(getElementTypeFromSelector(`.some-class ${bodyTag}`)).toBe('body');
      expect(getElementTypeFromSelector(`${bodyTag}.class-name`)).toBe('body');
    });

    test.prop([fc.constantFrom('.font-heading', '.heading-class', 'h1.font-heading')])('getElementTypeFromSelector should identify heading classes', (headingClass) => {
      expect(getElementTypeFromSelector(headingClass)).toBe('heading');
    });

    test.prop([fc.constantFrom('.font-body', '.body-text', 'p.font-body')])('getElementTypeFromSelector should identify body classes', (bodyClass) => {
      expect(getElementTypeFromSelector(bodyClass)).toBe('body');
    });
  });

  describe('Typography Validation', () => {
    test.prop([fc.constantFrom('Montserrat', 'montserrat', 'MONTSERRAT')])('isValidTypographyForElement should accept Montserrat for headings (case insensitive)', (fontFamily) => {
      expect(isValidTypographyForElement('heading', fontFamily, '900')).toBe(true);
      expect(isValidTypographyForElement('heading', `'${fontFamily}', sans-serif`)).toBe(true);
    });

    test.prop([fc.constantFrom('More Sugar', 'more sugar', 'MORE SUGAR')])('isValidTypographyForElement should accept More Sugar for body text (case insensitive)', (fontFamily) => {
      expect(isValidTypographyForElement('body', fontFamily)).toBe(true);
      expect(isValidTypographyForElement('body', `'${fontFamily}', sans-serif`)).toBe(true);
    });

    test.prop([fc.constantFrom('Arial', 'Helvetica', 'Times New Roman')])('isValidTypographyForElement should reject non-design-system fonts', (fontFamily) => {
      expect(isValidTypographyForElement('heading', fontFamily, '900')).toBe(false);
      expect(isValidTypographyForElement('body', fontFamily)).toBe(false);
    });

    test.prop([fc.constantFrom('900', 'extrabold')])('isValidTypographyForElement should accept correct font weights for headings', (fontWeight) => {
      expect(isValidTypographyForElement('heading', 'Montserrat', fontWeight)).toBe(true);
    });

    test.prop([fc.constantFrom('400', 'normal', 'bold')])('isValidTypographyForElement should reject incorrect font weights for headings', (fontWeight) => {
      expect(isValidTypographyForElement('heading', 'Montserrat', fontWeight)).toBe(false);
    });
  });

  describe('CSS Typography Compliance', () => {
    test.prop([
      fc.constantFrom('h1', 'h2', 'h3', 'h4', 'h5', 'h6'),
      fc.constantFrom('Montserrat', 'montserrat'),
      fc.constantFrom('900', 'extrabold')
    ])('validateTypographyConsistency should mark correct heading typography as valid', (selector, fontFamily, fontWeight) => {
      const cssContent = `${selector} { font-family: '${fontFamily}', sans-serif; font-weight: ${fontWeight}; }`;
      const result = validateTypographyConsistency(cssContent);
      
      expect(result.isCompliant).toBe(true);
      expect(result.valid.length).toBeGreaterThan(0);
      expect(result.invalid.length).toBe(0);
    });

    test.prop([
      fc.constantFrom('p', 'span', 'div'),
      fc.constantFrom('More Sugar', 'more sugar')
    ])('validateTypographyConsistency should mark correct body typography as valid', (selector, fontFamily) => {
      const cssContent = `${selector} { font-family: '${fontFamily}', sans-serif; }`;
      const result = validateTypographyConsistency(cssContent);
      
      expect(result.isCompliant).toBe(true);
      expect(result.valid.length).toBeGreaterThan(0);
      expect(result.invalid.length).toBe(0);
    });

    test.prop([
      fc.constantFrom('h1', 'h2', 'p', 'span'),
      fc.constantFrom('Arial', 'Helvetica', 'Times New Roman')
    ])('validateTypographyConsistency should mark incorrect fonts as invalid', (selector, fontFamily) => {
      const cssContent = `${selector} { font-family: '${fontFamily}', sans-serif; }`;
      const result = validateTypographyConsistency(cssContent);
      
      expect(result.isCompliant).toBe(false);
      expect(result.invalid.length).toBeGreaterThan(0);
    });

    test.prop([fc.string()])('validateTypographyConsistency should never throw errors', (cssContent) => {
      expect(() => validateTypographyConsistency(cssContent)).not.toThrow();
    });
  });

  describe('TailwindCSS Configuration Validation', () => {
    test.prop([fc.constantFrom('heading', 'montserrat', 'font-heading')])('validateTailwindTypographyConfig should validate heading font configurations', (configName) => {
      const configContent = `
        fontFamily: {
          '${configName}': ['Montserrat', 'sans-serif'],
        }
      `;
      const result = validateTailwindTypographyConfig(configContent);
      
      expect(result.isCompliant).toBe(true);
      expect(result.valid.length).toBeGreaterThan(0);
      expect(result.invalid.length).toBe(0);
    });

    test.prop([fc.constantFrom('body', 'more-sugar', 'font-body')])('validateTailwindTypographyConfig should validate body font configurations', (configName) => {
      const configContent = `
        fontFamily: {
          '${configName}': ['More Sugar', 'sans-serif'],
        }
      `;
      const result = validateTailwindTypographyConfig(configContent);
      
      expect(result.isCompliant).toBe(true);
      expect(result.valid.length).toBeGreaterThan(0);
      expect(result.invalid.length).toBe(0);
    });

    test.prop([fc.string()])('validateTailwindTypographyConfig should never throw errors', (configContent) => {
      expect(() => validateTailwindTypographyConfig(configContent)).not.toThrow();
    });
  });

  describe('Project File Typography Compliance', () => {
    it('should validate that global.css uses correct typography', () => {
      const globalCSS = readProjectFile('src/styles/global.css');
      
      if (globalCSS) {
        const validation = validateTypographyConsistency(globalCSS);
        
        // Log any invalid typography for debugging
        if (!validation.isCompliant) {
          console.warn('Invalid typography found in global.css:', validation.invalid);
        }
        
        expect(validation.isCompliant).toBe(true);
        expect(validation.invalid).toHaveLength(0);
      }
    });

    it('should validate that tailwind.config.mjs uses correct font families', () => {
      const tailwindConfig = readProjectFile('tailwind.config.mjs');
      
      if (tailwindConfig) {
        const validation = validateTailwindTypographyConfig(tailwindConfig);
        
        // Log any invalid font configurations for debugging
        if (!validation.isCompliant) {
          console.warn('Invalid font configuration found in tailwind.config.mjs:', validation.invalid);
        }
        
        expect(validation.isCompliant).toBe(true);
        expect(validation.invalid).toHaveLength(0);
      }
    });

    test.prop([fc.constantFrom('src/styles/global.css', 'tailwind.config.mjs')])('any project file with typography should use design system fonts', (filePath) => {
      const fileContent = readProjectFile(filePath);
      
      if (fileContent) {
        if (filePath.endsWith('.css')) {
          const validation = validateTypographyConsistency(fileContent);
          
          if (validation.valid.length > 0 || validation.invalid.length > 0) {
            // Property: All typography in CSS files must follow design system
            expect(validation.isCompliant).toBe(true);
          }
        } else if (filePath.includes('tailwind.config')) {
          const validation = validateTailwindTypographyConfig(fileContent);
          
          if (validation.valid.length > 0 || validation.invalid.length > 0) {
            // Property: All font configurations in Tailwind must follow design system
            expect(validation.isCompliant).toBe(true);
          }
        }
      }
    });
  });

  describe('Typography Consistency Properties', () => {
    test.prop([fc.constantFrom('heading', 'body')])('typography validation should be consistent regardless of case', (elementType) => {
      const fontFamily = elementType === 'heading' ? 'Montserrat' : 'More Sugar';
      const fontWeight = elementType === 'heading' ? '900' : undefined;
      
      const lowercase = fontFamily.toLowerCase();
      const uppercase = fontFamily.toUpperCase();
      const mixedcase = fontFamily.split('').map((char, i) => i % 2 === 0 ? char.toLowerCase() : char.toUpperCase()).join('');
      
      expect(isValidTypographyForElement(elementType, lowercase, fontWeight)).toBe(true);
      expect(isValidTypographyForElement(elementType, uppercase, fontWeight)).toBe(true);
      expect(isValidTypographyForElement(elementType, mixedcase, fontWeight)).toBe(true);
    });

    test.prop([
      fc.array(fc.constantFrom('h1', 'h2', 'p', 'span'), { minLength: 1, maxLength: 5 }),
      fc.constantFrom('Montserrat', 'More Sugar')
    ])('typography validation should be consistent regardless of selector order', (selectors, fontFamily) => {
      const cssContent1 = selectors.map(sel => `${sel} { font-family: '${fontFamily}', sans-serif; }`).join('\n');
      const cssContent2 = [...selectors].reverse().map(sel => `${sel} { font-family: '${fontFamily}', sans-serif; }`).join('\n');
      
      const result1 = validateTypographyConsistency(cssContent1);
      const result2 = validateTypographyConsistency(cssContent2);
      
      expect(result1.isCompliant).toBe(result2.isCompliant);
      expect(result1.valid.length).toBe(result2.valid.length);
      expect(result1.invalid.length).toBe(result2.invalid.length);
    });

    test.prop([fc.constantFrom('Montserrat', 'More Sugar')])('font family validation should work with or without quotes', (fontFamily) => {
      const withQuotes = `'${fontFamily}', sans-serif`;
      const withDoubleQuotes = `"${fontFamily}", sans-serif`;
      const withoutQuotes = `${fontFamily}, sans-serif`;
      
      const elementType = fontFamily === 'Montserrat' ? 'heading' : 'body';
      const fontWeight = elementType === 'heading' ? '900' : undefined;
      
      expect(isValidTypographyForElement(elementType, withQuotes, fontWeight)).toBe(true);
      expect(isValidTypographyForElement(elementType, withDoubleQuotes, fontWeight)).toBe(true);
      expect(isValidTypographyForElement(elementType, withoutQuotes, fontWeight)).toBe(true);
    });

    test.prop([
      fc.constantFrom('h1', 'h2', 'h3', 'h4', 'h5', 'h6'),
      fc.constantFrom('p', 'span', 'div', 'a', 'li')
    ])('any heading element should use Montserrat and any body element should use More Sugar', (headingSelector, bodySelector) => {
      const cssContent = `
        ${headingSelector} { font-family: 'Montserrat', sans-serif; font-weight: 900; }
        ${bodySelector} { font-family: 'More Sugar', sans-serif; }
      `;
      
      const result = validateTypographyConsistency(cssContent);
      
      // Property: Typography consistency must hold for all valid element combinations
      expect(result.isCompliant).toBe(true);
      expect(result.valid.length).toBe(2);
      expect(result.invalid.length).toBe(0);
    });
  });
});