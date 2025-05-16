// Common utility functions
const utils = {
    loadDynamicContent(templateId, data) {
        const template = document.getElementById(templateId).innerHTML;
        return template.replace(/\{\{(\w+)\}\}/g, (_, key) => data[key]);
    },
    
    initAOS() {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            mirror: false
        });
    },

    setupHeaderFooter() {
        Promise.all([
            fetch('../header.html').then(r => r.text()),
            fetch('../footer.html').then(r => r.text())
        ]).then(([header, footer]) => {
            document.getElementById('header-placeholder').innerHTML = header;
            document.getElementById('footer-placeholder').innerHTML = footer;
        });
    }
};

// Initialize common functionality
document.addEventListener('DOMContentLoaded', () => {
    utils.setupHeaderFooter();
    utils.initAOS();

    // Contact Form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', async e => {
        e.preventDefault();
        const data = {
          name:    contactForm.name.value,
          email:   contactForm.email.value,
          subject: contactForm.subject.value,
          message: contactForm.message.value
        };
        try {
          const res = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
          const result = await res.json();
          alert(result.message);
          contactForm.reset();
        } catch (err) {
          console.error(err);
          alert('Gagal kirim pesan.');
        }
      });
    }

    // Apply Form
    const applyForm = document.getElementById('applyForm');
    if (applyForm) {
      applyForm.addEventListener('submit', async e => {
        e.preventDefault();
        const data = {
          fullName: applyForm.fullName.value,
          nik:      applyForm.nik.value,
          email:    applyForm.email.value,
          phone:    applyForm.phone.value,
          service:  applyForm.service.value,
          amount:   applyForm.amount.value,
          tenure:   applyForm.tenure.value,
          purpose:  applyForm.purpose.value
        };
        try {
          const res = await fetch('/api/apply', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
          const result = await res.json();
          alert(result.message);
          applyForm.reset();
        } catch (err) {
          console.error(err);
          alert('Gagal ajukan aplikasi.');
        }
      });
    }
});
