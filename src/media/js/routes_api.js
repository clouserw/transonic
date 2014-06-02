define('routes_api', [], function() {
    return {
        'login': '/api/v1/account/login/',

        'app': '/api/v1/apps/app/{0}/?cache=1&vary=0',
        'collections': '/api/v2/feed/collections/',
        'collection': '/api/v2/feed/collections/{0}/',
        'collections-add-app': '/api/v2/feed/collections/{0}/add_app/',
        'feed-apps': '/api/v2/feed/apps/',
        'feed-app': '/api/v2/feed/apps/{0}/',
        'feed-app-image': '/api/v2/feed/apps/{0}/image/',
        'feed-items': '/api/v2/feed/items/',
        'search': '/api/v1/apps/search/suggest?cache=1&vary=0',
    };
});
