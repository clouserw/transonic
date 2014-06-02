define('fields_transonic',
    ['app_selector', 'apps_widget', 'jquery', 'jquery.fakefilefield', 'log', 'nunjucks', 'preview_tray', 'requests', 'settings', 'urls', 'utils', 'z'],
    function(app_select, apps_widget, $, fakefilefield, log, nunjucks, preview_tray, requests, settings, urls, utils, z) {
    'use strict';

    var imageUploads = {};  // keep track of drag-and-drop uploads to stuff into FormData later.

    z.page.on('change', '.colors input', function() {
        // Sync color previews and inputs.
        var $this = $(this);
        var $parent = $(this).closest('.colors');
        var color = $this.attr('value');
        $parent.find('.selected-color').css('background', color);
        $parent.find('.selected-text').text(color);
    })
    .on('change', '.featured-type-choices input', function(e) {
        // Tab between different featured types (graphic, desc, pull quote).
        $('.featured-details').hide().filter('.' + this.getAttribute('data-type')).show();
    })
    .on('change', '.collection-type-choices input', function(e) {
        // To help CSS toggle background image upload widgets for different collection types.
        $('.collection-type').hide().filter('.' + this.value).show();
        $('.collection-type.bg').attr('data-collection-type', this.value);
    })
    .on('change', '.editorial-type select', function() {
        var $helptext = $('.editorial-helptext').hide();
        if ($(this).find('.table').prop('selected')) {
            $helptext.filter('.table').show();
        } else {
            $helptext.filter('.list').show();
        }
    })
    .on('app-selected', function(e, id) {
        if ($('.transonic-form').data('type') == 'apps') {
            apps_widget.set(id);

            requests.get(urls.api.unsigned.url('app', [id])).done(function(app) {
                $('.screenshots').html(nunjucks.env.render('preview_tray.html', {app: app}));
                z.page.trigger('populatetray');
            });
        } else {
            apps_widget.append(id);
        }
    })
    .on('click', '.preview-tray li', utils._pd(function() {
        // Preview tray, select screenshot.
        var $this = $(this);

        // Move image to middle, activate the dot.
        $this.closest('.preview-tray').find('.dot').eq($this.index()).trigger('click')

        // Set the input value to the src.
        .closest('.screenshot').find('input').val($this.data('id'));
    }))

    // Drag and drop image uploads.
    .on('dragover dragleave', function(e) {
        e.preventDefault();
        e.stopPropagation();
    })
    .on('drop', '.background-image-input', utils._pd(function(e) {
        var $this = $(this);

        // Read file.
        var file = e.originalEvent.dataTransfer.files[0];

        // Preview file.
        if (['image/png', 'image/jpeg'].indexOf(file.type) !== -1) {
            var reader = new FileReader();
            reader.onload = function(e) {
                $this.addClass('filled')
                     .find('.preview').attr('src', e.target.result);
                $this.find('input[type="text"]').attr('value', file.name);
            };
            reader.readAsDataURL(file);
            imageUploads[$this.find('[type="file"]').attr('name')] = file;
        }
    }))

    // Click image uploads.
    .on('loaded', function() {
        $('.fileinput').fakeFileField();
    })
    .on('change', '.background-image-input [type="file"]', function() {
       var file = this.files[0];
       var preview = $(this).closest('.background-image-input').find('.preview');
       var reader = new FileReader();

       reader.onloadend = function() {
           preview.attr('src', reader.result);
       };
       if (file) {
           reader.readAsDataURL(file);
       }
       $(this).closest('.background-image-input').addClass('filled');
    })

    // Localization of text fields.
    .on('change', '#locale-switcher', function() {
        var lang = this.value;
        $('.localized').hide()
                       .filter('[data-lang=' + lang + ']').show();
    });
});
