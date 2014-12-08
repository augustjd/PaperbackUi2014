Paperback
=========
To start the webserver, you need [Flask](http://flask.pocoo.org). You can
install it with
```
pip install Flask
```

and then run the server with

```
./app.py
```
The server should be available at *localhost:8000*.

(I'm using the webserver to enable us to cache requests. We can get rid of the
webserver when we make our final submission, I've made it extremely easy to do
so.)

Modifying the stylesheet
------------------------
All styling is done from the single stylesheet ./css/main.css, which has a whole
compiled Bootstrap 3.0 in it. Just put your new rules at the bottom of the doc.

Modifying the HTML
------------------
If you feel the need to reorder the HTML, go ahead. Just don't pull any tags
from inside a block with an ng-repeat decorator to the outside of that block, or
it will no longer work.


This is all set up for using Bootstrap 3.0 with
[Compass](http://compass-style.org/install/). Just type 
```
compass watch .
```

to start compilation of all the .scss files in the sass/ subdirectory.
