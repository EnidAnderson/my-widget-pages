// Nature's Diet Body Condition Score Assessment
// Vanilla JavaScript - No dependencies

(function() {
    'use strict';

    // Scoring system for assessment answers
    const SCORING = {
        ribs: {
            'very-easy': 1,
            'easy': 2,
            'moderate': 5,
            'difficult': 7,
            'cannot': 9
        },
        spine: {
            'very-visible': 1,
            'visible': 3,
            'palpable': 5,
            'difficult': 7,
            'cannot': 9
        },
        waist: {
            'extreme': 1,
            'clear': 3,
            'slight': 5,
            'minimal': 7,
            'none': 9
        },
        tuck: {
            'extreme': 1,
            'clear': 3,
            'slight': 5,
            'minimal': 7,
            'none': 9
        },
        fat: {
            'none': 1,
            'minimal': 3,
            'moderate': 5,
            'excess': 7,
            'thick': 9
        }
    };

    // BCS Labels
    const BCS_LABELS = {
        1: 'Very Thin',
        2: 'Very Thin',
        3: 'Thin',
        4: 'Thin',
        5: 'Ideal',
        6: 'Overweight',
        7: 'Overweight',
        8: 'Obese',
        9: 'Obese'
    };

    // Recommendations based on score
    const RECOMMENDATIONS = {
        'very-thin': {
            title: 'Your Pet is Underweight',
            message: 'Your pet needs to gain weight. Please consult with your veterinarian to develop a safe weight gain plan.',
            tips: [
                'Consult your veterinarian before making dietary changes',
                'Gradually increase food portions',
                'Consider feeding more frequent, smaller meals',
                'Rule out underlying health conditions',
                'Use the Dog Food Calculator to determine appropriate feeding amounts'
            ]
        },
        'thin': {
            title: 'Your Pet is Slightly Underweight',
            message: 'Your pet could benefit from gaining a small amount of weight.',
            tips: [
                'Consider slightly increasing food portions',
                'Monitor weight weekly',
                'Use the Dog Food Calculator to adjust feeding amounts',
                'Consult your veterinarian if weight doesn\'t improve'
            ]
        },
        'ideal': {
            title: 'Your Pet is at Ideal Weight! 🎉',
            message: 'Great job! Your pet is at a healthy weight. Continue with current feeding and exercise routine.',
            tips: [
                'Maintain current feeding schedule',
                'Continue regular exercise',
                'Monitor weight monthly',
                'Regular veterinary check-ups'
            ]
        },
        'overweight': {
            title: 'Your Pet is Overweight',
            message: 'Your pet would benefit from losing weight. Gradual weight loss is safest and most effective.',
            tips: [
                'Consult your veterinarian for a weight loss plan',
                'Reduce food portions by 10-20%',
                'Increase exercise gradually',
                'Use the Dog Food Calculator to adjust feeding amounts',
                'Avoid treats and table scraps',
                'Monitor weight weekly'
            ]
        },
        'obese': {
            title: 'Your Pet is Obese',
            message: 'Your pet needs to lose weight for their health. Please consult with your veterinarian immediately to develop a safe weight loss plan.',
            tips: [
                'Consult your veterinarian immediately',
                'Significant portion reduction may be needed',
                'Structured exercise program',
                'Use the Dog Food Calculator to determine appropriate feeding amounts',
                'Eliminate treats and table scraps',
                'Regular weight monitoring',
                'Consider prescription weight management food'
            ]
        }
    };

    // DOM Elements
    const petButtons = document.querySelectorAll('.nd-bcs-pet-btn');
    const form = document.getElementById('assessmentForm');
    const resultsDiv = document.getElementById('results');
    const scoreNumber = document.getElementById('scoreNumber');
    const scoreLabel = document.getElementById('scoreLabel');
    const scoreIndicator = document.getElementById('scoreIndicator');
    const recommendation = document.getElementById('recommendation');
    const resetBtn = document.getElementById('resetBtn');
    const calculateBtn = document.getElementById('calculateBtn');
    const bcsChartImage = document.getElementById('bcsChartImage');
    const bcsChartImageCat = document.getElementById('bcsChartImageCat');
    const resultsChartImage = document.getElementById('resultsChartImage');

    // State
    let currentPet = 'dog';

    // Initialize
    function init() {
        // Pet type selection
        petButtons.forEach(btn => {
            btn.addEventListener('click', handlePetSelection);
        });

        // Form submission
        form.addEventListener('submit', handleSubmit);

        // Reset button
        resetBtn.addEventListener('click', handleReset);

        // Initialize chart image display
        updateChartImage();
    }

    // Handle pet type selection
    function handlePetSelection(e) {
        const selectedPet = e.currentTarget.dataset.pet;
        
        if (selectedPet === currentPet) return;

        currentPet = selectedPet;

        // Update active state
        petButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.pet === selectedPet);
        });

        // Update chart image
        updateChartImage();

        // Reset form if needed
        if (resultsDiv.style.display === 'block') {
            handleReset();
        }
    }

    // Update chart image based on pet type
    function updateChartImage() {
        if (currentPet === 'dog') {
            if (bcsChartImage) {
                bcsChartImage.style.display = 'block';
            }
            if (bcsChartImageCat) {
                bcsChartImageCat.style.display = 'none';
            }
        } else {
            if (bcsChartImage) {
                bcsChartImage.style.display = 'none';
            }
            if (bcsChartImageCat) {
                bcsChartImageCat.style.display = 'block';
            }
        }
    }

    // Calculate BCS score from form answers
    function calculateBCS(formData) {
        const scores = [];
        
        // Get scores for each question
        Object.keys(SCORING).forEach(key => {
            const answer = formData.get(key);
            if (answer && SCORING[key][answer] !== undefined) {
                scores.push(SCORING[key][answer]);
            }
        });

        if (scores.length === 0) return null;

        // Calculate average and round to nearest integer
        const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        const bcs = Math.round(average);
        
        // Clamp between 1 and 9
        return Math.max(1, Math.min(9, bcs));
    }

    // Get recommendation category
    function getRecommendationCategory(score) {
        if (score <= 2) return 'very-thin';
        if (score <= 4) return 'thin';
        if (score === 5) return 'ideal';
        if (score <= 7) return 'overweight';
        return 'obese';
    }

    // Calculate indicator position on scale
    function calculateIndicatorPosition(score) {
        // Scale bar is divided into 5 segments (1-2, 3-4, 5, 6-7, 8-9)
        // Each segment is 20% of the width
        let position = 0;
        
        if (score <= 2) {
            // In first segment (1-2), position based on score
            position = ((score - 1) / 2) * 20;
        } else if (score <= 4) {
            // In second segment (3-4)
            position = 20 + ((score - 3) / 2) * 20;
        } else if (score === 5) {
            // In third segment (5)
            position = 40;
        } else if (score <= 7) {
            // In fourth segment (6-7)
            position = 60 + ((score - 6) / 2) * 20;
        } else {
            // In fifth segment (8-9)
            position = 80 + ((score - 8) / 2) * 20;
        }
        
        return position;
    }

    // Display results
    function displayResults(score) {
        const category = getRecommendationCategory(score);
        const rec = RECOMMENDATIONS[category];
        const label = BCS_LABELS[score];
        const position = calculateIndicatorPosition(score);

        // Update score display
        scoreNumber.textContent = score;
        scoreLabel.textContent = label;

        // Update indicator position
        scoreIndicator.style.left = `${position}%`;

        // Update recommendation
        recommendation.innerHTML = `
            <h3>${rec.title}</h3>
            <p>${rec.message}</p>
            <ul>
                ${rec.tips.map(tip => `<li>${tip}</li>`).join('')}
            </ul>
        `;

        // Show relevant chart in results
        if (resultsChartImage) {
            // Use absolute path from root since widget is loaded dynamically
            const chartSrc = currentPet === 'dog' 
                ? 'body-condition-widget/assets/images/dog-bcs-chart.webp'
                : 'body-condition-widget/assets/images/cat-bcs-chart.webp';
            resultsChartImage.src = chartSrc;
            resultsChartImage.alt = `${currentPet === 'dog' ? 'Dog' : 'Cat'} Body Condition Score Chart`;
            resultsChartImage.onload = function() {
                resultsChartImage.style.display = 'block';
            };
            resultsChartImage.onerror = function() {
                resultsChartImage.style.display = 'none';
            };
        }

        // Show results
        resultsDiv.style.display = 'block';
        resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Handle form submission
    function handleSubmit(e) {
        e.preventDefault();

        const formData = new FormData(form);
        const score = calculateBCS(formData);

        if (score === null) {
            alert('Please answer all questions.');
            return;
        }

        displayResults(score);
        calculateBtn.setAttribute('aria-expanded', 'true');
    }

    // Handle reset
    function handleReset() {
        form.reset();
        resultsDiv.style.display = 'none';
        scoreNumber.textContent = '-';
        scoreLabel.textContent = '-';
        recommendation.innerHTML = '';
        calculateBtn.setAttribute('aria-expanded', 'false');
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Initialize when DOM is ready or immediately if already loaded
    // Also support dynamic loading (when script is injected after page load)
    function initialize() {
        // Check if required elements exist
        if (form && petButtons && petButtons.length > 0) {
            init();
        } else {
            // If elements don't exist yet, wait a bit and try again
            setTimeout(initialize, 50);
        }
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        // DOM already loaded, but widget might be injected dynamically
        // Try to initialize immediately
        initialize();
    }

})();
