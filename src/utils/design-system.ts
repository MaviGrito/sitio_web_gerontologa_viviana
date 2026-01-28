/**
 * Design System Color Definitions
 * These are the official colors that should be used consistently throughout the application
 */
export const DESIGN_SYSTEM_COLORS = {
  primary: {
    dark: '#136038',
    main: '#03A63C', 
    light: '#99EBB9',
  },
  white: '#FFFFFF',
  // Semantic aliases for better developer experience
  gerontologist: {
    'dark-green': '#136038',
    'accent-green': '#03A63C',
    'light-green': '#99EBB9',
    'white': '#FFFFFF',
  }
} as const;

/**
 * Extract color values from a CSS string
 */
export function extractColorsFromCSS(cssContent: string): string[] {
  // Match hex colors (#RRGGBB or #RGB)
  const hexColorRegex = /#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\b/g;
  const matches = cssContent.match(hexColorRegex);
  return matches ? matches.map(color => color.toUpperCase()) : [];
}

/**
 * Extract color values from TailwindCSS config
 */
export function extractColorsFromTailwindConfig(configContent: string): string[] {
  // Match hex colors in the config file
  const hexColorRegex = /#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\b/g;
  const matches = configContent.match(hexColorRegex);
  return matches ? matches.map(color => color.toUpperCase()) : [];
}

/**
 * Get all valid design system colors as an array
 */
export function getValidDesignSystemColors(): string[] {
  const colors: string[] = [];
  
  // Extract colors from primary palette
  Object.values(DESIGN_SYSTEM_COLORS.primary).forEach(color => {
    colors.push(color.toUpperCase());
  });
  
  // Add white color
  colors.push(DESIGN_SYSTEM_COLORS.white);
  
  // Extract colors from gerontologist palette (avoiding duplicates)
  Object.values(DESIGN_SYSTEM_COLORS.gerontologist).forEach(color => {
    const upperColor = color.toUpperCase();
    if (!colors.includes(upperColor)) {
      colors.push(upperColor);
    }
  });
  
  return colors;
}

/**
 * Check if a color is part of the design system
 */
export function isValidDesignSystemColor(color: string): boolean {
  const validColors = getValidDesignSystemColors();
  return validColors.includes(color.toUpperCase());
}

/**
 * Normalize hex colors to uppercase 6-digit format
 */
export function normalizeHexColor(color: string): string {
  const cleanColor = color.replace('#', '').toUpperCase();
  
  // Convert 3-digit hex to 6-digit
  if (cleanColor.length === 3) {
    return '#' + cleanColor.split('').map(char => char + char).join('');
  }
  
  // Return 6-digit hex with #
  if (cleanColor.length === 6) {
    return '#' + cleanColor;
  }
  
  // For invalid lengths, return original color
  return color;
}

/**
 * Validate that all colors in a list are from the design system
 */
export function validateColorsAgainstDesignSystem(colors: string[]): {
  valid: string[];
  invalid: string[];
  isCompliant: boolean;
} {
  const validColors: string[] = [];
  const invalidColors: string[] = [];
  
  colors.forEach(color => {
    const normalizedColor = normalizeHexColor(color);
    if (isValidDesignSystemColor(normalizedColor)) {
      validColors.push(normalizedColor);
    } else {
      invalidColors.push(normalizedColor);
    }
  });
  
  return {
    valid: validColors,
    invalid: invalidColors,
    isCompliant: invalidColors.length === 0
  };
}

/**
 * Typography Design System Definitions
 */
export const DESIGN_SYSTEM_TYPOGRAPHY = {
  fonts: {
    heading: 'Montserrat',
    body: 'More Sugar',
  },
  weights: {
    heading: '900', // ExtraBold
    body: 'normal',
  },
  // CSS selectors that should use heading font
  headingSelectors: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
  // CSS selectors that should use body font
  bodySelectors: ['p', 'span', 'div', 'a', 'li', 'td', 'th'],
} as const;

/**
 * Extract font-family declarations from CSS content
 */
