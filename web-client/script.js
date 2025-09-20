        
        document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const fileBtn = document.getElementById('fileBtn');
    const textBtn = document.getElementById('textBtn');
    const urlBtn = document.getElementById('urlBtn');
    const analyzeBtn = document.getElementById('analyzeBtn');

    const fileInputContainer = document.getElementById('fileInputContainer');
    const textInputContainer = document.getElementById('textInputContainer');
    const urlInputContainer = document.getElementById('urlInputContainer');

    const fileUploadArea = document.getElementById('fileUploadArea');
    const fileInput = document.getElementById('fileInput');
    const textInput = document.getElementById('textInput');
    const urlInput = document.getElementById('urlInput');

    const status = document.getElementById('status');
    const resultSection = document.getElementById('resultSection');

    let activeInput = 'file';
    let analysisStartTime = null;
    let factInterval = null;

    const funFacts = [
        "Over 90% of users accept T&C without reading a single word.",
        "For April Fools, Apple once included a joke about users giving away their souls.",
        "Some T&C can exceed 75,000 words, longer than Shakespeare’s Macbeth.",
        "One UK retailer added a joke clause stating users agreed to give up their first-born child.",
        "Some free apps sneak in charges through obscure clauses buried in T&C.",
        "Many companies copy-paste T&C templates, even keeping outdated clauses.",
        "Just because a clause is in the T&C doesn’t mean it’s legally enforceable.",
        "Reading all T&Cs you encounter in a year would take over 200 hours.",
        "Most T&Cs are written at a college reading level, while the average adult reads at an 8th-grade level.",
        "Some websites update their T&C silently without notifying users.",
        "Companies like Facebook and TikTok have been sued over deceptive T&C.",
        "Most T&Cs include a binding arbitration clause, waiving your right to a court trial.",
        "Even smart lawyers often skip reading T&Cs because they’re too long and vague.",
        "Clicking 'I agree' is a legally binding action in many countries.",
        "Many T&Cs give companies the right to reuse, republish, or distribute your content.",
        "It’s legal for T&Cs to limit your ability to sue or join class-action lawsuits.",
        "Some companies can keep your data even after you delete your account, thanks to tricky wording.",
        "T&Cs can require you to waive privacy rights, especially in free tools or games.",
        "A company once hid a cash prize in their T&C, and it took 5 months for someone to find it.",
        "You’ve probably agreed to be tracked online today through cookies and analytics in T&C."
    ];

    // Initialize character counter
    updateCharCount();

    // Tab switching functionality
    function switchTab(targetTab, button) {
        // Hide all containers
        document.querySelectorAll('.input-container').forEach(container => {
            container.classList.remove('active');
        });

        // Remove active class from all buttons
        document.querySelectorAll('.input-method').forEach(btn => {
            btn.classList.remove('active');
        });

        // Show target container and activate button
        document.getElementById(`${targetTab}InputContainer`).classList.add('active');
        button.classList.add('active');
        
        activeInput = targetTab;
    }

    // Event listeners for tab switching
    if (fileBtn) {
        fileBtn.addEventListener('click', () => switchTab('file', fileBtn));
        textBtn.addEventListener('click', () => switchTab('text', textBtn));
        urlBtn.addEventListener('click', () => switchTab('url', urlBtn));
    }

    // File upload drag and drop functionality
    if (fileUploadArea) {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            fileUploadArea.addEventListener(eventName, preventDefaults, false);
            document.body.addEventListener(eventName, preventDefaults, false);
        });
    }

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    // Drag over effects
    if (fileUploadArea) {
        ['dragenter', 'dragover'].forEach(eventName => {
            fileUploadArea.addEventListener(eventName, () => {
                fileUploadArea.classList.add('dragover');
            }, false);
        });
    }

    if (fileUploadArea) {
        ['dragleave', 'drop'].forEach(eventName => {
            fileUploadArea.addEventListener(eventName, () => {
                fileUploadArea.classList.remove('dragover');
            }, false);
        });
    }

    // Handle file drop
    if (fileUploadArea) {
        fileUploadArea.addEventListener('drop', (e) => {
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                const file = files[0];
                if (validateFile(file)) {
                    fileInput.files = files;
                    updateFileName(file);
                }
            }
        });
    }

    // Handle file selection
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                const file = e.target.files[0];
                if (validateFile(file)) {
                    updateFileName(file);
                } else {
                    clearFile();
                }
            }
        });
    }

    // File validation
    function validateFile(file) {
        const allowedTypes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/msword',
            'text/plain',
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/gif'
        ];
        
        const maxSize = 20 * 1024 * 1024; // 20MB

        if (!allowedTypes.includes(file.type)) {
            showStatus('error', '❌ Invalid file type. Please upload PDF, DOCX, TXT, or image files.');
            return false;
        }

        if (file.size > maxSize) {
            showStatus('error', '❌ File size exceeds 20MB limit.');
            return false;
        }

        return true;
    }

    // Update file name display
    function updateFileName(file) {
        const uploadText = fileUploadArea.querySelector('.upload-text');
        const uploadIcon = fileUploadArea.querySelector('.upload-icon');
        const uploadSubtext = fileUploadArea.querySelector('.upload-subtext');
        const uploadFormats = fileUploadArea.querySelector('.upload-formats');
        
        fileUploadArea.classList.add('file-selected');
        
        uploadIcon.textContent = getFileIcon(file.name);
        uploadText.innerHTML = `<span style="color: #059669; font-weight: 600;">📎 ${file.name}</span>`;
        uploadSubtext.innerHTML = `<span style="color: #059669;">File ready for analysis</span>`;
        uploadFormats.innerHTML = `<span id="clearFileBtn" style="color: #6366f1; cursor: pointer; text-decoration: underline;">Choose different file</span>`;
        
        // Add animation
        uploadText.style.animation = 'fadeInScale 0.4s ease-out';
        uploadIcon.style.animation = 'bounceIn 0.5s ease-out';

        // Clear any previous error messages
        hideStatus();
    }

    // Get file icon based on extension
    function getFileIcon(filename) {
        const extension = filename.split('.').pop().toLowerCase();
        const icons = {
            'pdf': '📕',
            'docx': '📘',
            'doc': '📘',
            'txt': '📄',
            'jpg': '🖼️',
            'jpeg': '🖼️',
            'png': '🖼️',
            'gif': '🖼️'
        };
        return icons[extension] || '📎';
    }

    // Event listener for clearing the file
    document.addEventListener('click', (e) => {
        if (e.target && e.target.id === 'clearFileBtn') {
            clearFile();
        }
    });

    // Clear file function
    function clearFile() {
        fileInput.value = '';
        fileUploadArea.classList.remove('file-selected');
        
        const uploadText = fileUploadArea.querySelector('.upload-text');
        const uploadIcon = fileUploadArea.querySelector('.upload-icon');
        const uploadSubtext = fileUploadArea.querySelector('.upload-subtext');
        const uploadFormats = fileUploadArea.querySelector('.upload-formats');
        
        uploadIcon.textContent = '📁';
        uploadText.textContent = 'Drop your document here';
        uploadSubtext.innerHTML = 'or <span class="upload-link">browse files</span>';
        uploadFormats.textContent = 'Supports PDF, DOCX, TXT, JPG, PNG • Max 20MB';
        
        // Add clearing animation
        fileUploadArea.style.animation = 'shake 0.5s ease-out';
        setTimeout(() => {
            fileUploadArea.style.animation = '';
        }, 500);
        
        hideStatus();
    }

    // Text input character counter
    if (textInput) {
        textInput.addEventListener('input', updateCharCount);
    }

    function updateCharCount() {
        const charCount = document.querySelector('.char-count');
        if (charCount && textInput) {
            const count = textInput.value.length;
            charCount.textContent = `${count.toLocaleString()} characters`;
            
            // Update color based on length
            if (count > 10000) {
                charCount.style.color = 'var(--warning-color)';
            } else if (count > 0) {
                charCount.style.color = 'var(--success-color)';
            } else {
                charCount.style.color = 'var(--text-muted)';
            }
        }
    }

    // URL example buttons
    if (urlInput) {
        document.querySelectorAll('.example-url').forEach(button => {
            button.addEventListener('click', (e) => {
                const url = e.target.getAttribute('data-url');
                urlInput.value = url;
                urlInput.focus();
                hideStatus();
            });
        });
    }

    // Status message functions
    function showStatus(type, message) {
        status.className = `status-message ${type}`;
        status.textContent = message;
        status.style.display = 'block';
        
        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                hideStatus();
            }, 5000);
        }
    }

    function hideStatus() {
        status.style.display = 'none';
        status.className = 'status-message';
    }

    // Get score status and color
    function getScoreStatus(score) {
        if (score >= 80) return { status: 'Highly Fair', note: 'Above industry standards', color: '#059669' };
        if (score >= 60) return { status: 'Moderately Fair', note: 'Above industry average', color: '#d97706' };
        if (score >= 40) return { status: 'Below Average', note: 'Some concerning clauses', color: '#dc2626' };
        return { status: 'Unfavorable', note: 'Many problematic terms', color: '#dc2626' };
    }

    // Update score display with animation
    function updateScoreDisplay(score) {
        const scoreNumber = document.getElementById('fairnessScore');
        const scoreStatus = document.getElementById('scoreStatus');
        const scoreNote = document.getElementById('scoreNote');
        
        const { status, note, color } = getScoreStatus(score);
        
        // Animate score counting up
        let currentScore = 0;
        const increment = score / 30;
        const timer = setInterval(() => {
            currentScore += increment;
            if (currentScore >= score) {
                currentScore = score;
                clearInterval(timer);
            }
            scoreNumber.textContent = Math.round(currentScore);
        }, 50);
        
        scoreNumber.style.color = color;
        scoreStatus.textContent = status;
        scoreNote.textContent = note;
    }

    // Format analysis summary from markdown to HTML
    function formatSummary(summary) {
        let html = summary
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/### (.*?)(?:\n|$)/g, '<h3>$1</h3>')
            .replace(/`([^`]+)`/g, '<code>$1</code>');

        const lines = html.split('\n');
        let inTable = false;
        let result = '';

        for (const line of lines) {
            if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
                if (!inTable) {
                    result += '<table>';
                    inTable = true;
                }
                const cells = line.trim().slice(1, -1).split('|');
                // Check for header separator
                if (cells.every(cell => /^-+$/.test(cell.trim()))) {
                    continue; // This is a separator line, skip it
                }
                const tag = result.includes('<thead>') ? 'td' : 'th';
                result += `<tr>${cells.map(cell => `<${tag}>${cell.trim()}</${tag}>`).join('')}</tr>`;
                if (tag === 'th') {
                    result = result.replace('<table><tr>', '<table><thead><tr>').replace('</tr>', '</tr></thead><tbody>');
                }
            } else {
                if (inTable) {
                    result += '</tbody></table>';
                    inTable = false;
                }
                result += `<p>${line}</p>`;
            }
        }
        if (inTable) {
            result += '</tbody></table>';
        }
        
        // Clean up empty paragraphs
        return result.replace(/<p><\/p>/g, '');
    }

    // Get analysis payload based on active input
    function getAnalysisPayload() {
        const formData = new FormData();
        let hasInput = false;

        if (activeInput === 'file') {
            const file = fileInput.files[0];
            if (!file) {
                showStatus('error', '❌ Please select a file to analyze.');
                return null;
            }
            if (!validateFile(file)) {
                return null;
            }
            formData.append('file', file);
            hasInput = true;
        } else if (activeInput === 'text') {
            const text = textInput.value.trim();
            if (!text) {
                showStatus('error', '❌ Please paste some text to analyze.');
                return null;
            }
            if (text.length < 100) {
                showStatus('error', '❌ Please provide at least 100 characters of text.');
                return null;
            }
            formData.append('raw_text', text);
            hasInput = true;
        } else if (activeInput === 'url') {
            const url = urlInput.value.trim();
            if (!url) {
                showStatus('error', '❌ Please enter a URL to analyze.');
                return null;
            }
            if (!isValidURL(url)) {
                showStatus('error', '❌ Please enter a valid URL.');
                return null;
            }
            formData.append('url', url);
            hasInput = true;
        }

        if (!hasInput) {
            showStatus('error', '❌ Please provide content to analyze.');
            return null;
        }
        return formData;
    }

    // Main analysis handler
    async function handleAnalysis() {
        resultSection.classList.remove('show');
        hideStatus();

        const formData = getAnalysisPayload();
        if (!formData) return;

        analysisStartTime = Date.now();
        analyzeBtn.classList.add('loading');
        analyzeBtn.disabled = true;
        showStatus('loading', '🔍 Uploading and analyzing document...');
        startFactCarousel();

        try {
            const response = await fetch('http://127.0.0.1:8000/api/analyze', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || `HTTP error! status: ${response.status}`);
            }
            
            displayResults(data);
        } catch (error) {
            console.error('Analysis error:', error);
            showStatus('error', `❌ Analysis failed: ${error.message}`);
        } finally {
            analyzeBtn.classList.remove('loading');
            analyzeBtn.disabled = false;
            stopFactCarousel();
        }
    }

    // Main analyze function
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', handleAnalysis);
    }

    // URL validation
    function isValidURL(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    // Display analysis results
    function displayResults(data) {
        const analysisTime = (Date.now() - analysisStartTime) / 1000;
        
        stopFactCarousel();
        // Update timing
        document.getElementById('analysisTime').textContent = 
            `Completed in ${analysisTime.toFixed(1)} seconds`;

        // Update summary
        const summaryElement = document.getElementById('summary');
        summaryElement.innerHTML = formatSummary(data.summary || 'Analysis complete.');

        // Update confidence
        document.getElementById('confidence').textContent = 
            `${data.confidence || 95}%`;

        // Update fairness score
        updateScoreDisplay(data.fairness_score || 72);

        // Show results with animation
        setTimeout(() => {
            resultSection.classList.add('show');
            showStatus('success', '✅ Analysis completed successfully!');
        }, 300);
    }

    function startFactCarousel() {
        const factElement = document.getElementById('funFact');
        if (!factElement) return;

        factElement.style.display = 'block';
        let factIndex = Math.floor(Math.random() * funFacts.length);

        const showFact = () => {
            factIndex = (factIndex + 1) % funFacts.length;
            factElement.innerHTML = `🤔 **Did you know?** ${funFacts[factIndex]}`;
            factElement.style.animation = 'fadeInOut 4s ease-in-out';
        };

        showFact(); // Show the first fact immediately
        factInterval = setInterval(showFact, 4000);
    }

    function stopFactCarousel() {
        clearInterval(factInterval);
        const factElement = document.getElementById('funFact');
        if (factElement) {
            factElement.style.display = 'none';
            factElement.style.animation = '';
        }
    }


    // Download functionality
    document.addEventListener('click', (e) => {
        if (e.target.id === 'downloadBtn' || e.target.closest('#downloadBtn')) {
            const summaryText = document.getElementById('summary').textContent;
            const fairnessScore = document.getElementById('fairnessScore').textContent;
            const confidence = document.getElementById('confidence').textContent;
            
            const reportContent = `Terms & Conditions Analysis Report
