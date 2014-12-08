GoodReads = function() {};

if (window.DEBUG) {
    GoodReads.base_url = "http://localhost:8000/querygoodreads/";
} else {
    GoodReads.base_url = "http://www.goodreads.com/book/";
}

GoodReads.prototype = {
    api_key: "gKLckSOgRQN1sdJBOm4bw",
    api_secret_key: "c3HJ8nPGSLRbI85m70NpSAD5Ya0Ermrd0v7IWRnGUeU",
    _makeRequest: function(resource, params) {
        var url = GoodReads.base_url + resource;

        if (!window.DEBUG) {
            url += 'p?callback=?';
        }

        params = params || {};
        params['key'] = this.api_key;

        return $.getJSON(url, params);
    },

    widgetByIsbn: function(isbn, params) {
        params = params || {};
        params['isbn'] = isbn;
        params['format'] = 'json';
        return this._makeRequest('book/isbn', params);
    },

    ratingsByIsbnList: function(isbns, params) {
        params = params || {};
        params['isbns'] = isbns.join(',');
        return this._makeRequest("book/review_counts.json", params);
    }
};