export function extractFontFamiliesFromCSS(cssContent: string): Array<{
  selector: string;
  fontFamily: string;
  fontWeight?: string;
}> {
  const fontDeclarations: Array<{
    selector: string;
    fontFamily: string;
    fontWeight?: string;
  }> = [];

  // Match CSS rules with font-family declarations
  const cssRuleRegex = /([^{}]+)\s*\{([^{}]*)\}/g;
  let match;

  while ((match = cssRuleRegex.exec(cssContent)) !== null) {
    const selector = match[1].trim();
    const declarations = match[2];

    // Extract font-family
    const fontFamilyMatch = declarations.match(/font-family\s*:\s*([^;]+)/);
    if (fontFamilyMatch) {
      const fontFamily = fontFamilyMatch[1].trim().replace(/['"]/g, '');
      
      // Extract font-weight if present
      const fontWeightMatch = declarations.match(/font-weight\s*:\s*([^;]+)/);
      const fontWeight = fontWeightMatch ? fontWeightMatch[1].trim() : undefined;

      fontDeclarations.push({
        selector,
        fontFamily,
        fontWeight,
      });
    }
  }

  return fontDeclarations;
}

/**
 * Extract font-family declarations from TailwindCSS config
 */
export function extractFontFamiliesFromTailwindConfig(configContent: string): Array<{
  name: string;
  fontFamily: string[];
}> {
  const fontFamilies: Array<{
    name: string;
    fontFamily: string[];
  }> = [];

  // Match fontFamily configuration in Tailwind config
  const fontFamilyMatch = configContent.match(/fontFamily\s*:\s*\{([^}]+)\}/);
  if (fontFamilyMatch) {
    const fontFamilyContent = fontFamilyMatch[1];
    
    // Match individual font family definitions
    const fontDefRegex = /['"]?([^'":\s]+)['"]?\s*:\s*\[([^\]]+)\]/g;
    let match;

    while ((match = fontDefRegex.exec(fontFamilyContent)) !== null) {
      const name = match[1];
      const fontArrayStr = match[2];
      
      // Parse the font array
      const fontArray = fontArrayStr
        .split(',')
        .map(font => font.trim().replace(/['"]/g, ''))
        .filter(font => font.length > 0);

      fontFamilies.push({
        name,
        fontFamily: fontArray,
      });
    }
  }

  return fontFamilies;
}

/**
 * Check if a font family matches the design system requirements
 */
export function isValidTypographyForElement(
  elementType: 'heading' | 'body',
  fontFamily: string,
  fontWeight?: string
): boolean {
  const expectedFont = DESIGN_SYSTEM_TYPOGRAPHY.fonts[elementType];
  const expectedWeight = DESIGN_SYSTEM_TYPOGRAPHY.weights[elementType];

  // Check if font family contains the expected font
  const fontMatches = fontFamily.toLowerCase().includes(expectedFont.toLowerCase());
  
  // Check font weight if specified
  if (fontWeight && elementType === 'heading') {
    const weightMatches = fontWeight === expectedWeight || fontWeight === 'extrabold' || fontWeight === '900';
    return fontMatches && weightMatches;
  }

  return fontMatches;
}

/**
 * Determine element type based on CSS selector
 */
export function getElementTypeFromSelector(selector: string): 'heading' | 'body' | 'unknown' {
  const cleanSelector = selector.toLowerCase().trim();
  
  // Check for class-based selectors first (more specific)
  if (cleanSelector.includes('font-heading') || cleanSelector.includes('.heading')) {
    return 'heading';
  }
  
  if (cleanSelector.includes('font-body') || cleanSelector.includes('.body')) {
    return 'body';
  }
  
  // Check for heading selectors
  for (const headingSelector of DESIGN_SYSTEM_TYPOGRAPHY.headingSelectors) {
    if (cleanSelector.includes(headingSelector)) {
      return 'heading';
    }
  }
  
  // Check for body selectors
  for (const bodySelector of DESIGN_SYSTEM_TYPOGRAPHY.bodySelectors) {
    if (cleanSelector.includes(bodySelector)) {
      return 'body';
    }
  }
  
  return 'unknown';
}

/**
 * Validate typography consistency across CSS content
 */
export function validateTypographyConsistency(cssContent: string): {
  valid: Array<{ selector: string; fontFamily: string; elementType: string }>;
  invalid: Array<{ selector: string; fontFamily: string; elementType: string; reason: string }>;
  isCompliant: boolean;
} {
  const fontDeclarations = extractFontFamiliesFromCSS(cssContent);
  const valid: Array<{ selector: string; fontFamily: string; elementType: string }> = [];
  const invalid: Array<{ selector: string; fontFamily: string; elementType: string; reason: string }> = [];

  fontDeclarations.forEach(({ selector, fontFamily, fontWeight }) => {
    const elementType = getElementTypeFromSelector(selector);
    
    if (elementType === 'unknown') {
      // Skip unknown selectors as they might be utility classes or special cases
      return;
    }

    const isValid = isValidTypographyForElement(elementType, fontFamily, fontWeight);
    
    if (isValid) {
      valid.push({ selector, fontFamily, elementType });
    } else {
      const expectedFont = DESIGN_SYSTEM_TYPOGRAPHY.fonts[elementType];
      const reason = `Expected ${expectedFont} for ${elementType} elements, got ${fontFamily}`;
      invalid.push({ selector, fontFamily, elementType, reason });
    }
  });

  return {
    valid,
    invalid,
    isCompliant: invalid.length === 0,
  };
}

/**
 * Validate TailwindCSS font configuration
 */
export function validateTailwindTypographyConfig(configContent: string): {
  valid: Array<{ name: string; fontFamily: string[] }>;
  invalid: Array<{ name: string; fontFamily: string[]; reason: string }>;
  isCompliant: boolean;
} {
  const fontFamilies = extractFontFamiliesFromTailwindConfig(configContent);
  const valid: Array<{ name: string; fontFamily: string[] }> = [];
  const invalid: Array<{ name: string; fontFamily: string[]; reason: string }> = [];

  fontFamilies.forEach(({ name, fontFamily }) => {
    let isValid = false;
    let reason = '';

    // Check if this is a heading font configuration
    if (name.includes('heading') || name.includes('montserrat')) {
      isValid = fontFamily.some(font => font.toLowerCase().includes('montserrat'));
      if (!isValid) {
        reason = `Heading font should include Montserrat, got ${fontFamily.join(', ')}`;
      }
    }
    // Check if this is a body font configuration
    else if (name.includes('body') || name.includes('more-sugar')) {
      isValid = fontFamily.some(font => font.toLowerCase().includes('more sugar'));
      if (!isValid) {
        reason = `Body font should include More Sugar, got ${fontFamily.join(', ')}`;
      }
    }
    // For other font configurations, we'll be more lenient
    else {
      isValid = true;
    }

    if (isValid) {
      valid.push({ name, fontFamily });
    } else {
      invalid.push({ name, fontFamily, reason });
    }
  });

  return {
    valid,
    invalid,
    isCompliant: invalid.length === 0,
  };
}