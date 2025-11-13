// Function to encode data to Base64
function encodeBase64() {
    const inputText = document.getElementById('base64-encode-input').value.trim();
    if (!inputText) {
        alert("Please enter some text to encode.");
        return;
    }
    const encodedText = btoa(inputText);
    document.getElementById('base64-encode-output').value = encodedText;
}

// Function to decode Base64 data
function decodeBase64() {
    const inputText = document.getElementById('base64-decode-input').value.trim();
    if (!inputText) {
        alert("Please enter some Base64 text to decode.");
        return;
    }
    try {
        const decodedText = atob(inputText);
        document.getElementById('base64-decode-output').value = decodedText;
    } catch (e) {
        alert("Invalid Base64 input.");
    }
}

// Function to clear Base64 encode input and output fields
function clearBase64EncodeFields() {
    document.getElementById('base64-encode-input').value = '';
    document.getElementById('base64-encode-output').value = '';
}

// Function to clear Base64 decode input and output fields
function clearBase64DecodeFields() {
    document.getElementById('base64-decode-input').value = '';
    document.getElementById('base64-decode-output').value = '';
}

// Function to decode URL data
function decodeURL() {
    const inputText = document.getElementById('url-decode-input').value.trim();
    if (!inputText) {
        alert("Please enter some URL to decode.");
        return;
    }
    try {
        const decodedText = decodeURIComponent(inputText);
        document.getElementById('url-decode-output').value = decodedText;
    } catch (e) {
        alert("Invalid URL input.");
    }
}

// Function to clear URL decode input and output fields
function clearURLDecodeFields() {
    document.getElementById('url-decode-input').value = '';
    document.getElementById('url-decode-output').value = '';
}

// JSON Buddy Functionality
let jsonEditor;

// Theme Management
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    const themeIcon = document.getElementById('theme-icon');
    const themeText = document.getElementById('theme-text');
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    if (newTheme === 'dark') {
        themeIcon.className = 'fas fa-sun';
        themeText.textContent = 'Light Mode';
    } else {
        themeIcon.className = 'fas fa-moon';
        themeText.textContent = 'Dark Mode';
    }
}

// Load saved theme on page load
function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark'; // Default to dark mode
    const themeIcon = document.getElementById('theme-icon');
    const themeText = document.getElementById('theme-text');
    
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    if (savedTheme === 'dark') {
        themeIcon.className = 'fas fa-sun';
        themeText.textContent = 'Light Mode';
    } else {
        themeIcon.className = 'fas fa-moon';
        themeText.textContent = 'Dark Mode';
    }
}

// Initialize CodeMirror editor when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Load theme first
    loadTheme();
    
    const textarea = document.getElementById('json-editor');
    if (textarea) {
        jsonEditor = CodeMirror.fromTextArea(textarea, {
            mode: 'application/json',
            lineNumbers: true,
            theme: 'default',
            indentUnit: 2,
            tabSize: 2,
            lineWrapping: true,
            autoCloseBrackets: true,
            matchBrackets: true,
            foldGutter: true,
            gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
            placeholder: '{\n  "name": "JSON Buddy",\n  "version": "1.0.0",\n  "features": [\n    "validation",\n    "compression",\n    "formatting"\n  ],\n  "active": true\n}'
        });
        
        // Start with empty editor - no preset content
        jsonEditor.setValue('');
        
        // Add placeholder styling
        jsonEditor.on('change', function() {
            if (jsonEditor.getValue().trim() === '') {
                jsonEditor.getWrapperElement().classList.add('CodeMirror-empty');
            } else {
                jsonEditor.getWrapperElement().classList.remove('CodeMirror-empty');
            }
        });
        
        // Trigger initial check
        jsonEditor.getWrapperElement().classList.add('CodeMirror-empty');
    }
});

// Function to validate JSON
function validateJSON() {
    const jsonText = jsonEditor.getValue().trim();
    const resultDiv = document.getElementById('json-result');
    const outputTextarea = document.getElementById('json-output');
    
    // Hide output textarea
    outputTextarea.style.display = 'none';
    
    if (!jsonText) {
        showResult('Please enter some JSON to validate.', 'info');
        return;
    }
    
    try {
        // Use native JSON.parse for validation
        const parsed = JSON.parse(jsonText);
        showResult('✅ Your JSON is valid!', 'success');
        
        // Don't display the formatted JSON for validation
        // Just show success message
        
    } catch (error) {
        // Extract useful error information
        let errorMessage = '❌ Invalid JSON: ' + error.message;
        
        // Try to extract position information from the error message
        const positionMatch = error.message.match(/position (\d+)/);
        if (positionMatch) {
            const position = parseInt(positionMatch[1]);
            const lines = jsonText.substring(0, position).split('\n');
            const line = lines.length;
            const column = lines[lines.length - 1].length + 1;
            errorMessage = `❌ Invalid JSON at line ${line}, column ${column}: ${error.message}`;
        }
        
        showResult(errorMessage, 'error');
    }
}

