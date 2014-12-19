Package.describe({
    name: 'juanchamizo:agile-forms',
    summary: 'An Agile way to create, show, and collect forms',
    version: '1.0.0',
    git: 'https://github.com/jotakaele/meteor-agile-forms.git'
});
Package.onUse(function(api) {
    api.versionsFrom('1.0.1');
    api.addFiles('juanchamizo:agile-forms.js');
});
Package.onTest(function(api) {
    api.use('tinytest');
    api.use('juanchamizo:agile-forms');
    api.addFiles('juanchamizo:agile-forms-tests.js');
});
