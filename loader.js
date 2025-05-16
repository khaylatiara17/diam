class ComponentLoader {
    static async loadComponents(isMainPage = false) {
        const cache = new Map();
        const basePath = isMainPage ? '' : '../';
        
        try {
            const components = await Promise.all([
                this.loadWithCache(`${basePath}templates/head.html`, cache),
                this.loadWithCache(`${basePath}header.html`, cache), 
                this.loadWithCache(`${basePath}footer.html`, cache)
            ]);

            this.insertComponents(components);
            this.initializeComponents();
            
        } catch (error) {
            console.error('Component loading failed:', error);
            this.handleError(error);
        }
    }

    static async loadWithCache(url, cache) {
        if (cache.has(url)) {
            return cache.get(url);
        }
        
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to load ${url}`);
        
        const content = await response.text();
        cache.set(url, content);
        return content;
    }

    static insertComponents([head, header, footer]) {
        document.getElementById('shared-head').innerHTML = head;
        document.getElementById('header-placeholder').innerHTML = header;
        document.getElementById('footer-placeholder').innerHTML = footer;
    }

    static initializeComponents() {
        // Initialize any component-specific functionality
        document.dispatchEvent(new CustomEvent('components-loaded'));
    }

    static handleError(error) {
        const alertContainer = document.createElement('div');
        alertContainer.className = 'alert alert-danger';
        alertContainer.textContent = 'Failed to load page components. Please refresh.';
        document.body.prepend(alertContainer);
    }
}

// Export for module usage
export default ComponentLoader;
