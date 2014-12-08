NYTimes = function() {};

if (window.DEBUG) {
    NYTimes.base_url = "http://localhost:8000/query";
} else {
    NYTimes.base_url = "http://api.nytimes.com";
}

NYTimes.prototype = {
    article_search: {
        api_key:"b12b7d1b75acc487ce7707b7ee35db4f:15:70159459",
        _makeRequest: function(params) {
            var url = NYTimes.base_url + "/svc/search/v2/articlesearch.json";

            if (!window.DEBUG) {
                url += 'p?callback=?';
            }

            params = params || {};
            params["api-key"] = this.api_key;

            return $.getJSON(url, params);
        },

        byUrl: function(url, params) {
            params = params || {};
            params['fq'] = 'web_url:("' + url + '")';
            return this._makeRequest(params);
        }
    },
    books: {
        api_key:"f0ef810f05fcae47daee09b361966c21:9:70159459",
        _makeRequest: function(resource, params) {
            var url = NYTimes.base_url + "/svc/books/v3/" + resource + ".json";

            if (!window.DEBUG) {
                url += 'p?callback=?';
            }

            params = params || {};
            params["api-key"] = this.api_key;

            return $.getJSON(url, params);
        },

        fiction: function(params) {
            return this._makeRequest("lists/combined-print-and-e-book-fiction", params);
        },

        nonfiction: function(params) {
            return this._makeRequest("lists/combined-print-and-e-book-nonfiction", params);
        },

        listNames: function(params) {
            return this._makeRequest("lists/names", params);
        },

        byList: function(list_name, params) {
            return this._makeRequest("lists/" + list_name, params);
        },

        byIsbn: function(isbn, params) {
            params = params || {};
            params['isbn'] = isbn;

            return this._makeRequest("reviews", params);
        },

        byTitle: function(title, params) {
            params = params || {};
            params['title'] = title;

            return this._makeRequest("reviews", params);
        },

        byAuthor: function(author, params) {
            params = params || {};
            params['author'] = author;

            return this._makeRequest("reviews", params);
        }
    }
};
