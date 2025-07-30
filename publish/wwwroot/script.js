// Modern Wedding Memory App - JavaScript Functionality
class WeddingMemoryApp {
    constructor() {
        this.apiBase = 'http://localhost:5151/api';
        this.memories = [];
        this.storyMemories = [];
        this.currentPage = 1;
        this.pageSize = 10;
        this.isLoading = false;
        this.currentSlideshow = null;
        this.currentSlideIndex = 0;
        
        this.init();
    }

    async init() {
        this.setupEventListeners();
        this.setupTheme();
        await this.loadInitialData();
        this.hideLoadingScreen();
        this.showWelcomeModal();
    }

    // Event Listeners Setup
    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        themeToggle?.addEventListener('click', () => this.toggleTheme());

        // Add memory modal
        const addMemoryBtn = document.getElementById('addMemoryBtn');
        const addMemoryModal = document.getElementById('addMemoryModal');
        const closeModalBtn = document.getElementById('closeModalBtn');
        const cancelBtn = document.getElementById('cancelBtn');

        addMemoryBtn?.addEventListener('click', () => this.openAddMemoryModal());
        closeModalBtn?.addEventListener('click', () => this.closeModal('addMemoryModal'));
        cancelBtn?.addEventListener('click', () => this.closeModal('addMemoryModal'));

        // Memory form
        const memoryForm = document.getElementById('memoryForm');
        memoryForm?.addEventListener('submit', (e) => this.handleMemorySubmit(e));

        // File upload
        const fileInput = document.getElementById('memoryImages');
        const fileUploadArea = document.getElementById('fileUploadArea');
        
        fileInput?.addEventListener('change', (e) => this.handleFileSelect(e));
        fileUploadArea?.addEventListener('dragover', (e) => this.handleDragOver(e));
        fileUploadArea?.addEventListener('drop', (e) => this.handleDrop(e));
        fileUploadArea?.addEventListener('dragleave', (e) => this.handleDragLeave(e));

        // Character counter
        const messageTextarea = document.getElementById('memoryMessage');
        messageTextarea?.addEventListener('input', () => this.updateCharCounter());

        // Success modal
        const continueBtn = document.getElementById('continueBtn');
        const thankYouBtn = document.getElementById('thankYouBtn');
        
        continueBtn?.addEventListener('click', () => this.closeModal('successModal'));
        thankYouBtn?.addEventListener('click', () => this.handleThankYou());

        // Memory detail modal
        const closeDetailBtn = document.getElementById('closeDetailBtn');
        closeDetailBtn?.addEventListener('click', () => this.closeModal('memoryDetailModal'));

        // Slideshow modal
        const closeSlideshowBtn = document.getElementById('closeSlideshowBtn');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        closeSlideshowBtn?.addEventListener('click', () => this.closeModal('slideshowModal'));
        prevBtn?.addEventListener('click', () => this.previousSlide());
        nextBtn?.addEventListener('click', () => this.nextSlide());

        // Load more
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        loadMoreBtn?.addEventListener('click', () => this.loadMoreMemories());

        // Add more images button
        const addMoreBtn = document.getElementById('addMoreBtn');
        addMoreBtn?.addEventListener('click', () => this.addMoreImages());

        // Download events
        const downloadCurrentBtn = document.getElementById('downloadCurrentBtn');
        downloadCurrentBtn?.addEventListener('click', () => this.downloadCurrentSlideshow());

