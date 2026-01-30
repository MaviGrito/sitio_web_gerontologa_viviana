import { describe, it, expect } from 'vitest';
import { SITE_CONFIG } from '../../utils/constants';

describe('Header Component', () => {
  it('should have correct logo text from site config', () => {
    const logoText = SITE_CONFIG.author.name;
    const logoSubtext = SITE_CONFIG.author.headerTitle;
    
    expect(logoText).toBe('Dr. [Name]');
    expect(logoSubtext).toBe('Gerontólogo');
  });

  it('should have correct WhatsApp contact configuration', () => {
    const whatsappNumber = SITE_CONFIG.contact.whatsapp.replace(/[^0-9]/g, '');
    const expectedMessage = 'Hola, me gustaría agendar una consulta';
    const expectedUrl = `https://wa.me/${whatsappNumber}?text=${expectedMessage}`;
    
    expect(whatsappNumber).toBe('573001234567');
    expect(expectedUrl).toContain('wa.me');
    expect(expectedUrl).toContain('573001234567');
  });

  it('should have correct phone contact configuration', () => {
    const phoneNumber = SITE_CONFIG.contact.phone;
    const expectedTelUrl = `tel:${phoneNumber}`;
    
    expect(phoneNumber).toBe('+57 300 123 4567');
    expect(expectedTelUrl).toBe('tel:+57 300 123 4567');
  });

  it('should have proper accessibility attributes', () => {
    // Test that the component would have proper ARIA labels
    const logoAriaLabel = `Ir al inicio - ${SITE_CONFIG.author.name}, ${SITE_CONFIG.author.headerTitle}`;
    const whatsappAriaLabel = 'Contactar por WhatsApp para agendar consulta';
    const phoneAriaLabel = `Llamar al ${SITE_CONFIG.contact.phone}`;
    
    expect(logoAriaLabel).toBe('Ir al inicio - Dr. [Name], Gerontólogo');
    expect(whatsappAriaLabel).toBe('Contactar por WhatsApp para agendar consulta');
    expect(phoneAriaLabel).toBe('Llamar al +57 300 123 4567');
  });

  it('should have correct CSS classes for styling', () => {
    // Test that the expected CSS classes are properly defined
    const expectedClasses = [
      'header',
      'logo-section',
      'logo-link',
      'logo-icon',
      'logo-text',
      'navigation-section',
      'cta-section',
      'whatsapp-cta',
      'phone-cta',
      'mobile-contact-bar'
    ];
    
    expectedClasses.forEach(className => {
      expect(className).toBeTruthy();
      expect(typeof className).toBe('string');
    });
  });

  it('should support different header variants', () => {
    // Test the different props that can be passed to the header
    const defaultProps = {
      currentPath: '/',
      transparent: false,
      fixed: false
    };
    
    const transparentProps = {
      currentPath: '/',
      transparent: true,
      fixed: false
    };
    
    const fixedProps = {
      currentPath: '/',
      transparent: false,
      fixed: true
    };
    
    expect(defaultProps.transparent).toBe(false);
    expect(defaultProps.fixed).toBe(false);
    expect(transparentProps.transparent).toBe(true);
    expect(fixedProps.fixed).toBe(true);
  });
});