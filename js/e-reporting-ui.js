/**
 * E-REPORTING-UI.JS — Simulateur interactif + Tableau filtrable
 */
document.addEventListener('DOMContentLoaded', function() {

    // =====================
    // SIMULATEUR
    // =====================
    var simulator = document.getElementById('erp-simulator');
    if (simulator) {
        var steps = simulator.querySelectorAll('.erp-step');
        var results = simulator.querySelectorAll('.erp-result');
        var resetBtn = document.getElementById('erp-reset');
        var history = [];

        simulator.addEventListener('click', function(e) {
            var btn = e.target.closest('.erp-option');
            if (!btn) return;

            var currentStep = btn.closest('.erp-step');
            var nextStep = btn.dataset.next;
            var resultId = btn.dataset.result;

            // Track history
            history.push(currentStep.dataset.step);

            // Hide current step
            currentStep.classList.add('hidden');

            if (resultId) {
                // Show result — target .erp-result specifically (not the button)
                var result = simulator.querySelector('.erp-result[data-result="' + resultId + '"]');
                if (result) {
                    result.classList.remove('hidden');
                    result.style.animation = 'erp-slide-in 0.4s ease';
                }
                resetBtn.classList.remove('hidden');
            } else if (nextStep) {
                // Show next step
                var next = simulator.querySelector('.erp-step[data-step="' + nextStep + '"]');
                if (next) {
                    next.classList.remove('hidden');
                    next.style.animation = 'erp-slide-in 0.4s ease';
                }
            }
        });

        if (resetBtn) {
            resetBtn.addEventListener('click', function() {
                // Hide all
                steps.forEach(function(s) { s.classList.add('hidden'); });
                results.forEach(function(r) { r.classList.add('hidden'); });
                resetBtn.classList.add('hidden');
                history = [];
                // Show step 1
                var step1 = simulator.querySelector('[data-step="1"]');
                step1.classList.remove('hidden');
                step1.style.animation = 'erp-slide-in 0.4s ease';
            });
        }
    }

    // =====================
    // TABLEAU FILTRABLE
    // =====================
    var filters = document.querySelectorAll('.erp-filter');
    var table = document.getElementById('erp-table');

    if (filters.length && table) {
        var rows = table.querySelectorAll('tbody tr');

        filters.forEach(function(btn) {
            btn.addEventListener('click', function() {
                var filter = btn.dataset.filter;

                // Active state
                filters.forEach(function(f) { f.classList.remove('active'); });
                btn.classList.add('active');

                // Filter rows
                rows.forEach(function(row) {
                    var tags = row.dataset.tags || '';
                    if (filter === 'all' || tags.indexOf(filter) !== -1) {
                        row.style.display = '';
                        row.style.animation = 'erp-fade-row 0.3s ease';
                    } else {
                        row.style.display = 'none';
                    }
                });
            });
        });
    }
});