// Function to format JSON
function formatJSON() {
    const jsonText = jsonEditor.getValue().trim();
    const resultDiv = document.getElementById('json-result');
    const outputTextarea = document.getElementById('json-output');
    
    if (!jsonText) {
        showResult('Please enter some JSON to format.', 'info');
        outputTextarea.style.display = 'none';
        return;
    }
    
    try {
        // Parse and format JSON with proper indentation
        const parsed = JSON.parse(jsonText);
        const formatted = JSON.stringify(parsed, null, 2);
        
        // Update the editor with formatted JSON
        jsonEditor.setValue(formatted);
        
        showResult('✅ JSON formatted successfully!', 'success');
        outputTextarea.style.display = 'none';
        
    } catch (error) {
        let errorMessage = '❌ Cannot format invalid JSON: ' + error.message;
        
        // Try to extract position information from the error message
        const positionMatch = error.message.match(/position (\d+)/);
        if (positionMatch) {
            const position = parseInt(positionMatch[1]);
            const lines = jsonText.substring(0, position).split('\n');
            const line = lines.length;
            const column = lines[lines.length - 1].length + 1;
            errorMessage = `❌ Invalid JSON at line ${line}, column ${column}: ${error.message}`;
        }
        
        showResult(errorMessage, 'error');
        outputTextarea.style.display = 'none';
    }
}

// Function to compress JSON
function compressJSON() {
    const jsonText = jsonEditor.getValue().trim();
    const resultDiv = document.getElementById('json-result');
    const outputTextarea = document.getElementById('json-output');
    
    if (!jsonText) {
        showResult('Please enter some JSON to compress.', 'info');
        outputTextarea.style.display = 'none';
        return;
    }
    
    try {
        // Validate and compress using native JSON.parse
        const parsed = JSON.parse(jsonText);
        const compressed = JSON.stringify(parsed);
        
        outputTextarea.value = compressed;
        outputTextarea.style.display = 'block';
        
        const originalSize = jsonText.length;
        const compressedSize = compressed.length;
        const savings = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
        
        showResult(`✅ JSON compressed successfully! Size reduced by ${savings}% (${originalSize} → ${compressedSize} characters)`, 'success');
        
    } catch (error) {
        let errorMessage = '❌ Cannot compress invalid JSON: ' + error.message;
        
        // Try to extract position information from the error message
        const positionMatch = error.message.match(/position (\d+)/);
        if (positionMatch) {
            const position = parseInt(positionMatch[1]);
            const lines = jsonText.substring(0, position).split('\n');
            const line = lines.length;
            const column = lines[lines.length - 1].length + 1;
            errorMessage = `❌ Invalid JSON at line ${line}, column ${column}: ${error.message}`;
        }
        
        showResult(errorMessage, 'error');
        outputTextarea.style.display = 'none';
    }
}

// Function to clear JSON editor
function clearJSONEditor() {
    jsonEditor.setValue('');
    const resultDiv = document.getElementById('json-result');
    const outputTextarea = document.getElementById('json-output');
    
    resultDiv.style.display = 'none';
    resultDiv.className = 'json-result';
    outputTextarea.style.display = 'none';
    outputTextarea.value = '';
}

// Helper function to show results
function showResult(message, type) {
    const resultDiv = document.getElementById('json-result');
    resultDiv.className = `json-result ${type}`;
    resultDiv.innerHTML = `<span class="result-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>${message}`;
    resultDiv.style.display = 'block';
}

// Innovative Feedback Functions
function openFeedback(type) {
    const email = 'sandy3061994@gmail.com';
    const subject = 'Feedback for Encoder/Decoder & JSON Validator Tool';
    const body = 'Hi Sandeep,\n\nI have feedback about your web tool:\n\n';
    
    switch(type) {
        case 'email':
            window.open(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_self');
            break;
        case 'linkedin':
            window.open('https://www.linkedin.com/in/sandeep-gupta-a03285164', '_blank');
            break;
    }
}

function openGitHub() {
    // GitHub repository link
    const githubUrl = 'https://github.com/codebysandeep-hub/Base64-Encoder-Decoder-JSON-Validator';
    
    // Open GitHub link in new tab
    window.open(githubUrl, '_blank');
}

function showAppreciationModal() {
    document.getElementById('appreciation-modal').style.display = 'block';
    initializeStarRating();
}

function closeModal() {
    document.getElementById('appreciation-modal').style.display = 'none';
}

function initializeStarRating() {
    const stars = document.querySelectorAll('.star');
    const messageDiv = document.getElementById('rating-message');
    
    stars.forEach((star, index) => {
        star.addEventListener('click', () => {
            const rating = index + 1;
            
            // Reset all stars
            stars.forEach(s => s.classList.remove('active'));
            
            // Activate clicked star and all previous ones
            for(let i = 0; i <= index; i++) {
                stars[i].classList.add('active');
            }
            
            // Show thank you message
            const messages = [
                "Thanks for the feedback! We'll improve! 😊",
                "Thank you! We appreciate your honesty! 🤝",
                "Great! We're glad you find it useful! 👍",
                "Awesome! We're thrilled you like it! 🎉",
                "Amazing! You've made our day! ⭐"
            ];
            
            messageDiv.innerHTML = `
                <div style="animation: fadeIn 0.5s ease;">
                    ${messages[rating - 1]}
                    <br>
                    <small style="opacity: 0.7;">Rating: ${rating}/5 stars</small>
                </div>
            `;
            
            // Auto close after 3 seconds
            setTimeout(() => {
                closeModal();
                // Reset for next time
                stars.forEach(s => s.classList.remove('active'));
                messageDiv.innerHTML = '';
            }, 3000);
        });
        
        star.addEventListener('mouseenter', () => {
            // Temporarily highlight on hover
            stars.forEach(s => s.style.transform = 'scale(1)');
            for(let i = 0; i <= index; i++) {
                stars[i].style.transform = 'scale(1.2)';
            }
        });
        
        star.addEventListener('mouseleave', () => {
            stars.forEach(s => s.style.transform = 'scale(1)');
        });
    });
}

// Close modal when clicking outside
window.addEventListener('click', (event) => {
    const modal = document.getElementById('appreciation-modal');
    if (event.target === modal) {
        closeModal();
    }
});