Generated: ${new Date().toLocaleString()}

Fairness Score: ${fairnessScore}/100
Confidence: ${confidence}

ANALYSIS SUMMARY:
${summaryText}

---
Generated by TermsGuard AI
https://termsguard-ai.com
            `;
            
            const blob = new Blob([reportContent], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `termsguard-analysis-${Date.now()}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            showStatus('success', '📥 Report downloaded successfully!');
        }
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Navbar scroll effect
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add shadow and background on scroll
        navbar.classList.toggle('is-scrolled', scrollTop > 10);

        // Hide navbar on scroll down, show on scroll up
        if (scrollTop > lastScrollTop && scrollTop > navbar.offsetHeight) {
            navbar.classList.add('is-hidden');
        } else {
            navbar.classList.remove('is-hidden');
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });

    // Intersection Observer for animations
    const animatedSections = document.querySelectorAll('.animated-section');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, {
        threshold: 0.1
    });

    animatedSections.forEach(section => {
        observer.observe(section);
    });

    // Logout functionality
    const userProfile = document.getElementById('userProfile');
    if (userProfile) {
        const dropdown = document.createElement('div');
        dropdown.className = 'dropdown-menu';
        dropdown.innerHTML = '<button class="dropdown-item" id="logoutBtn">Logout</button>';
        userProfile.appendChild(dropdown);

        userProfile.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('show');
        });

        document.getElementById('logoutBtn').addEventListener('click', () => {
            localStorage.removeItem('userName');
            window.location.href = 'signin.html';
        });

        window.addEventListener('click', () => {
            if (dropdown.classList.contains('show')) {
                dropdown.classList.remove('show');
            }
        });
    }
});
