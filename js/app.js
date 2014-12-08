var app = angular.module('PaperbackApp', ['ngSanitize']);

COMMON_LIST = {
"Combined Print & E-Book Fiction":    {"hotkey":"f", alias:"Fiction"},
"Combined Print & E-Book Nonfiction": {"hotkey":"n", alias:"Nonfiction"},
"Politics":                           {"hotkey":"p"},
"Science":                            {},
"Food and Fitness":                   {},
"Sports":                             {"hotkey":"s"},
"Humor":                              {"hotkey":"h"},
"Education":                          {"hotkey":"e"},
"Travel":                             {"hotkey":"t"},
"Family":                             {},
"Health":                             {},
"Fashion: Manners and Customs":       {alias:"Fashion"},
"Relationships":                      {"hotkey":"r"},
"Culture":                            {},
"Celebrities":                        {"hotkey":"c"},
"Animals":                            {"hotkey":"a"},
"Crime and Punishment":               {},
"Games and Activities":               {"hotkey":"g"}
};

app.controller('MainController', ['$scope', '$sce', function($scope, $sce) {
    $scope.nytimes = new NYTimes();
    $scope.goodreads = new GoodReads();

    $scope.range = function(min, max) {
        if (max === undefined && min === undefined) return [];

        if (max === undefined) {
            max = min;
            min = 0;
        }

        var result = new Array(max - min);
        for (var i = 0; i < max - min; i++) {
            result[i] = i + min;
        }

        return result;
    }

    $scope.lists = [];
    $scope.list_message = "Loading lists...";
    $scope.nytimes.books.listNames()
        .done(function(data) {
            $scope.list_message = "";
            data.results.forEach(function(list) {
                var match = COMMON_LIST[list.display_name];
                if (match !== undefined) {
                    list.display_name = match.alias || list.display_name;
                    if (match.hotkey !== undefined) {
                        $(document).bind('keydown', match.hotkey, $scope.selectList.bind($scope, list));
                    }
                    list.hotkey = match.hotkey;
                    $scope.lists.push(list);
                }
            });

            $scope.selectList($scope.lists[0]);
            $scope.$apply();
        })
        .fail(function() {
            $scope.list_message = "Failed to load lists. Try refreshing the page.";
        });

    $scope.current_list = undefined;
    $scope.books_by_isbn = {};

    $scope.getProfessionalReviewsOfBook = function(book) {
        $scope.nytimes.books.byIsbn(book.primary_isbn13)
            .done(function(data) {
                book.reviews = data.results.filter(function(review) {
                    return review.summary.length > 0;
                });
                $scope.$apply();
            });
    };

    $scope.selectList = function(list) {
        $scope.current_list = list;
        if ($scope.current_list.books === undefined) {
            $scope.nytimes.books.byList(list.list_name_encoded)
                .done(function(data) {
                    $scope.current_list.books = [];
                    data.results.books.forEach(function(book) {
                        $scope.books_by_isbn[book.primary_isbn13] = book;
                        $scope.current_list.books.push($scope.books_by_isbn[book.primary_isbn13]);
                    });

                    var isbns = $scope.current_list.books.map(function(book) { return book.primary_isbn13; });
                    $scope.goodreads.ratingsByIsbnList(isbns)
                        .done(function(data) {
                            data.books.forEach(function(book) {
                                $scope.books_by_isbn[book.isbn13].average_rating = parseFloat(book.average_rating);
                                $scope.books_by_isbn[book.isbn13].stars = Math.floor(parseFloat(book.average_rating));
                                $scope.books_by_isbn[book.isbn13].goodreads_id = book.id;
                            });

                            $scope.$apply();
                        });

                    $scope.current_list.books.forEach($scope.getProfessionalReviewsOfBook);
                    $scope.$apply();
                });
        }
        $scope.$apply();
    };
    $scope.SkipValidation = function(value) {
          return $sce.trustAsHtml(value);
    };

    $scope.loadGoodReadsWidget = function(book) {
        $scope.goodreads.widgetByIsbn(book.primary_isbn13)
            .done(function(data) {
                book.more.goodreads_widget = data.reviews_widget;
                book.more.loading = false;
                $scope.$apply();
            })
            .fail(function() {
                book.more.no_reviews = true;
                book.more.loading = false;
                $scope.$apply();
            });
    };

    $scope.loadMoreOfBook = function(book) {
        if (book.more === undefined) {
            book.more = {};
            book.more.show = true;
            book.more.loading = true;

            $scope.loadGoodReadsWidget(book);
        } else {
            book.more.show = !book.more.show;
        }
    };
}]);