        // Click outside modal to close
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target.id);
            }
        });

        // Welcome modal buttons
        const startSharingBtn = document.getElementById('startSharingBtn');
        const continueWithoutWelcomeBtn = document.getElementById('continueWithoutWelcomeBtn');
        
        startSharingBtn?.addEventListener('click', () => {
            this.closeWelcomeModal();
            this.openAddMemoryModal();
        });
        
        continueWithoutWelcomeBtn?.addEventListener('click', () => {
            this.closeWelcomeModal();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }

    // Theme Management
    setupTheme() {
        const savedTheme = localStorage.getItem('wedding-app-theme') || 'dark';
        document.body.className = savedTheme;
        this.updateThemeIcon();
    }

    toggleTheme() {
        const currentTheme = document.body.classList.contains('dark') ? 'dark' : 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.body.className = newTheme;
        localStorage.setItem('wedding-app-theme', newTheme);
        this.updateThemeIcon();
    }

    updateThemeIcon() {
        const themeToggle = document.getElementById('themeToggle');
        const icon = themeToggle?.querySelector('i');
        if (icon) {
            const isDark = document.body.classList.contains('dark');
            icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    // Loading Management
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 300);
            }, 1000);
        }
    }

    showLoading(element) {
        if (element) {
            element.style.opacity = '0.6';
            element.style.pointerEvents = 'none';
        }
    }

    hideLoading(element) {
        if (element) {
            element.style.opacity = '1';
            element.style.pointerEvents = 'auto';
        }
    }

    // API Calls
    async loadInitialData() {
        try {
            await Promise.all([
                this.loadMemories(),
                this.loadStoryMemories()
            ]);
        } catch (error) {
            console.error('Error loading initial data:', error);
            this.showError('Veriler yüklenirken hata oluştu');
        }
    }

    async loadMemories(append = false) {
        if (this.isLoading) return;
        
        this.isLoading = true;
        
        try {
            const response = await fetch(`${this.apiBase}/Memories`);
            if (!response.ok) throw new Error('Network response was not ok');
            
            const memories = await response.json();
            
            if (append) {
                this.memories = [...this.memories, ...memories];
            } else {
                this.memories = memories;
            }
            
            this.renderMemories();
        } catch (error) {
            console.error('Error loading memories:', error);
            this.showError('Anılar yüklenirken hata oluştu');
        } finally {
            this.isLoading = false;
        }
    }

    async loadStoryMemories() {
        try {
            const response = await fetch(`${this.apiBase}/Memories/story`);
            if (!response.ok) throw new Error('Network response was not ok');
            
            this.storyMemories = await response.json();
            this.renderStory();
        } catch (error) {
            console.error('Error loading story memories:', error);
        }
    }

    async loadMoreMemories() {
        this.currentPage++;
        await this.loadMemories(true);
    }

    // Rendering
    renderMemories() {
        const grid = document.getElementById('memoriesGrid');
        if (!grid) return;

        grid.innerHTML = '';
        
        this.memories.forEach((memory, index) => {
            const card = this.createMemoryCard(memory);
            card.classList.add('fade-in');
            card.style.animationDelay = `${index * 0.1}s`;
            grid.appendChild(card);
        });

        this.updateLoadMoreButton();
    }

    renderStory() {
        const carousel = document.getElementById('storyCarousel');
        if (!carousel || !this.storyMemories.length) return;

        // Double the items for seamless loop
        const storyItems = [...this.storyMemories, ...this.storyMemories];
        
        carousel.innerHTML = '';
        
        storyItems.forEach(memory => {
            const item = this.createStoryItem(memory);
            carousel.appendChild(item);
        });
    }

    createMemoryCard(memory) {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.memoryId = memory.id;
        card.dataset.currentImageIndex = '0';

        const images = memory.images || [];
        const currentImage = images[0];
        const imageUrl = currentImage ? `${this.apiBase}/Memories/${memory.id}/image/${currentImage.id}` : '';
        
        card.innerHTML = `
            <div class="memory-images">
                <div class="memory-image-container">
                    ${imageUrl ? `<img src="${imageUrl}" alt="${currentImage.fileName}" class="memory-image">` : ''}
                    ${images.length > 1 ? `
                        <button class="memory-nav-btn prev" onclick="app.previousMemoryImage(event, '${memory.id}')">
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        <button class="memory-nav-btn next" onclick="app.nextMemoryImage(event, '${memory.id}')">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                        <div class="memory-image-counter">
                            <span class="current-image">1</span>/${images.length}
                        </div>
                    ` : ''}
                    <button class="download-btn" onclick="event.stopPropagation(); app.downloadImage(${memory.id}, 0)">
                        <i class="fas fa-download"></i>
                    </button>
                </div>
            </div>
            <div class="memory-content">
                <p class="memory-message">${this.escapeHtml(memory.message)}</p>
                <div class="memory-meta">
                    <div class="memory-date">
                        <i class="fas fa-calendar-alt"></i>
                        ${this.formatDate(memory.createdAt)}
                    </div>
                    <button class="expand-btn" onclick="app.openMemoryDetail(app.memories.find(m => m.id == ${memory.id}))">
                        <i class="fas fa-expand-alt"></i>
                        Detay
                    </button>
                </div>
            </div>
        `;

        return card;
    }

    createStoryItem(memory) {
        const item = document.createElement('div');
        item.className = 'story-item';
        item.addEventListener('click', () => this.openStorySlideshow(memory));

        // Sadece ilk fotoğrafı göster
        const firstImage = memory.firstImage || memory.images?.[0];
        const imageCount = memory.images?.length || 0;
        
        let imageHtml = '';
        if (firstImage) {
            const imageUrl = `${this.apiBase}/Memories/${memory.id}/image/${firstImage.id}`;
            imageHtml = `<img src="${imageUrl}" alt="${firstImage.fileName}" class="story-single-image">`;
        }

        item.innerHTML = `
            ${imageHtml}
            <div class="story-overlay">
                <div class="story-text">${this.truncateText(memory.message, 20)}</div>
                ${imageCount > 1 ? `<div class="image-count-badge">${imageCount}</div>` : ''}
            </div>
        `;

        return item;
    }

    updateLoadMoreButton() {
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.style.display = this.memories.length >= this.pageSize ? 'inline-flex' : 'none';
        }
    }

    // Modal Management
    openAddMemoryModal() {
        const modal = document.getElementById('addMemoryModal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Focus on message textarea
            const messageTextarea = document.getElementById('memoryMessage');
            setTimeout(() => messageTextarea?.focus(), 300);
        }
    }

    openMemoryDetail(memory) {
        const modal = document.getElementById('memoryDetailModal');
        const content = document.getElementById('memoryDetailContent');
        
        if (!modal || !content) return;

        content.innerHTML = this.createMemoryDetailContent(memory);
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            
            // Reset form if it's the add memory modal
            if (modalId === 'addMemoryModal') {
                this.resetMemoryForm();
            }
        }
    }

    closeAllModals() {
        const modals = document.querySelectorAll('.modal.active:not(.welcome-modal)');
        modals.forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = '';
        this.resetMemoryForm();
    }

    showWelcomeModal() {
        // Check if user has seen welcome before
        const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
        if (!hasSeenWelcome) {
            const modal = document.getElementById('welcomeModal');
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        }
    }

    closeWelcomeModal() {
        const modal = document.getElementById('welcomeModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            localStorage.setItem('hasSeenWelcome', 'true');
        }
    }

    // Slideshow functionality
    openStorySlideshow(memory) {
        this.currentSlideshow = memory;
        this.currentSlideIndex = 0;
        
        const modal = document.getElementById('slideshowModal');
        const title = document.getElementById('slideshowTitle');
        const message = document.getElementById('slideshowMessage');
        const date = document.getElementById('slideshowDate');
        
        if (title) title.textContent = 'Anı Fotoğrafları';
        if (message) message.textContent = memory.message;
        if (date) date.textContent = this.formatDate(memory.createdAt);
        
        this.renderSlideshow();
        
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    renderSlideshow() {
        if (!this.currentSlideshow || !this.currentSlideshow.images) return;

        const wrapper = document.getElementById('slideshowWrapper');
        const message = document.getElementById('slideshowMessage');
        const counter = document.getElementById('slideshowCounter');
        const date = document.getElementById('slideshowDate');
        const indicators = document.getElementById('slideshowIndicators');

        const currentImage = this.currentSlideshow.images[this.currentSlideIndex];
        if (!currentImage) return;

        // Update image - handle both preview files and saved images
        let imageUrl;
        if (currentImage.file) {
            // This is a preview file
            imageUrl = URL.createObjectURL(currentImage.file);
        } else {
            // This is a saved image
            imageUrl = `${this.apiBase}/Memories/${this.currentSlideshow.id}/image/${currentImage.id}`;
        }
        
        wrapper.innerHTML = `<img src="${imageUrl}" alt="${currentImage.fileName}" class="slideshow-image">`;

        // Update info
        if (message) message.textContent = this.currentSlideshow.message;
        if (counter) counter.textContent = `${this.currentSlideIndex + 1} / ${this.currentSlideshow.images.length}`;
        if (date) date.textContent = this.formatDate(this.currentSlideshow.createdAt);

        // Update indicators
        if (indicators) {
            indicators.innerHTML = this.currentSlideshow.images.map((_, index) => 
                `<button class="indicator ${index === this.currentSlideIndex ? 'active' : ''}" 
                         onclick="app.goToSlide(${index})"></button>`
            ).join('');
        }
        
        // Hide/show controls based on image count
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const controls = document.querySelector('.slideshow-controls');
        
        // Hide controls if only one image
        if (this.currentSlideshow.images.length <= 1) {
            if (controls) controls.style.display = 'none';
            if (indicators) indicators.style.display = 'none';
        } else {
            if (controls) controls.style.display = 'flex';
            if (indicators) indicators.style.display = 'flex';
            if (prevBtn) {
                prevBtn.disabled = this.currentSlideIndex === 0;
            }
            if (nextBtn) {
                nextBtn.disabled = this.currentSlideIndex === this.currentSlideshow.images.length - 1;
            }
        }
    }

    previousSlide() {
        if (!this.currentSlideshow) return;
        
        const images = this.currentSlideshow.images || [];
        this.currentSlideIndex = this.currentSlideIndex > 0 ? 
            this.currentSlideIndex - 1 : 
            images.length - 1;
        
        this.renderSlideshow();
    }

    nextSlide() {
        if (!this.currentSlideshow) return;
        
        const images = this.currentSlideshow.images || [];
        this.currentSlideIndex = this.currentSlideIndex < images.length - 1 ? 
            this.currentSlideIndex + 1 : 
            0;
        
        this.renderSlideshow();
    }

    goToSlide(index) {
        this.currentSlideIndex = index;
        this.renderSlideshow();
    }

    // Memory card navigation
    previousMemoryImage(event, memoryId) {
        event.stopPropagation();
        this.navigateMemoryImage(memoryId, -1);
    }

    nextMemoryImage(event, memoryId) {
        event.stopPropagation();
        this.navigateMemoryImage(memoryId, 1);
    }

    navigateMemoryImage(memoryId, direction) {
        const card = document.querySelector(`[data-memory-id="${memoryId}"]`);
        if (!card) return;

        const memory = this.memories.find(m => m.id == memoryId);
        if (!memory || !memory.images) return;

        const currentIndex = parseInt(card.dataset.currentImageIndex) || 0;
        const newIndex = (currentIndex + direction + memory.images.length) % memory.images.length;
        
        card.dataset.currentImageIndex = newIndex;
        
        const newImage = memory.images[newIndex];
        const imageUrl = `${this.apiBase}/Memories/${memoryId}/image/${newImage.id}`;
        
        const imgElement = card.querySelector('.memory-image');
        const counterElement = card.querySelector('.current-image');
        const downloadBtn = card.querySelector('.download-btn');
        
        if (imgElement) {
            imgElement.src = imageUrl;
            imgElement.alt = newImage.fileName;
        }
        
        if (counterElement) {
            counterElement.textContent = newIndex + 1;
        }
        
        // Update download button for current image
        if (downloadBtn) {
            downloadBtn.onclick = (e) => {
                e.stopPropagation();
                this.downloadImage(memoryId, newIndex);
            };
        }
    }

    createMemoryDetailContent(memory) {
        const imagesHtml = memory.images?.map(image => {
            const imageUrl = `${this.apiBase}/Memories/${memory.id}/image/${image.id}`;
            return `
                <div class="detail-image">
                    <img src="${imageUrl}" alt="${image.fileName}" onclick="window.open('${imageUrl}', '_blank')">
                </div>
            `;
        }).join('') || '';

        return `
            <div class="detail-images">
                ${imagesHtml}
            </div>
            <div class="detail-message">
                ${this.escapeHtml(memory.message)}
            </div>
            <div class="detail-meta">
                <div class="detail-date">
                    <i class="fas fa-calendar-alt"></i>
                    ${this.formatDate(memory.createdAt)}
                </div>
                <div class="detail-image-count">
                    <i class="fas fa-images"></i>
                    ${memory.images?.length || 0} fotoğraf
                </div>
            </div>
        `;
    }

    // Form Handling
    async handleMemorySubmit(e) {
        e.preventDefault();
        
        const submitBtn = document.getElementById('submitBtn');
        const form = e.target;
        const formData = new FormData(form);
        
        // Get form data properly
        const messageInput = document.getElementById('memoryMessage');
        const fileInput = document.getElementById('memoryImages');
        
        const message = messageInput?.value?.trim();
        const files = fileInput?.files;
        
        // Validation
        if (!message) {
            this.showError('Mesaj zorunludur');
            return;
        }
        
        if (!files || files.length === 0) {
            this.showError('En az 1 fotoğraf seçmelisiniz');
            return;
        }
        
        if (files.length > 4) {
            this.showError('En fazla 4 fotoğraf yükleyebilirsiniz');
            return;
        }

        // Create proper FormData
        const properFormData = new FormData();
        properFormData.append('message', message);
        
        // Add all images
        console.log(`Adding ${files.length} files to form data`);
        for (let i = 0; i < files.length; i++) {
            console.log(`Adding file ${i + 1}: ${files[i].name}, Size: ${files[i].size} bytes`);
            properFormData.append('images', files[i]);
        }

        // Submit
        this.showLoading(submitBtn);
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Yükleniyor...';

        try {
            const response = await fetch(`${this.apiBase}/Memories`, {
                method: 'POST',
                body: properFormData
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Hata oluştu');
            }

            // Success
            this.closeModal('addMemoryModal');
            this.showSuccessModal();
            await this.loadMemories();
            await this.loadStoryMemories();

        } catch (error) {
            console.error('Error submitting memory:', error);
            this.showError(error.message || 'Anı eklenirken hata oluştu');
        } finally {
            this.hideLoading(submitBtn);
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-heart"></i> Anıyı Paylaş';
        }
    }

    resetMemoryForm() {
        const form = document.getElementById('memoryForm');
        const imagePreview = document.getElementById('imagePreview');
        const charCount = document.getElementById('charCount');
        const addMoreContainer = document.getElementById('addMoreContainer');
        
        if (form) form.reset();
        if (imagePreview) imagePreview.innerHTML = '';
        if (charCount) charCount.textContent = '0';
        if (addMoreContainer) addMoreContainer.style.display = 'none';
    }

    // File Handling
    handleFileSelect(e) {
        const files = Array.from(e.target.files);
        // Limit to 4 files maximum
        const limitedFiles = files.slice(0, 4);
        
        // Update the file input to only contain the limited files
        if (limitedFiles.length < files.length) {
            const dt = new DataTransfer();
            limitedFiles.forEach(file => dt.items.add(file));
            e.target.files = dt.files;
            this.showError('Maksimum 4 fotoğraf yükleyebilirsiniz');
        }
        
        this.displayImagePreviews(limitedFiles);
    }

    handleDragOver(e) {
        e.preventDefault();
        e.target.closest('.file-upload-area').classList.add('dragover');
    }

    handleDragLeave(e) {
        e.preventDefault();
        e.target.closest('.file-upload-area').classList.remove('dragover');
    }

    handleDrop(e) {
        e.preventDefault();
        const uploadArea = e.target.closest('.file-upload-area');
        uploadArea.classList.remove('dragover');
        
        const files = Array.from(e.dataTransfer.files);
        const fileInput = document.getElementById('memoryImages');
        
        // Filter image files and limit to 4
        const imageFiles = files.filter(f => f.type.startsWith('image/')).slice(0, 4);
        
        if (files.length > imageFiles.length || imageFiles.length > 4) {
            this.showError('Maksimum 4 adet resim dosyası yükleyebilirsiniz');
        }
        
        // Update file input
        const dt = new DataTransfer();
        imageFiles.forEach(file => dt.items.add(file));
        fileInput.files = dt.files;
        
        this.displayImagePreviews(imageFiles);
    }

    displayImagePreviews(files) {
        const preview = document.getElementById('imagePreview');
        if (!preview) return;

        preview.innerHTML = '';

        // Ensure maximum 4 files
        const maxFiles = Math.min(files.length, 4);
        console.log(`Displaying ${maxFiles} image previews`);
        
        for (let i = 0; i < maxFiles; i++) {
            const file = files[i];
            if (!file.type.startsWith('image/')) continue;

            const reader = new FileReader();
            reader.onload = (e) => {
                const item = document.createElement('div');
                item.className = 'preview-item';
                item.innerHTML = `
                    <img src="${e.target.result}" alt="Preview">
                    <button type="button" class="remove-preview" onclick="app.removePreviewImage(${i})">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                preview.appendChild(item);
            };
            reader.readAsDataURL(file);
        }
        
        // Update file count display
        const uploadPlaceholder = document.querySelector('.upload-placeholder small');
        if (uploadPlaceholder) {
            uploadPlaceholder.textContent = `JPEG, PNG, GIF, WebP (Max: 50MB/dosya, ${maxFiles}/4 seçili)`;
        }

        // Show/hide add more button
        const addMoreContainer = document.getElementById('addMoreContainer');
        if (addMoreContainer) {
            if (maxFiles < 4 && maxFiles > 0) {
                addMoreContainer.style.display = 'block';
            } else {
                addMoreContainer.style.display = 'none';
            }
        }
    }

    addMoreImages() {
        const fileInput = document.getElementById('memoryImages');
        if (!fileInput) return;

        const currentFiles = Array.from(fileInput.files || []);
        if (currentFiles.length >= 4) {
            this.showError('Maksimum 4 fotoğraf yükleyebilirsiniz');
            return;
        }

        // Create a temporary file input
        const tempInput = document.createElement('input');
        tempInput.type = 'file';
        tempInput.accept = 'image/jpeg,image/jpg,image/png,image/gif,image/webp';
        tempInput.multiple = true;
        
        tempInput.onchange = (e) => {
            const newFiles = Array.from(e.target.files || []);
            const remainingSlots = 4 - currentFiles.length;
            const filesToAdd = newFiles.slice(0, remainingSlots);
            
            if (newFiles.length > remainingSlots) {
                this.showError(`Sadece ${remainingSlots} fotoğraf daha ekleyebilirsiniz`);
            }

            // Combine existing files with new files
            const dt = new DataTransfer();
            [...currentFiles, ...filesToAdd].forEach(file => {
                dt.items.add(file);
            });
            
            fileInput.files = dt.files;
            this.displayImagePreviews(Array.from(fileInput.files));
        };
        
        tempInput.click();
    }

    // Simple Download Function
    async downloadImage(memoryId, imageIndex) {
        console.log('Download image called:', memoryId, imageIndex);
        
        try {
            const memory = this.memories.find(m => m.id == memoryId);
            if (!memory || !memory.images || !memory.images[imageIndex]) {
                console.error('Memory or image not found');
                alert('Fotoğraf bulunamadı!');
                return;
            }
            
            const image = memory.images[imageIndex];
            const imageUrl = `${this.apiBase}/Memories/${memoryId}/image/${image.id}`;
            
            console.log('Downloading from URL:', imageUrl);
            
            // Create a simple link and click it
            const link = document.createElement('a');
            link.href = imageUrl;
            link.download = image.fileName || 'fotograf.jpg';
            link.target = '_blank';
            
            // Add to DOM temporarily
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            console.log('Download initiated');
            
        } catch (error) {
            console.error('Download error:', error);
            alert('İndirme hatası oluştu!');
        }
    }



    downloadCurrentSlideshow() {
        console.log('Download current slideshow called');
        
        if (!this.currentSlideshow || !this.currentSlideshow.images) {
            console.error('No slideshow or images');
            return;
        }
        
        const currentImage = this.currentSlideshow.images[this.currentSlideIndex];
        if (!currentImage) {
            console.error('No current image');
            return;
        }
        
        console.log('Current image:', currentImage);
        
        // If it's a preview image, download directly
        if (currentImage.file) {
            console.log('Downloading preview file');
            const link = document.createElement('a');
            link.download = currentImage.fileName;
            link.href = URL.createObjectURL(currentImage.file);
            link.click();
        } else {
            // This is a saved image, download directly
            console.log('Downloading saved image');
            this.downloadImage(this.currentSlideshow.id, this.currentSlideIndex);
        }
    }

    openImagePreview(files, startIndex = 0) {
        this.currentSlideshow = {
            id: 'preview',
            message: 'Seçilen Fotoğraflar',
            createdAt: new Date().toISOString(),
            images: Array.from(files).map((file, index) => ({
                id: index,
                fileName: file.name,
                contentType: file.type,
                file: file // Store the actual file for preview
            }))
        };
        this.currentSlideIndex = startIndex;
        
        const modal = document.getElementById('slideshowModal');
        const title = document.getElementById('slideshowTitle');
        
        if (title) title.textContent = 'Seçilen Fotoğraflar';
        if (modal) modal.classList.add('active');
        
        this.renderSlideshow();
    }

    removePreviewImage(index) {
        const fileInput = document.getElementById('memoryImages');
        const dt = new DataTransfer();
        
        Array.from(fileInput.files).forEach((file, i) => {
            if (i !== index) {
                dt.items.add(file);
            }
        });
        
        fileInput.files = dt.files;
        this.displayImagePreviews(Array.from(fileInput.files));
    }

    updateCharCounter() {
        const textarea = document.getElementById('memoryMessage');
        const counter = document.getElementById('charCount');
        
        if (textarea && counter) {
            counter.textContent = textarea.value.length;
            
            if (textarea.value.length > 450) {
                counter.style.color = 'var(--primary-color)';
            } else {
                counter.style.color = 'var(--text-muted)';
            }
        }
    }

    // Success Modal
    showSuccessModal() {
        const modal = document.getElementById('successModal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    handleThankYou() {
        this.closeModal('successModal');
        // Add a nice touch - maybe confetti or animation
        this.showConfetti();
    }

    showConfetti() {
        // Simple confetti effect
        const colors = ['#2563eb', '#0891b2', '#3b82f6', '#06b6d4'];
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                top: -10px;
                left: ${Math.random() * 100}vw;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                pointer-events: none;
                z-index: 10000;
                animation: fall ${2 + Math.random() * 3}s ease-out forwards;
            `;
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, 5000);
        }
    }

    // Utility Functions
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleTimeString('tr-TR', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
        });
    }

    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showError(message) {
        // Create a temporary toast notification
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
        `;
        toast.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            ${message}
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease-in forwards';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    showSuccess(message) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
        `;
        toast.innerHTML = `
            <i class="fas fa-check-circle"></i>
            ${message}
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease-in forwards';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// Animation styles for toasts and confetti
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    @keyframes fall {
        0% { 
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
        }
        100% { 
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize the app
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new WeddingMemoryApp();
});

// Service Worker registration for PWA features
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}