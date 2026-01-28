// Nature's Diet Dog Food Calculator
// Vanilla JavaScript - No dependencies

(function() {
    'use strict';

    // Configuration - Update these values based on Nature's Diet® food specifications
    const CONFIG = {
        // Calories per gram of Nature's Diet® food (update with actual value)
        caloriesPerGram: 3.75, // Example: adjust based on actual product
        // Grams per cup of Nature's Diet® food (update with actual value)
        gramsPerCup: 85, // Example: adjust based on actual product
        // Calories per 3 lb Simply Raw® bag (approx. 16 cups x 320 kcal)
        caloriesPerBag: 5120,
        // Approximate days per month for bag estimate
        daysPerMonth: 30,
        // Activity multipliers
        activityMultipliers: {
            sedentary: 1.2,
            moderate: 1.4,
            active: 1.6,
            'very-active': 1.8
        },
        // Life stage multipliers
        lifeStageMultipliers: {
            puppy: 2.0,
            adult: 1.0,
            senior: 0.9
        }
    };

    // DOM Elements
    const form = document.getElementById('calculatorForm');
    const weightInput = document.getElementById('dogWeight');
    const activitySelect = document.getElementById('activityLevel');
    const lifeStageSelect = document.getElementById('lifeStage');
    const unitButtons = document.querySelectorAll('.nd-calc-unit-btn');
    const weightError = document.getElementById('weightError');
    const resultsDiv = document.getElementById('results');
    const resultCalories = document.getElementById('resultCalories');
    const resultCups = document.getElementById('resultCups');
    const resultGrams = document.getElementById('resultGrams');
    const resultBags = document.getElementById('resultBags');
    const resultSchedule = document.getElementById('resultSchedule');
    const calculateBtn = document.getElementById('calculateBtn');
    const resetBtn = document.getElementById('resetBtn');

    // State
    let currentUnit = 'lbs';

    // Initialize
    function init() {
        // Unit toggle
        unitButtons.forEach(btn => {
            btn.addEventListener('click', handleUnitToggle);
        });

        // Form submission
        form.addEventListener('submit', handleSubmit);

        // Real-time validation
        weightInput.addEventListener('input', validateWeight);
        weightInput.addEventListener('blur', validateWeight);

        // Reset button
        resetBtn.addEventListener('click', handleReset);

        // Prevent form submission on Enter in number input (mobile keyboards)
        weightInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                form.dispatchEvent(new Event('submit'));
            }
        });
    }

    // Unit conversion
    function convertWeight(weight, fromUnit, toUnit) {
        if (fromUnit === toUnit) return weight;
        if (fromUnit === 'lbs' && toUnit === 'kg') {
            return weight * 0.453592;
        }
        if (fromUnit === 'kg' && toUnit === 'lbs') {
            return weight * 2.20462;
        }
        return weight;
    }

    // Calculate BMR (Base Metabolic Rate) using standard formula
    function calculateBMR(weightKg) {
        // RER (Resting Energy Requirement) = 70 × (weight in kg)^0.75
        return 70 * Math.pow(weightKg, 0.75);
    }

    // Calculate daily calories needed
    function calculateDailyCalories(weightKg, activityLevel, lifeStage) {
        const bmr = calculateBMR(weightKg);
        const activityMultiplier = CONFIG.activityMultipliers[activityLevel] || 1.4;
        const lifeStageMultiplier = CONFIG.lifeStageMultipliers[lifeStage] || 1.0;
        
        return bmr * activityMultiplier * lifeStageMultiplier;
    }

    // Calculate food amount
    function calculateFoodAmount(calories) {
        const grams = calories / CONFIG.caloriesPerGram;
        const cups = grams / CONFIG.gramsPerCup;
        return { grams, cups };
    }

    function calculateBagsPerMonth(caloriesPerDay) {
        return (caloriesPerDay * CONFIG.daysPerMonth) / CONFIG.caloriesPerBag;
    }

    // Determine feeding schedule
    function getFeedingSchedule(cups) {
        if (cups <= 0.5) {
            return '1 meal per day';
        } else if (cups <= 2) {
            return '2 meals per day';
        } else {
            return '2-3 meals per day';
        }
    }

    // Format numbers
    function formatNumber(num, decimals = 1) {
        return parseFloat(num.toFixed(decimals));
    }

    // Validate weight input
    function validateWeight() {
        const weight = parseFloat(weightInput.value);
        const minWeight = currentUnit === 'lbs' ? 1 : 0.5;
        const maxWeight = currentUnit === 'lbs' ? 300 : 136;

        if (!weightInput.value || weightInput.value.trim() === '') {
            weightError.textContent = '';
            weightInput.setCustomValidity('');
            return false;
        }

        if (isNaN(weight) || weight <= 0) {
            weightError.textContent = 'Please enter a valid weight';
            weightInput.setCustomValidity('Please enter a valid weight');
            return false;
        }

        if (weight < minWeight) {
            weightError.textContent = `Weight must be at least ${minWeight} ${currentUnit}`;
            weightInput.setCustomValidity(`Weight must be at least ${minWeight} ${currentUnit}`);
            return false;
        }

        if (weight > maxWeight) {
            weightError.textContent = `Weight must be less than ${maxWeight} ${currentUnit}`;
            weightInput.setCustomValidity(`Weight must be less than ${maxWeight} ${currentUnit}`);
            return false;
        }

        weightError.textContent = '';
        weightInput.setCustomValidity('');
        return true;
    }

    // Handle unit toggle
    function handleUnitToggle(e) {
        const clickedUnit = e.target.dataset.unit;
        
        if (clickedUnit === currentUnit) return;

        // Convert current weight value
        const currentWeight = parseFloat(weightInput.value);
        if (!isNaN(currentWeight) && currentWeight > 0) {
            const convertedWeight = convertWeight(currentWeight, currentUnit, clickedUnit);
            weightInput.value = formatNumber(convertedWeight, 1);
        }

        // Update active state
        unitButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.unit === clickedUnit);
        });

        currentUnit = clickedUnit;
        
        // Update placeholder and validation
        weightInput.setAttribute('placeholder', `Enter weight in ${clickedUnit}`);
        validateWeight();
    }

    // Handle form submission
    function handleSubmit(e) {
        e.preventDefault();

        if (!validateWeight()) {
            weightInput.focus();
            return;
        }

        // Get form values
        const weight = parseFloat(weightInput.value);
        const activityLevel = activitySelect.value;
        const lifeStage = lifeStageSelect.value;

        // Convert weight to kg for calculation
        const weightKg = currentUnit === 'lbs' 
            ? convertWeight(weight, 'lbs', 'kg')
            : weight;

        // Calculate
        const dailyCalories = calculateDailyCalories(weightKg, activityLevel, lifeStage);
        const foodAmount = calculateFoodAmount(dailyCalories);
        const bagsPerMonth = calculateBagsPerMonth(dailyCalories);
        const schedule = getFeedingSchedule(foodAmount.cups);

        // Display results
        resultCalories.textContent = `${Math.round(dailyCalories)} calories`;
        resultCups.textContent = `${formatNumber(foodAmount.cups)} cups`;
        // resultGrams.textContent = `${formatNumber(foodAmount.grams)} grams`;
        resultBags.textContent = `${formatNumber(bagsPerMonth, 2)} bags`;
        resultSchedule.textContent = schedule;

        // Show results
        resultsDiv.style.display = 'block';
        resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Focus management for accessibility
        calculateBtn.setAttribute('aria-expanded', 'true');
    }

    // Handle reset
    function handleReset() {
        form.reset();
        resultsDiv.style.display = 'none';
        weightError.textContent = '';
        weightInput.setCustomValidity('');
        currentUnit = 'lbs';
        
        // Reset unit toggle
        unitButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.unit === 'lbs');
        });
        
        weightInput.focus();
        calculateBtn.setAttribute('aria-expanded', 'false');
    }

    // Initialize when DOM is ready or immediately if already loaded
    // Also support dynamic loading (when script is injected after page load)
    function initialize() {
        // Check if required elements exist
        if (form && weightInput && activitySelect && lifeStageSelect) {
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
