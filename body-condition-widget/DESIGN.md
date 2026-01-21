# Body Condition Score Widget - Design Plan

## Overview
An interactive widget that helps pet owners assess their pet's body condition score (BCS) to determine if their pet is underweight, ideal weight, or overweight.

## Features

### 1. Pet Type Selection
- Radio buttons or tabs: "Dog" or "Cat"
- Different BCS scales and visuals for each

### 2. Interactive Assessment
- Step-by-step guide through BCS evaluation
- Questions about:
  - Rib visibility/feel
  - Spine and hip bone visibility/feel
  - Waist visibility (from above)
  - Abdominal tuck (from side)
  - Fat deposits
  - Muscle condition

### 3. Visual Guides
- Side view illustrations for each BCS score (1-9)
- Top view illustrations for each BCS score
- Interactive: User can click through scores to see examples
- Color-coded scale:
  - 1-2: Very Thin (warning color)
  - 3-4: Thin (caution color)
  - 5: Ideal (success color)
  - 6-7: Overweight (caution color)
  - 8-9: Obese (warning color)

### 4. Assessment Flow
1. Select pet type (Dog/Cat)
2. View BCS scale overview
3. Interactive assessment questions
4. Calculate BCS based on answers
5. Display results with:
   - Calculated BCS score
   - Visual representation
   - Status (Ideal/Underweight/Overweight)
   - Recommendations
   - Next steps

### 5. Results Display
- Clear BCS score (1-9)
- Visual indicator on scale
- Status message
- Recommendations:
  - If underweight: feeding increase suggestions
  - If ideal: maintenance tips
  - If overweight: weight management advice
- Link to calculator widget for feeding adjustments

## Technical Implementation

### File Structure
```
body-condition-widget/
├── index.html
├── css/
│   └── styles.css
└── js/
    └── assessment.js
```

### Data Structure
- BCS definitions for dogs (1-9)
- BCS definitions for cats (1-9)
- Assessment questions and scoring logic
- Recommendations based on score

### UI Components
- Pet type selector (tabs)
- BCS scale visualization
- Assessment form (step-by-step or all at once)
- Results card
- Visual comparison tool

## Design Principles
- Match Nature's Diet® branding (orange/gold colors)
- Mobile-first responsive design
- Clear, simple language
- Visual-heavy (illustrations are key)
- Scoped CSS (`.nd-bcs-*` prefix)
- Accessible (ARIA labels, keyboard navigation)

## User Flow
1. Land on widget
2. Select "Dog" or "Cat"
3. See BCS scale overview with visuals
4. Click "Assess My Pet" button
5. Answer 5-7 assessment questions
6. View results with score and recommendations
7. Option to "Assess Again" or link to calculator
