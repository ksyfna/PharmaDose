🩺 PharmaDose: Advanced Clinical Dosing & Renal Suite
PharmaDose is a high-performance clinical decision support tool designed to eliminate manual calculation errors in high-pressure medical environments. Built with a focus on pediatric safety, renal precision, and pharmaceutical efficiency, it provides a modern interface for complex medical algorithms.

🚀 Key Modules
1. Precision Pediatric Dosing
Indication-Driven Logic: Automated protocols for Pneumonia (CAP) and Tonsillitis based on established clinical guidelines.

Smart Concentration Toggle: Instant switching between 125mg/5ml and 250mg/5ml to optimize dose volume and patient adherence.

Safety Ceiling Engine: Integrated "Adult Max" guardrails that automatically cap doses at 4g/day to prevent toxicity in higher-weight children.

2. Renal Adjustment & Risk Suite
Dynamic CrCl Assessment: Real-time safety status indicators for high-risk medications including NSAIDs, Metformin, and Gabapentin.

Clinical Guardrails: Provides specific "Monitor" or "Adjust" alerts based on the patient's calculated Creatinine Clearance.

Nephrotoxicity Alerts: Strategic warnings for NSAID use to prevent Acute Kidney Injury (AKI) in borderline renal cases.

3. Insulin Supply Logistics
Monthly Inventory Estimation: Calculates exact unit requirements for 30-day treatment cycles.

Multi-Format Support: Pre-configured for standard 300 IU (3ml) and high-concentration 450 IU (1.5ml) penfills.

Dispensing Optimization: Uses ceiling-rounding logic to ensure patients receive a complete supply without treatment gaps.

🛠️ Technical Architecture
Core Framework: Developed using Expo (React Native) for cross-platform performance.

Design System: Modern "Glassmorphism" UI featuring soft depth, floating cards, and a vibrant accent-led color palette.

Asset Pipeline: Custom medical iconography designed with Aseprite for a unique, professional aesthetic.

Algorithmic Engine: Centralized logic for Cockcroft-Gault and Pediatric dose-rounding formulas.

⚙️ Installation & Deployment
Ensure you have Node.js installed, then execute:

Clone the Repository:

Bash
git clone https://github.com/yourusername/medicalc-app.git
cd medicalc-app
Install Dependencies:

Bash
npm install
Launch Developer Environment:

Bash
npx expo start

Clinical Logic: Verified against standard medical protocols and pharmacy dispensing practices.

Would you like me to help you write the "Clinical Logic" section where we explain the specific math formulas used in the background?
