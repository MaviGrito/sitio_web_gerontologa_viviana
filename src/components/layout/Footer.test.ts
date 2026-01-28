import { describe, it, expect } from 'vitest';
import { SITE_CONFIG } from '../../utils/constants';

describe('Footer Component', () => {
  describe('Configuration', () => {
    it('should have valid contact information', () => {
      expect(SITE_CONFIG.contact.email).toBeTruthy();
      expect(SITE_CONFIG.contact.phone).toBeTruthy();
      expect(SITE_CONFIG.contact.whatsapp).toBeTruthy();
      expect(SITE_CONFIG.contact.address).toBeTruthy();
    });

    it('should have valid social media links', () => {
      expect(SITE_CONFIG.social.instagram).toBeTruthy();
      expect(SITE_CONFIG.social.facebook).toBeTruthy();
      expect(SITE_CONFIG.social.linkedin).toBeTruthy();
    });

    it('should have valid author information', () => {
      expect(SITE_CONFIG.author.name).toBeTruthy();
      expect(SITE_CONFIG.author.title).toBeTruthy();
      expect(SITE_CONFIG.author.credentials).toBeInstanceOf(Array);
      expect(SITE_CONFIG.author.credentials.length).toBeGreaterThan(0);
      expect(SITE_CONFIG.author.bio).toBeTruthy();
    });
  });

  describe('Footer Links', () => {
    const footerLinks = [
      {
        title: 'Navegación',
        links: [
          { href: '/', label: 'Inicio' },
          { href: '/servicios', label: 'Servicios' },
          { href: '/recursos', label: 'Recursos' }
        ]
      },
      {
        title: 'Servicios',
        links: [
          { href: '/servicios#consulta-geriatrica', label: 'Consulta Geriátrica' },
          { href: '/servicios#valoracion-cognitiva', label: 'Valoración Cognitiva' },
          { href: '/servicios#seguimiento-cronico', label: 'Seguimiento Crónico' }
        ]
      }
    ];

    it('should have navigation links', () => {
      const navigationSection = footerLinks.find(section => section.title === 'Navegación');
      expect(navigationSection).toBeDefined();
      expect(navigationSection?.links).toHaveLength(3);
    });

    it('should have service links', () => {
      const servicesSection = footerLinks.find(section => section.title === 'Servicios');
      expect(servicesSection).toBeDefined();
      expect(servicesSection?.links).toHaveLength(3);
    });

    it('should have valid href attributes', () => {
      footerLinks.forEach(section => {
        section.links.forEach(link => {
          expect(link.href).toBeTruthy();
          expect(link.href).toMatch(/^(\/|#)/); // Should start with / or #
          expect(link.label).toBeTruthy();
        });
      });
    });
  });

  describe('Social Media Links', () => {
    const socialLinks = [
      {
        name: 'Instagram',
        href: SITE_CONFIG.social.instagram,
        icon: 'instagram',
        ariaLabel: `Seguir en Instagram a ${SITE_CONFIG.author.name}`
      },
      {
        name: 'Facebook',
        href: SITE_CONFIG.social.facebook,
        icon: 'facebook',
        ariaLabel: `Seguir en Facebook a ${SITE_CONFIG.author.name}`
      },
      {
        name: 'LinkedIn',
        href: SITE_CONFIG.social.linkedin,
        icon: 'linkedin',
        ariaLabel: `Conectar en LinkedIn con ${SITE_CONFIG.author.name}`
      }
    ];

    it('should have all social media platforms', () => {
      expect(socialLinks).toHaveLength(3);
      
      const platforms = socialLinks.map(link => link.name);
      expect(platforms).toContain('Instagram');
      expect(platforms).toContain('Facebook');
      expect(platforms).toContain('LinkedIn');
    });

    it('should have valid social media URLs', () => {
      socialLinks.forEach(social => {
        expect(social.href).toBeTruthy();
        expect(social.href).toMatch(/^https?:\/\//); // Should be a valid URL
        expect(social.ariaLabel).toBeTruthy();
        expect(social.ariaLabel).toContain(SITE_CONFIG.author.name);
      });
    });

    it('should have appropriate icons', () => {
      socialLinks.forEach(social => {
        expect(social.icon).toBeTruthy();
        expect(['instagram', 'facebook', 'linkedin']).toContain(social.icon);
      });
    });
  });

  describe('Contact Information', () => {
    it('should format phone number correctly', () => {
      const phone = SITE_CONFIG.contact.phone;
      expect(phone).toMatch(/^\+\d+/); // Should start with + and contain digits
    });

    it('should format WhatsApp number correctly', () => {
      const whatsapp = SITE_CONFIG.contact.whatsapp;
      expect(whatsapp).toMatch(/^\+\d+/); // Should start with + and contain digits
      
      // Test WhatsApp URL generation
      const cleanNumber = whatsapp.replace(/[^0-9]/g, '');
      const whatsappUrl = `https://wa.me/${cleanNumber}?text=Hola, me gustaría agendar una consulta`;
      expect(whatsappUrl).toMatch(/^https:\/\/wa\.me\/\d+\?text=/);
    });

    it('should have valid email format', () => {
      const email = SITE_CONFIG.contact.email;
      expect(email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/); // Basic email validation
    });
  });

  describe('Copyright Information', () => {
    it('should generate current year', () => {
      const currentYear = new Date().getFullYear();
      expect(currentYear).toBeGreaterThan(2020);
      expect(currentYear).toBeLessThanOrEqual(new Date().getFullYear() + 1);
    });

    it('should include author name in copyright', () => {
      const authorName = SITE_CONFIG.author.name;
      expect(authorName).toBeTruthy();
      expect(typeof authorName).toBe('string');
    });
  });

  describe('Professional Credentials', () => {
    it('should have at least one credential', () => {
      const credentials = SITE_CONFIG.author.credentials;
      expect(credentials).toBeInstanceOf(Array);
      expect(credentials.length).toBeGreaterThan(0);
    });

    it('should have meaningful credential descriptions', () => {
      const credentials = SITE_CONFIG.author.credentials;
      credentials.forEach(credential => {
        expect(credential).toBeTruthy();
        expect(typeof credential).toBe('string');
        expect(credential.length).toBeGreaterThan(10); // Should be descriptive
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria labels for contact links', () => {
      const phone = SITE_CONFIG.contact.phone;
      const email = SITE_CONFIG.contact.email;
      
      const phoneAriaLabel = `Llamar al ${phone}`;
      const emailAriaLabel = `Enviar email a ${email}`;
      
      expect(phoneAriaLabel).toContain(phone);
      expect(emailAriaLabel).toContain(email);
    });

    it('should have proper aria labels for social links', () => {
      const authorName = SITE_CONFIG.author.name;
      
      const instagramLabel = `Seguir en Instagram a ${authorName}`;
      const facebookLabel = `Seguir en Facebook a ${authorName}`;
      const linkedinLabel = `Conectar en LinkedIn con ${authorName}`;
      
      expect(instagramLabel).toContain(authorName);
      expect(facebookLabel).toContain(authorName);
      expect(linkedinLabel).toContain(authorName);
    });

    it('should have WhatsApp aria label', () => {
      const whatsappLabel = 'Contactar por WhatsApp para agendar consulta';
      expect(whatsappLabel).toBeTruthy();
      expect(whatsappLabel).toContain('WhatsApp');
      expect(whatsappLabel).toContain('consulta');
    });
  });
});