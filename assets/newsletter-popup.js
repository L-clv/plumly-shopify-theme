/**
 * Plumly: Newsletter discount popup.
 *
 * Trigger modes:
 *  - "delay": open after `delay_seconds` seconds
 *  - "scroll": open after user scrolls past `scroll_percent`% of the page
 *  - "exit": open on first mouseleave from the top of the viewport (desktop only)
 *
 * Persistence: once the user submits or dismisses, set localStorage so we do
 * not re-show for `cooldown_days`.
 */

(() => {
  const STORAGE_KEY = 'plumly_newsletter_popup_dismissed_at';

  class NewsletterPopup extends HTMLElement {
    connectedCallback() {
      this.dialog = this.querySelector('dialog');
      if (!this.dialog) return;

      this.trigger = this.dataset.trigger || 'delay';
      this.delaySeconds = parseInt(this.dataset.delaySeconds || '5', 10);
      this.scrollPercent = parseInt(this.dataset.scrollPercent || '40', 10);
      this.cooldownDays = parseInt(this.dataset.cooldownDays || '14', 10);

      if (this.#isOnCooldown()) return;

      this.#bindClose();
      this.#armTrigger();
    }

    #isOnCooldown() {
      try {
        const ts = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
        if (!ts) return false;
        const elapsedMs = Date.now() - ts;
        return elapsedMs < this.cooldownDays * 24 * 60 * 60 * 1000;
      } catch {
        return false;
      }
    }

    #markDismissed() {
      try {
        localStorage.setItem(STORAGE_KEY, String(Date.now()));
      } catch {
        /* ignore */
      }
    }

    #bindClose() {
      this.querySelectorAll('[data-popup-close]').forEach((el) => {
        el.addEventListener('click', () => this.#close());
      });
      this.dialog.addEventListener('close', () => this.#markDismissed());

      const form = this.querySelector('form');
      if (form) {
        form.addEventListener('submit', () => this.#markDismissed());
      }
    }

    #armTrigger() {
      switch (this.trigger) {
        case 'scroll':
          this.#armScroll();
          break;
        case 'exit':
          this.#armExitIntent();
          break;
        default:
          this.#armDelay();
      }
    }

    #armDelay() {
      window.setTimeout(() => this.#open(), this.delaySeconds * 1000);
    }

    #armScroll() {
      const handler = () => {
        const scrolled =
          (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        if (scrolled >= this.scrollPercent) {
          this.#open();
          window.removeEventListener('scroll', handler);
        }
      };
      window.addEventListener('scroll', handler, { passive: true });
    }

    #armExitIntent() {
      // Desktop only — exit intent doesn't make sense on mobile
      if (window.matchMedia('(max-width: 749px)').matches) {
        this.#armDelay();
        return;
      }
      const handler = (e) => {
        if (e.clientY <= 0) {
          this.#open();
          document.removeEventListener('mouseleave', handler);
        }
      };
      document.addEventListener('mouseleave', handler);
    }

    #open() {
      if (this.dialog.open) return;
      this.dialog.showModal();
    }

    #close() {
      if (!this.dialog.open) return;
      this.dialog.close();
    }
  }

  if (!customElements.get('newsletter-popup')) {
    customElements.define('newsletter-popup', NewsletterPopup);
  }
})();
