class ComponentLoader {
    static async loadComponents(isSubDirectory = false) {
        try {
            const basePath = isSubDirectory ? '../' : '';
            const [header, footer] = await Promise.all([
                fetch(`${basePath}templates/header.html`).then(r => r.ok ? r.text() : Promise.reject('Failed to load header')),
                fetch(`${basePath}templates/footer.html`).then(r => r.ok ? r.text() : Promise.reject('Failed to load footer'))
            ]);

            document.getElementById('header-placeholder').innerHTML = header;
            document.getElementById('footer-placeholder').innerHTML = footer;

            this.fixAssetPaths(isSubDirectory);
            this.initializeNavigation();
            
            return true;
        } catch (error) {
            console.error('Failed to load components:', error);
            this.showError('Failed to load page components. Please refresh.');
            return false;
        }
    }

    static fixAssetPaths(isSubDirectory) {
        if (isSubDirectory) {
            document.querySelectorAll('[src^="/"], [href^="/"]').forEach(el => {
                const attr = el.hasAttribute('src') ? 'src' : 'href';
                el[attr] = '../' + el[attr].substring(1);
            });
        }
    }

    static initializeNavigation() {
        const currentPath = window.location.pathname;
        document.querySelectorAll('.nav-link, .dropdown-item').forEach(link => {
            if (link.getAttribute('href') && currentPath.includes(link.getAttribute('href'))) {
                link.classList.add('active');
                const parentDropdown = link.closest('.dropdown');
                if (parentDropdown) {
                    parentDropdown.querySelector('.dropdown-toggle').classList.add('active');
                }
            }
        });
    }

    static showError(message) {
        const alert = document.createElement('div');
        alert.className = 'alert alert-danger alert-dismissible fade show fixed-top m-3';
        alert.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.body.appendChild(alert);
    }
}

// Export for module usage
export default ComponentLoader;
