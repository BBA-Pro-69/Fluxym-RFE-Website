/**
 * GENERATOR-UI.JS
 * Fusion de app.js + ui-manager.js, adapté au template Academy.
 * Aucune dépendance vers main.css ou l'ancien header.
 */

const GeneratorUI = {

    // Remplir le select cas d'usage + paramètres avancés
    populateSelects: function() {
        var data = window.APP_DATA;

        // 1. Menu cas d'usage
        var usecaseSelect = document.getElementById('usecase');
        usecaseSelect.innerHTML = '';
        for (var key in data.pedagogy) {
            if (data.pedagogy.hasOwnProperty(key)) {
                var option = document.createElement('option');
                option.value = key;
                option.textContent = data.pedagogy[key].label;
                usecaseSelect.appendChild(option);
            }
        }

        // 2. Paramètres avancés (Fournisseur, Acheteur, Factor)
        var settingsContainer = document.getElementById('companies-settings');
        var html =
            '<div class="gen-field">' +
                '<label>Fournisseur (Supplier)</label>' +
                '<select id="adv-supplier">' +
                    data.companies.suppliers.map(function(s) {
                        return '<option value="' + s.id + '">' + s.name + ' (' + s.siren + ')</option>';
                    }).join('') +
                '</select>' +
            '</div>' +
            '<div class="gen-field">' +
                '<label>Acheteur (Buyer)</label>' +
                '<select id="adv-buyer">' +
                    data.companies.buyers.map(function(b) {
                        return '<option value="' + b.id + '">' + b.name + ' (' + b.siren + ')</option>';
                    }).join('') +
                '</select>' +
            '</div>' +
            '<div class="gen-field hidden" id="group-factor">' +
                '<label>Factor (Affacturage)</label>' +
                '<select id="adv-factor">' +
                    data.companies.factors.map(function(f) {
                        return '<option value="' + f.id + '">' + f.name + '</option>';
                    }).join('') +
                '</select>' +
            '</div>';

        settingsContainer.innerHTML = html;
    },

    // Mise à jour de la fiche pédagogique avec animation fade
    updateWithFade: function() {
        var el = document.getElementById('theory-content');
        el.style.opacity = '0';
        setTimeout(function() {
            GeneratorUI.updateInfoBox();
            el.style.opacity = '1';
        }, 150);
    },

    // Mettre à jour le contenu pédagogique + info technique
    updateInfoBox: function() {
        var usecase = document.getElementById('usecase').value;
        var theory = window.APP_DATA.pedagogy[usecase];
        if (!theory) return;

        // Fiche pédagogique
        document.getElementById('theory-content').innerHTML =
            '<span class="gen-badge">' + theory.badge + '</span>' +
            '<h3 class="gen-theory-title">' + theory.title + '</h3>' +
            '<div class="gen-theory-body">' +
                '<p>' + theory.desc1 + '</p>' +
                '<p>' + theory.desc2 + '</p>' +
            '</div>';

        // Résumé technique
        document.getElementById('info-text').innerHTML = theory.info;

        // Factor visibility (cas 8)
        var groupFactor = document.getElementById('group-factor');
        if (groupFactor) {
            if (usecase === '8') {
                groupFactor.classList.remove('hidden');
            } else {
                groupFactor.classList.add('hidden');
            }
        }

        // Reset success
        document.getElementById('success-msg').classList.add('hidden');
    },

    // Afficher le message de succès
    showSuccess: function(fileName) {
        var msg = document.getElementById('success-msg');
        document.getElementById('filename-display').innerText = fileName;
        msg.classList.remove('hidden');
    }
};

// ========================================
// INIT — Remplace app.js
// ========================================
document.addEventListener('DOMContentLoaded', function() {

    // Charger les JSON
    Promise.all([
        fetch('./data/pedagogy.json').then(function(r) { return r.json(); }),
        fetch('./data/companies.json').then(function(r) { return r.json(); })
    ])
    .then(function(results) {
        window.APP_DATA = {
            pedagogy: results[0],
            companies: results[1]
        };

        // Initialiser l'interface
        GeneratorUI.populateSelects();
        GeneratorUI.updateInfoBox();

        // Events
        document.getElementById('usecase').addEventListener('change', function() {
            GeneratorUI.updateWithFade();
        });

        document.getElementById('btn-generate').addEventListener('click', function() {
            UBLGenerator.generateFile();
        });
    })
    .catch(function(error) {
        console.error('Erreur chargement données :', error);
        document.getElementById('theory-content').innerHTML =
            '<div class="callout callout--warning">' +
                '<div class="callout-icon">⚠️</div>' +
                '<div class="callout-content"><strong>Erreur :</strong> Impossible de charger les fichiers JSON. ' +
                'Vérifiez que le projet tourne via un serveur local (Live Server).</div>' +
            '</div>';
    });
});

// Rétrocompatibilité — UBLGenerator appelle UIManager.showSuccess()
var UIManager = {
    showSuccess: function(fileName) {
        GeneratorUI.showSuccess(fileName);
    }
};