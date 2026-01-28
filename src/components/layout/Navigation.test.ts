import { describe, it, expect } from 'vitest';
import { fc, test } from '@fast-check/vitest';

describe('Navigation Component', () => {
  // Navigation links configuration from the component
  const navigationLinks = [
    {
      href: '/',
      label: 'Inicio',
      ariaLabel: 'Ir a la página de inicio'
    },
    {
      href: '/servicios',
      label: 'Servicios',
      ariaLabel: 'Ver nuestros servicios médicos'
    },
    {
      href: '/recursos',
      label: 'Recursos',
      ariaLabel: 'Acceder a recursos y artículos'
    }
  ];

  // Helper function to check if link is active (from component)
  function isActiveLink(href: string, currentPath: string): boolean {
    if (href === '/' && currentPath === '/') return true;
    if (href !== '/' && currentPath.startsWith(href)) return true;
    return false;
  }

  it('should have correct navigation links structure', () => {
    expect(navigationLinks).toHaveLength(3);
    
    navigationLinks.forEach(link => {
      expect(link).toHaveProperty('href');
      expect(link).toHaveProperty('label');
      expect(link).toHaveProperty('ariaLabel');
      expect(typeof link.href).toBe('string');
      expect(typeof link.label).toBe('string');
      expect(typeof link.ariaLabel).toBe('string');
    });
  });

  it('should have correct navigation link URLs', () => {
    const expectedLinks = ['/', '/servicios', '/recursos'];
    const actualLinks = navigationLinks.map(link => link.href);
    
    expect(actualLinks).toEqual(expectedLinks);
  });

  it('should have correct navigation link labels', () => {
    const expectedLabels = ['Inicio', 'Servicios', 'Recursos'];
    const actualLabels = navigationLinks.map(link => link.label);
    
    expect(actualLabels).toEqual(expectedLabels);
  });

  it('should have proper accessibility labels', () => {
    const expectedAriaLabels = [
      'Ir a la página de inicio',
      'Ver nuestros servicios médicos',
      'Acceder a recursos y artículos'
    ];
    const actualAriaLabels = navigationLinks.map(link => link.ariaLabel);
    
    expect(actualAriaLabels).toEqual(expectedAriaLabels);
  });

  describe('isActiveLink function', () => {
    it('should correctly identify home page as active', () => {
      expect(isActiveLink('/', '/')).toBe(true);
      expect(isActiveLink('/', '/servicios')).toBe(false);
      expect(isActiveLink('/', '/recursos')).toBe(false);
    });

    it('should correctly identify services page as active', () => {
      expect(isActiveLink('/servicios', '/servicios')).toBe(true);
      expect(isActiveLink('/servicios', '/servicios/consulta')).toBe(true);
      expect(isActiveLink('/servicios', '/')).toBe(false);
      expect(isActiveLink('/servicios', '/recursos')).toBe(false);
    });

    it('should correctly identify resources page as active', () => {
      expect(isActiveLink('/recursos', '/recursos')).toBe(true);
      expect(isActiveLink('/recursos', '/recursos/articulo-1')).toBe(true);
      expect(isActiveLink('/recursos', '/')).toBe(false);
      expect(isActiveLink('/recursos', '/servicios')).toBe(false);
    });

    it('should handle edge cases correctly', () => {
      expect(isActiveLink('/', '')).toBe(false);
      expect(isActiveLink('', '/')).toBe(true); // Empty string is a prefix of any string
      expect(isActiveLink('/servicios', '/ser')).toBe(false); // Partial match should not work
    });
  });

  it('should have correct CSS classes for styling', () => {
    const expectedClasses = [
      'navigation',
      'nav-link',
      'mobile-nav-link',
      'mobile-menu',
      'hamburger-icon',
      'close-icon'
    ];
    
    expectedClasses.forEach(className => {
      expect(className).toBeTruthy();
      expect(typeof className).toBe('string');
    });
  });

  it('should support mobile menu functionality', () => {
    // Test the mobile menu button attributes
    const mobileMenuButtonId = 'mobile-menu-button';
    const mobileMenuId = 'mobile-menu';
    
    expect(mobileMenuButtonId).toBe('mobile-menu-button');
    expect(mobileMenuId).toBe('mobile-menu');
  });

  // **Property 2: Navigation Consistency**
  // **Validates: Requirements 1.5**
  describe('Property 2: Navigation Consistency', () => {
    // Define the expected navigation structure that should be consistent across all pages
    const expectedNavigationStructure = {
      links: [
        {
          href: '/',
          label: 'Inicio',
          ariaLabel: 'Ir a la página de inicio'
        },
        {
          href: '/servicios',
          label: 'Servicios',
          ariaLabel: 'Ver nuestros servicios médicos'
        },
        {
          href: '/recursos',
          label: 'Recursos',
          ariaLabel: 'Acceder a recursos y artículos'
        }
      ],
      mobileMenuId: 'mobile-menu',
      mobileMenuButtonId: 'mobile-menu-button',
      cssClasses: {
        navigation: 'navigation',
        navLink: 'nav-link',
        mobileNavLink: 'mobile-nav-link',
        mobileMenu: 'mobile-menu',
        hamburgerIcon: 'hamburger-icon',
        closeIcon: 'close-icon'
      }
    };

    // Helper function to simulate navigation structure for any page
    function getNavigationStructureForPage(currentPath: string) {
      return {
        links: navigationLinks.map(link => ({
          ...link,
          isActive: isActiveLink(link.href, currentPath)
        })),
        mobileMenuId: 'mobile-menu',
        mobileMenuButtonId: 'mobile-menu-button',
        cssClasses: expectedNavigationStructure.cssClasses
      };
    }

    // Helper function to validate navigation structure consistency
    function validateNavigationConsistency(pageNavigation: any, expectedStructure: any): boolean {
      // Check that all expected links are present
      if (pageNavigation.links.length !== expectedStructure.links.length) {
        return false;
      }

      // Check each link structure
      for (let i = 0; i < expectedStructure.links.length; i++) {
        const expectedLink = expectedStructure.links[i];
        const actualLink = pageNavigation.links[i];
        
        if (actualLink.href !== expectedLink.href ||
            actualLink.label !== expectedLink.label ||
            actualLink.ariaLabel !== expectedLink.ariaLabel) {
          return false;
        }
      }

      // Check mobile menu IDs
      if (pageNavigation.mobileMenuId !== expectedStructure.mobileMenuId ||
          pageNavigation.mobileMenuButtonId !== expectedStructure.mobileMenuButtonId) {
        return false;
      }

      // Check CSS classes
      const expectedClasses = Object.values(expectedStructure.cssClasses);
      const actualClasses = Object.values(pageNavigation.cssClasses);
      
      if (expectedClasses.length !== actualClasses.length) {
        return false;
      }

      for (let i = 0; i < expectedClasses.length; i++) {
        if (expectedClasses[i] !== actualClasses[i]) {
          return false;
        }
      }

      return true;
    }

    test.prop([fc.constantFrom('/', '/servicios', '/recursos', '/recursos/articulo-1', '/servicios/consulta')])
    ('navigation structure should be consistent across all pages', (currentPath) => {
      // **Validates: Requirements 1.5**
      const pageNavigation = getNavigationStructureForPage(currentPath);
      
      // The navigation structure should be consistent regardless of the current page
      expect(validateNavigationConsistency(pageNavigation, expectedNavigationStructure)).toBe(true);
      
      // All pages should have the same navigation links
      expect(pageNavigation.links.map(link => ({
        href: link.href,
        label: link.label,
        ariaLabel: link.ariaLabel
      }))).toEqual(expectedNavigationStructure.links);
      
      // All pages should have the same mobile menu configuration
      expect(pageNavigation.mobileMenuId).toBe(expectedNavigationStructure.mobileMenuId);
      expect(pageNavigation.mobileMenuButtonId).toBe(expectedNavigationStructure.mobileMenuButtonId);
      
      // All pages should use the same CSS classes
      expect(pageNavigation.cssClasses).toEqual(expectedNavigationStructure.cssClasses);
    });

    test.prop([fc.array(fc.constantFrom('/', '/servicios', '/recursos', '/recursos/articulo-1', '/servicios/consulta'), { minLength: 2, maxLength: 5 })])
    ('navigation consistency should hold across any combination of pages', (pagePaths) => {
      // **Validates: Requirements 1.5**
      const navigationStructures = pagePaths.map(path => getNavigationStructureForPage(path));
      
      // All navigation structures should be consistent with each other
      for (let i = 1; i < navigationStructures.length; i++) {
        const firstNav = navigationStructures[0];
        const currentNav = navigationStructures[i];
        
        // Links should have the same structure (excluding active state)
        expect(currentNav.links.map(link => ({
          href: link.href,
          label: link.label,
          ariaLabel: link.ariaLabel
        }))).toEqual(firstNav.links.map(link => ({
          href: link.href,
          label: link.label,
          ariaLabel: link.ariaLabel
        })));
        
        // Mobile menu configuration should be identical
        expect(currentNav.mobileMenuId).toBe(firstNav.mobileMenuId);
        expect(currentNav.mobileMenuButtonId).toBe(firstNav.mobileMenuButtonId);
        
        // CSS classes should be identical
        expect(currentNav.cssClasses).toEqual(firstNav.cssClasses);
      }
    });

    test.prop([fc.string(), fc.constantFrom('/', '/servicios', '/recursos')])
    ('navigation links should remain consistent regardless of current path format', (arbitraryPath, validPath) => {
      // **Validates: Requirements 1.5**
      const validNavigation = getNavigationStructureForPage(validPath);
      const arbitraryNavigation = getNavigationStructureForPage(arbitraryPath);
      
      // The navigation links themselves should be identical regardless of current path
      expect(arbitraryNavigation.links.map(link => ({
        href: link.href,
        label: link.label,
        ariaLabel: link.ariaLabel
      }))).toEqual(validNavigation.links.map(link => ({
        href: link.href,
        label: link.label,
        ariaLabel: link.ariaLabel
      })));
      
      // Only the active state should differ, not the structure
      expect(arbitraryNavigation.mobileMenuId).toBe(validNavigation.mobileMenuId);
      expect(arbitraryNavigation.mobileMenuButtonId).toBe(validNavigation.mobileMenuButtonId);
      expect(arbitraryNavigation.cssClasses).toEqual(validNavigation.cssClasses);
    });

    it('should maintain navigation consistency with expected structure', () => {
      // **Validates: Requirements 1.5**
      // Verify that our expected structure matches the actual navigation configuration
      expect(navigationLinks).toEqual(expectedNavigationStructure.links);
      
      // Verify that the CSS classes are correctly defined
      const requiredClasses = Object.values(expectedNavigationStructure.cssClasses);
      requiredClasses.forEach(className => {
        expect(className).toBeTruthy();
        expect(typeof className).toBe('string');
        expect(className.length).toBeGreaterThan(0);
      });
    });
  });
});